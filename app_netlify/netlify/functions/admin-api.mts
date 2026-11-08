// API del pannello amministratore (/admin). Solo per gli account amministratori.
// GET  → panoramica: utenti, community, utenti bloccati
// POST { action, ... } → invite | deleteUser | premium | deletePost | deleteComment | block | unblock
import type { Context } from "@netlify/functions"
import { admin, getIdentityConfig } from "@netlify/identity"
import { deleteDoc, getDoc, listDocs, setFields } from "../lib/firestore.mts"
import { withPremium } from "../lib/play.mts"

const DEFAULT_ADMINS = ["davidepaba66@gmail.com"]
const MODERATION_DOC = "config/moderazione"
const json = (body: unknown, status = 200) => Response.json(body, { status })

interface IdentityUser {
  id: string
  email?: string
  app_metadata?: Record<string, unknown>
}

function identityBase(req: Request) {
  return getIdentityConfig()?.url ?? new URL("/.netlify/identity", req.url).href
}

async function requireAdmin(req: Request): Promise<IdentityUser | null> {
  const auth = req.headers.get("authorization") ?? ""
  if (!/^Bearer\s+\S+/i.test(auth)) return null
  const res = await fetch(`${identityBase(req)}/user`, { headers: { Authorization: auth } })
  if (!res.ok) return null
  const user = (await res.json()) as IdentityUser
  const admins = (Netlify.env.get("ADMIN_EMAILS") ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  const allowed = admins.length ? admins : DEFAULT_ADMINS
  const roles = Array.isArray(user.app_metadata?.roles) ? (user.app_metadata!.roles as string[]) : []
  const isAdmin = (user.email && allowed.includes(user.email.toLowerCase())) || roles.includes("admin")
  return isAdmin ? user : null
}

async function listAllUsers() {
  const all = []
  for (let page = 1; page <= 20; page++) {
    const batch = await admin.listUsers({ page, perPage: 200 })
    all.push(...batch)
    if (batch.length < 200) break
  }
  return all
}

async function getBlocked(): Promise<string[]> {
  const doc = await getDoc(MODERATION_DOC)
  const list = doc?.data?.bloccati
  return Array.isArray(list) ? (list as string[]) : []
}

async function overview() {
  const users = await listAllUsers()
  const emailById = new Map(users.map((u) => [u.id, u.email ?? ""]))

  let activity = new Map<string, Record<string, unknown>>()
  let posts: unknown[] = []
  let blocked: string[] = []
  let firestoreError: string | null = null
  try {
    const act = await listDocs("utenti_attivita")
    activity = new Map(act.map((d) => [d.id, d.data]))
    blocked = await getBlocked()
    const rawPosts = (await listDocs("posts", 300)).sort((a, b) =>
      String(b.data.createdAt ?? "").localeCompare(String(a.data.createdAt ?? "")),
    )
    posts = await Promise.all(
      rawPosts.map(async (p) => {
        const comments = (await listDocs(`posts/${p.id}/comments`, 500))
          .sort((a, b) => String(a.data.createdAt ?? "").localeCompare(String(b.data.createdAt ?? "")))
          .map((c) => ({
            id: c.id,
            author: c.data.author ?? "",
            authorId: c.data.authorId ?? null,
            authorEmail: c.data.authorId ? emailById.get(String(c.data.authorId)) ?? null : null,
            text: c.data.text ?? "",
            createdAt: c.data.createdAt ?? null,
          }))
        return {
          id: p.id,
          author: p.data.author ?? "",
          authorId: p.data.authorId ?? null,
          authorEmail: p.data.authorId ? emailById.get(String(p.data.authorId)) ?? null : null,
          text: p.data.text ?? "",
          photoURL: p.data.photoURL ?? null,
          createdAt: p.data.createdAt ?? null,
          comments,
        }
      }),
    )
  } catch (err) {
    console.error("admin-api: Firestore", err)
    firestoreError = String((err as Error).message ?? err)
  }

  return {
    users: users.map((u) => {
      const meta = (u.appMetadata ?? {}) as Record<string, unknown>
      const roles = Array.isArray(meta.roles) ? (meta.roles as string[]) : []
      const a = activity.get(u.id) ?? {}
      return {
        id: u.id,
        email: u.email ?? "",
        name: u.name ?? "",
        createdAt: u.createdAt ?? null,
        confirmed: !!u.confirmedAt,
        invited: !!u.invitedAt && !u.confirmedAt,
        lastSignInAt: u.lastSignInAt ?? null,
        lastActivity: (a.ultimoAccesso as string) ?? null,
        visits: (a.accessi as number) ?? 0,
        premium: roles.includes("premium"),
        premiumSource: (meta.premium_source as string) ?? (roles.includes("premium") ? "manuale" : null),
        playExpiry: (meta.play_expiry as string) ?? null,
        admin: roles.includes("admin"),
        blocked: blocked.includes(u.id),
      }
    }),
    posts,
    blocked,
    firestoreError,
  }
}

export default async (req: Request, _context: Context) => {
  const me = await requireAdmin(req)
  if (!me) return json({ error: "forbidden" }, 403)

  try {
    if (req.method === "GET") return json(await overview())
    if (req.method !== "POST") return json({ error: "method" }, 405)

    const body = (await req.json().catch(() => ({}))) as Record<string, any>
    const id = typeof body.id === "string" ? body.id : ""

    switch (body.action) {
      case "invite": {
        const email = String(body.email ?? "").trim()
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "email" }, 400)
        const token = (globalThis as any).netlifyIdentityContext?.token
        if (!token) return json({ error: "no_operator_token" }, 500)
        const res = await fetch(`${identityBase(req)}/invite`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        if (!res.ok) {
          const t = await res.json().catch(() => ({}))
          return json({ error: t.msg ?? `invite ${res.status}` }, res.status === 422 ? 409 : 502)
        }
        return json({ ok: true })
      }
      case "deleteUser": {
        if (!id || id === me.id) return json({ error: "id" }, 400)
        await admin.deleteUser(id)
        return json({ ok: true })
      }
      case "premium": {
        if (!id) return json({ error: "id" }, 400)
        const user = await admin.getUser(id)
        const on = !!body.on
        await admin.updateUser(id, {
          app_metadata: withPremium(user.appMetadata, on, { premium_source: on ? "manuale" : null }),
        })
        // L'utente vede il cambio al prossimo accesso o aggiornamento della sessione.
        return json({ ok: true })
      }
      case "deletePost": {
        if (!id) return json({ error: "id" }, 400)
        const comments = await listDocs(`posts/${id}/comments`, 2000)
        await Promise.all(comments.map((c) => deleteDoc(c.path)))
        await deleteDoc(`posts/${id}`)
        return json({ ok: true })
      }
      case "deleteComment": {
        const postId = typeof body.postId === "string" ? body.postId : ""
        if (!id || !postId) return json({ error: "id" }, 400)
        await deleteDoc(`posts/${postId}/comments/${id}`)
        return json({ ok: true })
      }
      case "block":
      case "unblock": {
        if (!id || id === me.id) return json({ error: "id" }, 400)
        const list = new Set(await getBlocked())
        if (body.action === "block") list.add(id)
        else list.delete(id)
        await setFields(MODERATION_DOC, { bloccati: [...list] })
        return json({ ok: true, blocked: [...list] })
      }
      default:
        return json({ error: "action" }, 400)
    }
  } catch (err) {
    console.error("admin-api", err)
    return json({ error: String((err as Error).message ?? err) }, 500)
  }
}
