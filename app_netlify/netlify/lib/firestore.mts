// Accesso minimo a Firestore (progetto Firebase della community) via REST,
// con lo stesso account di servizio Google usato per Google Play.
import { FIRESTORE_SCOPE, getGoogleAccessToken } from "./play.mts"

const PROJECT = "pizza-perfetta-community"
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`

type FsValue = Record<string, any>

function decode(v: FsValue | undefined): unknown {
  if (!v) return null
  if ("stringValue" in v) return v.stringValue
  if ("integerValue" in v) return Number(v.integerValue)
  if ("doubleValue" in v) return v.doubleValue
  if ("booleanValue" in v) return v.booleanValue
  if ("timestampValue" in v) return v.timestampValue
  if ("nullValue" in v) return null
  if ("arrayValue" in v) return (v.arrayValue.values ?? []).map(decode)
  if ("mapValue" in v) return decodeFields(v.mapValue.fields)
  return null
}
function decodeFields(fields: Record<string, FsValue> | undefined) {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(fields ?? {})) out[k] = decode(v)
  return out
}
function encode(v: unknown): FsValue {
  if (v === null || v === undefined) return { nullValue: null }
  if (Array.isArray(v)) return { arrayValue: { values: v.map(encode) } }
  if (typeof v === "boolean") return { booleanValue: v }
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }
  if (typeof v === "object") {
    const fields: Record<string, FsValue> = {}
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) fields[k] = encode(x)
    return { mapValue: { fields } }
  }
  return { stringValue: String(v) }
}

async function call(path: string, init: RequestInit = {}) {
  const token = await getGoogleAccessToken(FIRESTORE_SCOPE)
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  })
  if (res.status === 404 && (init.method ?? "GET") === "GET") return null
  if (!res.ok) {
    const txt = await res.text().catch(() => "")
    throw new Error(`Firestore ${res.status}: ${txt.slice(0, 200)}`)
  }
  return res.status === 204 ? {} : res.json()
}

export interface FsDoc {
  id: string
  path: string
  data: Record<string, unknown>
}
const toDoc = (d: { name: string; fields?: Record<string, FsValue> }): FsDoc => ({
  id: d.name.split("/").pop() as string,
  path: d.name.split("/documents/")[1],
  data: decodeFields(d.fields),
})

// Legge tutti i documenti di una raccolta (con paginazione).
export async function listDocs(collectionPath: string, max = 2000): Promise<FsDoc[]> {
  const out: FsDoc[] = []
  let pageToken = ""
  do {
    const q = new URLSearchParams({ pageSize: "300" })
    if (pageToken) q.set("pageToken", pageToken)
    const data = (await call(`/${collectionPath}?${q}`)) as { documents?: any[]; nextPageToken?: string } | null
    for (const d of data?.documents ?? []) out.push(toDoc(d))
    pageToken = data?.nextPageToken ?? ""
  } while (pageToken && out.length < max)
  return out
}

export async function getDoc(docPath: string): Promise<FsDoc | null> {
  const d = await call(`/${docPath}`)
  return d ? toDoc(d as any) : null
}

export async function deleteDoc(docPath: string): Promise<void> {
  await call(`/${docPath}`, { method: "DELETE" })
}

// Scrive (o crea) i campi indicati di un documento, lasciando gli altri invariati.
export async function setFields(docPath: string, fields: Record<string, unknown>): Promise<void> {
  const mask = Object.keys(fields).map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join("&")
  const body = { fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, encode(v)])) }
  await call(`/${docPath}?${mask}`, { method: "PATCH", body: JSON.stringify(body) })
}
