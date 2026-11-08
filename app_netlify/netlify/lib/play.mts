// Helper condivisi per Google Play Billing (abbonamento Premium).
import { createHash, createSign } from "node:crypto"

export const PACKAGE_NAME = "app.netlify.pizza_perfetta_a_casa.twa"
export const PRODUCT_ID = "premium_mensile"
export const STORE_NAME = "play-purchases"

// Stati in cui l'utente deve avere accesso Premium.
const ACCESS_STATES = new Set([
  "SUBSCRIPTION_STATE_ACTIVE",
  "SUBSCRIPTION_STATE_IN_GRACE_PERIOD",
  "SUBSCRIPTION_STATE_CANCELED", // annullato ma ancora pagato fino alla scadenza
])

export const tokenKey = (purchaseToken: string) =>
  createHash("sha256").update(purchaseToken).digest("hex")

const b64url = (input: string | Buffer) =>
  Buffer.from(input).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")

const cachedTokens = new Map<string, { value: string; exp: number }>()
const PLAY_SCOPE = "https://www.googleapis.com/auth/androidpublisher"
export const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/datastore"

// Token OAuth dell'account di servizio Google (di base: Android Publisher).
export async function getGoogleAccessToken(scope: string = PLAY_SCOPE): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const cached = cachedTokens.get(scope)
  if (cached && cached.exp - 60 > now) return cached.value

  let email = Netlify.env.get("GOOGLE_SA_EMAIL")
  let rawKey = Netlify.env.get("GOOGLE_SA_PRIVATE_KEY")?.trim()
  // Accetta anche il file JSON completo dell'account di servizio incollato nella variabile.
  if (rawKey?.startsWith("{")) {
    const sa = JSON.parse(rawKey) as { private_key?: string; client_email?: string }
    rawKey = sa.private_key
    email = email || sa.client_email
  }
  if (!email || !rawKey) throw new Error("GOOGLE_SA_EMAIL o GOOGLE_SA_PRIVATE_KEY mancanti")
  const privateKey = rawKey.replace(/\\n/g, "\n")

  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claims = b64url(
    JSON.stringify({
      iss: email,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  )
  const signer = createSign("RSA-SHA256")
  signer.update(`${header}.${claims}`)
  const signature = b64url(signer.sign(privateKey))

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.access_token) throw new Error(`Token Google non ottenuto (${res.status})`)
  cachedTokens.set(scope, { value: data.access_token, exp: now + (data.expires_in ?? 3600) })
  return data.access_token as string
}

export interface PlaySubscription {
  subscriptionState?: string
  acknowledgementState?: string
  linkedPurchaseToken?: string
  testPurchase?: unknown
  lineItems?: { productId?: string; expiryTime?: string }[]
}

// Legge lo stato dell'abbonamento da Google Play (subscriptionsv2).
export async function getSubscription(purchaseToken: string): Promise<PlaySubscription | null> {
  const token = await getGoogleAccessToken()
  const url =
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}` +
    `/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (res.status === 404 || res.status === 410 || res.status === 400) return null
  if (!res.ok) throw new Error(`Google Play ha risposto ${res.status}`)
  return (await res.json()) as PlaySubscription
}

// Conferma l'acquisto: senza conferma entro 3 giorni Google rimborsa e annulla.
export async function acknowledge(purchaseToken: string): Promise<void> {
  const token = await getGoogleAccessToken()
  const url =
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}` +
    `/purchases/subscriptions/${PRODUCT_ID}/tokens/${encodeURIComponent(purchaseToken)}:acknowledge`
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
  })
  if (!res.ok && res.status !== 409) throw new Error(`Conferma acquisto fallita (${res.status})`)
}

export function summarize(sub: PlaySubscription) {
  const item = (sub.lineItems ?? []).find((l) => l.productId === PRODUCT_ID)
  const hasAccess = !!item && ACCESS_STATES.has(sub.subscriptionState ?? "") &&
    (!item.expiryTime || new Date(item.expiryTime).getTime() > Date.now())
  return {
    hasAccess,
    productOk: !!item,
    state: sub.subscriptionState ?? "",
    expiryTime: item?.expiryTime ?? null,
    needsAck: sub.acknowledgementState === "ACKNOWLEDGEMENT_STATE_PENDING",
    test: !!sub.testPurchase,
  }
}

// Aggiunge o toglie il ruolo "premium" mantenendo gli altri dati dell'utente.
export function withPremium(
  appMetadata: Record<string, unknown> | undefined,
  on: boolean,
  extra: Record<string, unknown>,
) {
  const meta = { ...(appMetadata ?? {}) }
  const roles = new Set(Array.isArray(meta.roles) ? (meta.roles as string[]) : [])
  if (on) roles.add("premium")
  else roles.delete("premium")
  return { ...meta, ...extra, roles: [...roles] }
}
