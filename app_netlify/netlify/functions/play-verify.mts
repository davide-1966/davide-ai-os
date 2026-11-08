// Verifica un acquisto Google Play e attiva il Premium sull'account Netlify Identity.
// Chiamata dall'app (TWA) dopo l'acquisto o al ripristino: POST { purchaseToken }
// con l'header Authorization: Bearer <JWT dell'utente>.
import type { Context } from "@netlify/functions"
import { admin, getIdentityConfig } from "@netlify/identity"
import { getStore } from "@netlify/blobs"
import {
  STORE_NAME,
  acknowledge,
  getSubscription,
  summarize,
  tokenKey,
  withPremium,
} from "../lib/play.mts"

const json = (body: unknown, status = 200) => Response.json(body, { status })

interface IdentityUser {
  id: string
  email?: string
  app_metadata?: Record<string, unknown>
}

async function currentUser(req: Request): Promise<IdentityUser | null> {
  const auth = req.headers.get("authorization") ?? ""
  if (!/^Bearer\s+\S+/i.test(auth)) return null
  const base = getIdentityConfig()?.url ?? new URL("/.netlify/identity", req.url).href
  const res = await fetch(`${base}/user`, { headers: { Authorization: auth } })
  if (!res.ok) return null
  const user = (await res.json()) as IdentityUser
  return user?.id ? user : null
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") return json({ error: "method" }, 405)

  const user = await currentUser(req)
  if (!user) return json({ error: "login" }, 401)

  const body = await req.json().catch(() => ({}))
  const purchaseToken = typeof body?.purchaseToken === "string" ? body.purchaseToken.trim() : ""
  if (!purchaseToken || purchaseToken.length > 4096) return json({ error: "token" }, 400)

  let sub
  try {
    sub = await getSubscription(purchaseToken)
  } catch (err) {
    console.error("play-verify: lettura Google Play", err)
    return json({ error: "google" }, 502)
  }
  if (!sub) return json({ error: "not_found", premium: false }, 404)

  const info = summarize(sub)
  if (!info.productOk) return json({ error: "product", premium: false }, 400)

  // Un abbonamento vale per un solo account: blocca il riuso su account diversi.
  const store = getStore(STORE_NAME)
  const key = tokenKey(purchaseToken)
  const existing = (await store.get(key, { type: "json" })) as { userId?: string } | null
  if (existing?.userId && existing.userId !== user.id) {
    return json({ error: "other_account", premium: false }, 409)
  }

  if (info.hasAccess && info.needsAck) {
    try {
      await acknowledge(purchaseToken)
    } catch (err) {
      console.error("play-verify: conferma acquisto", err)
      return json({ error: "ack" }, 502)
    }
  }

  await store.setJSON(key, {
    userId: user.id,
    email: user.email ?? null,
    purchaseToken,
    state: info.state,
    expiryTime: info.expiryTime,
    test: info.test,
    updatedAt: new Date().toISOString(),
  })

  // Il Premium arrivato da altre vie (Gumroad, attivazione a mano) non viene toccato.
  const meta = user.app_metadata ?? {}
  const roles = Array.isArray(meta.roles) ? (meta.roles as string[]) : []
  const alreadyPremiumElsewhere = roles.includes("premium") && meta.premium_source !== "play"

  if (!alreadyPremiumElsewhere) {
    await admin.updateUser(user.id, {
      app_metadata: withPremium(meta, info.hasAccess, {
        premium_source: "play",
        play_expiry: info.expiryTime,
      }),
    })
  }

  // Il nuovo ruolo vale dal prossimo aggiornamento del token: l'app lo forza subito dopo.
  return json({ premium: info.hasAccess || alreadyPremiumElsewhere, state: info.state, expiryTime: info.expiryTime })
}
