// Controllo giornaliero degli abbonamenti Google Play: toglie il Premium
// a chi ha disdetto ed è arrivato alla scadenza, lo rimette a chi ha rinnovato.
import type { Config } from "@netlify/functions"
import { admin } from "@netlify/identity"
import { getStore } from "@netlify/blobs"
import { STORE_NAME, getSubscription, summarize, withPremium } from "../lib/play.mts"

interface Record_ {
  userId: string
  purchaseToken: string
  state?: string
  expiryTime?: string | null
}

export default async () => {
  const store = getStore(STORE_NAME)
  const { blobs } = await store.list()
  let checked = 0
  let changed = 0

  for (const { key } of blobs) {
    const rec = (await store.get(key, { type: "json" })) as Record_ | null
    if (!rec?.userId || !rec.purchaseToken) continue
    try {
      const sub = await getSubscription(rec.purchaseToken)
      const info = sub ? summarize(sub) : { hasAccess: false, state: "NOT_FOUND", expiryTime: null }
      checked++

      const user = await admin.getUser(rec.userId).catch(() => null)
      if (!user) continue
      const meta = (user.appMetadata ?? {}) as Record<string, unknown>
      const roles = Array.isArray(meta.roles) ? (meta.roles as string[]) : []
      const hasRole = roles.includes("premium")

      // Tocca solo il Premium arrivato da Google Play.
      if (meta.premium_source === "play" || !hasRole) {
        if (hasRole !== info.hasAccess) {
          await admin.updateUser(rec.userId, {
            app_metadata: withPremium(meta, info.hasAccess, {
              premium_source: "play",
              play_expiry: info.expiryTime,
            }),
          })
          changed++
        }
      }

      await store.setJSON(key, {
        ...rec,
        state: info.state,
        expiryTime: info.expiryTime,
        updatedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error("play-sync: errore su", key, err)
    }
  }

  console.log(`play-sync: ${checked} abbonamenti controllati, ${changed} account aggiornati`)
}

export const config: Config = {
  // Ogni giorno alle 04:00 UTC (05:00 in Germania d'inverno, 06:00 d'estate).
  schedule: "0 4 * * *",
}
