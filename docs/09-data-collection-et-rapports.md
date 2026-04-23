# 09 — Data collection et rapports publics

> Décision actée 2026-04-23 (session 3). Pivot stratégique : la data collectée n'est pas juste un outil de décision produit — c'est un **asset défendable en soi** (SEO, trust communauté, valeur pour acquéreur potentiel). Ce document supersede partiellement [docs/07](07-metrics-et-tracking.md) sur l'ambition du tracking, conserve intactes ses red lines privacy.

---

## 1. Pivot stratégique — la data comme asset

**Le code Clawkin est réplicable en 2-3 semaines par n'importe quel dev motivé. Le dataset de 12 mois d'usage agrégé Claude Code est irréplicable par construction — il faut avoir été là en premier.**

Ce renversement a trois implications directes :

1. **Asset de rachat** — pour un acquéreur potentiel (Anthropic, GitHub/Microsoft, Datadog, Cursor, JetBrains, Linear, Vercel), la data agrégée vaut potentiellement plus que le produit lui-même. Unique raison pour laquelle Clawkin serait valorisé au-delà de son ARR.

2. **Moteur SEO et trust** — publier un "State of Claude Code" trimestriel attire du trafic qualifié (presse dev, HN, VCs, journalistes) et génère des backlinks cités. Playbook éprouvé par Stack Overflow Developer Survey, GitHub Octoverse, JetBrains Developer Ecosystem, Datadog State of DevOps, Vercel State of Frontend.

3. **Première extensive library publique sur Claude Code** — même Anthropic ne publie pas ce niveau de métadonnées agrégées publiquement. Position de référence unique, non attaquable par les concurrents qui arriveraient plus tard.

La conséquence de design : **l'instrumentation V1 doit être pensée dès J1 comme une data pipeline orientée publication, pas juste un dashboard admin opérationnel.**

---

## 2. Principe directeur — local aggregation, scalar upload

Le CLI tourne en local sur la machine du dev. Il voit tout ce que Claude Code émet (hooks lifecycle + JSON statusline). Il agrège on-device et n'upload que des scalaires et histogrammes périodiques. Jamais du log session-par-session brut côté serveur. Jamais de contenu.

**Conséquences :**
- Zéro capacité de ré-identification depuis les données uploadées
- Un event perdu côté réseau = une journée sous-comptée, pas une perte silencieuse permanente
- Red lines privacy intactes : rien de ce qu'on upload ne dépasse ce qu'on pourrait justifier publiquement
- Le user a accès à ses données granulaires en local (fichier `~/.config/clawkin/stats.json`) même si le serveur ne reçoit que des agrégats

---

## 3. Ce qu'on collecte — schéma exhaustif

### 3.1 Signaux captés en local par le CLI

Catégorisés par source. Tous agrégés localement avant upload.

**Depuis les hooks lifecycle Claude Code**

| Event | Data capturée | Pour mesurer quoi |
|---|---|---|
| `SessionStart` | timestamp, model, cwd_hash | Sessions par jour, distribution horaire, adoption modèles |
| `Stop` | timestamp, durée depuis SessionStart | Durée session |
| `PreCompact` | timestamp | Sessions qui saturent le contexte |
| `SessionEnd` | timestamp, type (clean/compact/abandon) | Quality proxy |
| `PreToolUse` | tool_name uniquement (Read, Edit, Bash, WebFetch, mcp__*, etc.) | Tool call distribution, MCP adoption |
| `PostToolUse` | tool_name, success/error | Tool reliability distribution |

**Depuis le JSON statusline (stdin à chaque refresh)**

| Champ | Data capturée | Pour mesurer quoi |
|---|---|---|
| `context_window.used_percentage` | bucket {0-25, 25-50, 50-75, 75-90, 90-100} | Compact pressure, saturation |
| `cost.total_cost_usd` | float → bucket {<0.01, 0.01-0.1, 0.1-0.5, 0.5-2, >2} | Cost distribution |
| `model` | string | Adoption modèles (Opus/Sonnet/Haiku/etc.) |
| durée session dérivée | seconds → bucket | Session duration histogram |

**Signaux dérivés par le CLI localement**

| Métrique | Calcul | Valeur |
|---|---|---|
| `clean_shot_ratio` | sessions avec Stop suivi d'aucun nouveau prompt < 60s / total sessions | Quality proxy |
| `compact_rate` | sessions avec PreCompact / total sessions | Saturation contexte |
| `session_intensity` | tool_calls / durée session | Active usage vs idle |
| `daily_streak` | jours actifs consécutifs | Régularité |
| `peak_hour_local` | heure avec le plus de sessions (tz user) | Pattern temporel |

### 3.2 Signaux captés côté serveur

Depuis les logs natifs Vercel/Cloudflare + webhooks Stripe + logs Plausible.

| Event | Source | Usage |
|---|---|---|
| `install_script_served` | Route `/install` | Install count brut |
| `badge_served` | Route `/c/:hash.svg` et `/u/:handle.svg` | Vues badges, ratio paid/free |
| `profile_viewed` | Route `/u/:handle` | Engagement pages profil |
| `handle_reserved` | Endpoint reservation | Funnel freemium |
| `checkout_completed` | Stripe webhook | Conversion paid |
| `invoice_paid` | Stripe webhook | Renouvellements |
| `subscription_cancelled` | Stripe webhook | Churn paid |
| `landing_pageview` | Plausible / CF Analytics | Funnel acquisition |

### 3.3 Dimensions croisables pour les rapports publics

Chaque upload quotidien contient un payload pré-agrégé dont les dimensions sont :

```
{
  window: "2026-04-23",                    // date rollup quotidien
  uuid_hash: "a3f1...",                    // UUID anonyme (cf §5)
  sessions_count: 7,
  total_cost_usd_bucket: "0.5-2",          // pas la valeur brute, le bucket
  model_distribution: {                     // % de sessions par modèle
    "opus-4-7": 0.6,
    "sonnet-4-6": 0.3,
    "haiku-4-5": 0.1
  },
  context_pressure: {                       // % de sessions dans chaque bucket
    "0-25": 0.2, "25-50": 0.3,
    "50-75": 0.3, "75-90": 0.15, "90-100": 0.05
  },
  tool_histogram: {                         // % tool calls par type
    "Read": 0.45, "Edit": 0.20, "Bash": 0.15,
    "WebFetch": 0.05, "mcp__*": 0.15
  },
  compact_rate: 0.15,                       // % sessions compactées
  clean_shot_ratio: 0.78,                   // % sessions clean
  session_duration_histogram: {             // sessions par bucket de durée
    "<5min": 2, "5-15min": 3, "15-60min": 2, ">60min": 0
  },
  peak_hour_local: 15,                      // heure tz locale
  country_tz_bucket: "Europe/Paris",        // pas la ville, juste la TZ
  mcp_servers_seen: ["notion", "linear"],   // noms MCP uniquement, pas contenus
  clawkin_level: 47,
  clawkin_xp: 1234,
  version_clawkin: "0.3.1"
}
```

Granularité serveur : les payloads bruts sont gardés 90j pour debug, puis seuls les rollups quotidiens/hebdo/mensuels sont conservés indéfiniment. Les agrégats publiables n'ont jamais de dimension `uuid_hash`.

---

## 4. Red lines — ce qu'on ne collecte JAMAIS

Repris de [docs/07 §7](07-metrics-et-tracking.md#section-7) et intensifiés vu le nouveau volume de données. Franchir une seule détruit le positionnement awareness et la crédibilité produit.

- ❌ **Contenu des prompts et réponses Claude Code** — jamais, sous aucune forme, y compris hashé
- ❌ **Noms de fichiers lus ou édités** (juste `tool_name: "Read"`, pas le path)
- ❌ **Commandes bash exécutées** (juste `tool_name: "Bash"`, pas la commande)
- ❌ **Contenu des MCPs** (juste le nom du serveur MCP, pas les arguments ni les retours)
- ❌ **Noms de repo, noms de branche, noms de projet** (`cwd_hash` seulement, jamais le path)
- ❌ **Google Analytics / Segment / Mixpanel / FullStory** sur le CLI ou la landing
- ❌ **Session recording / heatmap / replay** partout
- ❌ **Email collection sur la landing** — l'install reste le seul CTA
- ❌ **Fingerprinting cross-session ou cross-device pour les free users**
- ❌ **IP address stockée** — discardée immédiatement après avoir dérivé la TZ
- ✅ **Opt-out universel `CLAWKIN_NO_TELEMETRY=1`** documenté dans : README, footer landing, `--help` du CLI, page `/privacy`

---

## 5. Identité anonyme free user — solutions au problème de rétention

**Problème** : un UUID aléatoire généré à l'install nous fait perdre la rétention dès qu'un user réinstalle (nouvelle machine, wipe, changement d'OS). Rétention sur-estimée sur le churn, sous-estimée sur le retour.

**Arbitrage retenu (2026-04-23)** : **acceptable, on utilise la solution (c) — UUID stocké hors volatile.**

### Options évaluées

**(a) Hash de `git config user.email` comme UUID primaire**
- ✅ Persiste cross-machine si même email git
- ✅ Transparent (le user peut le régénérer en changeant son git email)
- ❌ Quasi-ré-identification si le dataset fuite (hash email = email unique)
- ❌ Debat éthique : on touche à de la donnée perso même hashée

**(b) Machine fingerprint soft** = hash(hostname + username + OS)
- ✅ Persiste aux réinstalls sur la même machine
- ❌ Pas cross-machine
- ❌ Zone grise privacy (fingerprinting quand même)

**(c) UUID aléatoire stocké dans `~/.config/clawkin/uuid`** (fichier séparé)
- ✅ Persiste aux réinstalls tant que le config n'est pas wipé
- ✅ Zéro question éthique — aléatoire, non ré-identifiable
- ✅ Transparent au user (il peut supprimer ou régénérer)
- ❌ Pas cross-machine
- ❌ Un full wipe = nouveau user

**(d) GitHub OAuth pour tout le monde** — rejeté (casse le frictionless free tier, contredit le positionnement)

### Solution implémentée

**UUID aléatoire (crypto-random 128 bits) stocké dans `~/.config/clawkin/uuid`**, séparé du `state.json` pour persister même si l'user reset son pet en effaçant le state.

```
~/.config/clawkin/
├── uuid              ← persistant, survit aux réinstalls tant que dir non wipée
├── state.json        ← niveau, XP, streak, derniers pings
└── events.jsonl      ← buffer événements locaux avant flush serveur
```

### Accepter le bruit résiduel

Le bruit (réinstall totale + wipe config) est estimé à 3-7% par an sur des devs pros qui changent de machine. On accepte ce bruit statistique plutôt que d'ajouter de la surveillance. Pour les paid users : le GitHub OAuth fournit déjà un identifiant persistent, donc le problème ne se pose que pour les free.

Documentation publique `/privacy` explique exactement cette mécanique : transparence = confiance.

---

## 6. Transport des events CLI → serveur

**Problème initial** : si le CLI ping le serveur à chaque upgrade_prompt_shown, à chaque clean_shot_ratio update, à chaque achievement, on a potentiellement plusieurs dizaines d'appels réseau par jour → latence user (même non-bloquante, elle pollue le terminal), consommation batterie laptop, surfaces d'erreur quand offline.

**Arbitrage retenu (2026-04-23)** : **acceptable, on utilise le pattern buffer local + flush quotidien.**

### Options évaluées

**(a) Fire and forget async** — CLI dispatch chaque event en background, no retry, perte acceptable
- ✅ Simple
- ❌ Perte silencieuse offline
- ❌ Multiples requêtes/jour/user = bruit réseau + coût serveur
- ❌ Pas de dédup possible (prompt affiché 5× = 5 events)

**(b) Buffer local + flush quotidien** — events accumulés dans `~/.config/clawkin/events.jsonl`, flush une fois par jour via le même appel que le daily_ping
- ✅ Résilient au offline (flush au prochain jour en ligne)
- ✅ Dédup facile côté CLI avant upload (une fois par trigger par jour)
- ✅ Un seul appel réseau par jour par user → coût serveur minimal
- ✅ Zéro latence perceptible côté user (tout en local pendant la journée)
- ❌ Pas de vrai temps réel, mais on s'en fout pour ce use case

**(c) Full retry queue avec ACK serveur** — overkill pour un pet, ajoute une dépendance réseau fiable. Rejeté.

### Solution implémentée

**Pattern retenu : (b) buffer local + flush quotidien.**

```
Pendant la journée :
  - Tous les events s'accumulent dans ~/.config/clawkin/events.jsonl
  - Les agrégats locaux (stats.json) sont mis à jour au fil de l'eau
  - Zéro appel réseau

Une fois par jour (au premier SessionStart après minuit UTC) :
  - CLI calcule le rollup quotidien depuis events.jsonl
  - Flush au endpoint /ping avec le payload agrégé (cf §3.3)
  - Si échec réseau : retry au prochain SessionStart du jour
  - events.jsonl purgé côté local après ACK (garder 7j pour debug si CLAWKIN_DEBUG=1)
```

**Implication UX** : zéro friction pour l'user, tout tourne en background. Zéro latence pendant l'usage.

**Implication serveur** : ~1 POST / user / jour. À 10k users actifs, 10k req/jour = 0.12 req/sec. Cloudflare edge function gère ça sans effort, coût ~0.

**Implication data** : pas de temps réel, mais les rapports publics tournent en batch quotidien de toute façon. Aucune perte.

---

## 7. Stockage et rétention

### 7.1 Côté CLI (local)

| Fichier | Rétention | Justification |
|---|---|---|
| `~/.config/clawkin/uuid` | Indéfinie (le user peut supprimer) | Identité persistante |
| `~/.config/clawkin/state.json` | Indéfinie | État du pet |
| `~/.config/clawkin/stats.json` | Rolling 90j | Histogrammes perso, accessible via `clawkin stats` |
| `~/.config/clawkin/events.jsonl` | 7j (rolling) | Buffer avant flush, kept for debug |

### 7.2 Côté serveur (KV / stockage)

| Donnée | Rétention | Justification |
|---|---|---|
| Raw event payloads quotidiens | 90j | Debug, ré-agrégation possible en cas de bug schema |
| Rollups quotidiens agrégés (pas par uuid, stats globales) | Indéfinie | Base du State of Claude Code |
| Rollups hebdomadaires agrégés | Indéfinie | Tendances |
| Rollups mensuels agrégés | Indéfinie | Rapports trimestriels |
| UUID hash + date d'install | Indéfinie | DAU/MAU et rétention |
| Stripe events (paid users) | Indéfinie | Compta + churn |
| Handle reservations | Indéfinie (active) / 60j (expired) | Grace period |
| IP logs natifs Vercel/CF | 30j max | Discardé après dérivation TZ |

**Principe** : les agrégats publiables n'ont jamais de dimension `uuid_hash`. Ce sont des distributions anonymes par construction.

---

## 8. Rapports publics — rythmique et format

### 8.1 Rythmique

| Milestone | Contenu | Objectif |
|---|---|---|
| M+1 (post-launch) | Post blog court "First 1000 installs of Clawkin" | Amorçage SEO, premier backlink |
| M+3 | Premier mini "State of Claude Code" (si ≥ 2k installs) | Première citation presse, trust communauté |
| Trimestriel | "State of Claude Code — Q{N} 2026" — 5-10 insights, graphes, dataset JSON public | Référence du domaine |
| M+12 | Annual "State of Claude Code 2026" — version longue, interviews, benchmarks | Pic annuel de visibilité |

### 8.2 Contenu type

Headlines qui feraient cliquer (exemples testables) :

- "68% des sessions Claude Code atteignent 75% du contexte — la saturation est la norme"
- "Les devs Claude Code utilisent Opus à 60%, Sonnet à 30%, Haiku à 10%"
- "Read est le tool le plus appelé (45%), loin devant Edit (20%) et Bash (15%)"
- "Un dev Claude Code actif tourne en moyenne 4,2 sessions/jour, peak à 15h locale"
- "Clean-shot ratio médian : 78% — c'est-à-dire que 22% des réponses nécessitent un re-prompt"
- "MCP adoption accélère : 34% des sessions utilisent au moins un MCP, vs 12% il y a 3 mois"
- "Cost médian par session : 0,15$. Top 10% des devs : 1,20$/session"
- "Les devs qui compactent le moins ont des sessions 2× plus courtes en moyenne"

### 8.3 Format de publication

- **Page web** `clawkin.sh/reports/state-of-claude-code-q2-2026` avec charts interactifs
- **JSON public** `clawkin.sh/data/q2-2026.json` pour être cité et ré-utilisé par journalistes/chercheurs
- **Blog post Medium/Substack** synthétisé pour l'audience large
- **Thread Twitter** avec 5-8 insights visuels
- **Post HN** "State of Claude Code — Q2 2026 data"
- **Email direct aux journalistes dev** (TechCrunch, The Register, Ars, Dev Insider) une fois par trimestre

---

## 9. /state public — seuil d'activation

**Arbitrage retenu (2026-04-23)** : **pas au launch. Activation à partir de 500 installs.**

### Pourquoi pas au launch

- Avant 500 installs, les chiffres sont trop faibles pour être impressionnants. Publier "23 installs" est contre-productif (signal de mort).
- Les concurrents potentiels (Anthropic qui pourrait ship un pet, Codeium, Cursor) n'ont pas besoin d'être informés trop tôt du rythme d'adoption.
- Le build-in-public peut se faire via Twitter perso sans exposer les chiffres exacts sur le site officiel.

### Pourquoi à 500 installs

- 500 = signal de traction réelle (pas juste friends & family), crédible en public.
- Point d'inflexion où la transparence renforce la trust (cf Basecamp, Plausible, Buffer qui publient leurs chiffres à partir d'un seuil similaire).
- Fenêtre typique : M+1 à M+2 selon le launch.

### Contenu quand activé

Page `clawkin.sh/state` minimaliste, mise à jour quotidienne :

```
Clawkin — live stats
─────────────────────
Installs cumulés       : 1 247
Active this week       : 823
Active today           : 184
Paid members           : 28
─────────────────────
Built by @edouardtiem
Updated every 24h
```

Volontairement austère. Pas de benchmarks internes ("you're in the top X%"), pas de comparaisons individuelles — juste des chiffres globaux. Trust = transparence brute.

### À décider à la bascule

- Est-ce qu'on publie le paid count (signal revenue) ou juste free ? Probablement pas avant M+3 pour éviter les comparaisons ARR sauvages.
- Est-ce qu'on ajoute un compteur de pays actifs ? (fun, pas sensible, good signal)

---

## 10. Risque Anthropic — anticipation

Si le dataset devient vraiment précieux, trois scénarios Anthropic :

### Scénario A — acquisition (idéal)
Anthropic voit la valeur de l'asset et propose rachat. Plan parfait. Rien à faire pour préparer, juste être prêt à pitcher la data comme asset distinct du produit.

### Scénario B — partnership / TOS tightening (probable)
Anthropic demande des garanties écrites sur ce qu'on collecte, sollicite un partage des rapports, met des guardrails formels.

**Mitigation proactive :**
- Communiquer avec Anthropic AVANT le premier rapport public (lettre ou DM à un PM Claude Code)
- Proposer un accès privilégié aux rapports non-publics
- Respecter strictement les TOS des hooks documentés publiquement
- Ne jamais scraper, ne jamais utiliser d'API non documentée

### Scénario C — blocage API (risque)
Anthropic modifie les hooks pour rendre le tracking impossible (ex : remove PreToolUse avec tool_name, supprimer `context_window.used_percentage` du JSON statusline).

**Mitigation :**
- Garder le dataset accumulé même si la collecte future casse — la valeur historique reste
- Avoir une version fallback du Clawkin qui tourne sans ces métadonnées (niveau par jours actifs seulement, pas de compact tracking) — graceful degradation
- Relation proactive Anthropic = signal d'alerte précoce si changement API annoncé

**Position defensive** : toute la data capturée est déjà dans les hooks publics documentés. Anthropic publie ces hooks pour que les développeurs construisent des outils autour. Clawkin construit un outil. C'est l'usage prévu.

---

## 11. Chantiers à construire — révision complète V1

Révise [docs/07 §10](07-metrics-et-tracking.md#section-10) avec le scope data augmenté.

| Chantier | Jours dev | Priorité |
|---|---|---|
| UUID persistent setup + config dir management | 0.5 | Critique J1 |
| Event buffer local (events.jsonl) + rolling aggregation | 1 | Critique J1 |
| Daily flush endpoint `/ping` + payload validation serveur | 1 | Critique J1 |
| KV storage schema (raw 90j + rollups indéfinis) | 1 | Critique J1 |
| Aggregation batch quotidienne (cron edge function) | 1 | Critique J1 |
| Dashboard admin v1 (read-only, `/admin` basic auth) | 1 | Critique J1 |
| `clawkin stats` command (local stats display) | 0.5 | Critique J1 |
| Page `/privacy` exhaustive | 0.5 | Critique J1 |
| Stripe webhooks handler | 1 | Critique J1 |
| Handle reservation + 60j expiry | 0.5 | Critique J1 |
| GitHub OAuth flow | 1 | Critique J1 |
| Plausible / CF Analytics landing | 0.25 | Critique J1 |
| `/state` public page (code prêt, dormant jusqu'à 500) | 0.5 | J+30 |
| Rapports aggregation templates | 1 | M+2 (avant premier mini-rapport) |

**Total : ~10 jours solo** (vs ~5-6 initial dans docs/07). Ajoute 4-5j au périmètre V1.

**Compatible fenêtre 2-3 semaines ?** Tendu mais faisable. Alternative : shipper le pet + badge + paid à 2-3 semaines, ajouter la data pipeline complète en release +1 au mois 2. Le buffer local events.jsonl peut démarrer J1 même si le flush serveur arrive en M+1 → on ne perd pas de data historique.

**Mon instinct** : buffer local + daily flush dès J1 (non-négociable — un dataset sans historique depuis J1 perd 80% de sa valeur de référence). Dashboard admin et rapports peuvent attendre M+1.

---

## 12. Questions ouvertes

- **Partnership proactive Anthropic** — quand contacter ? Avant launch (signal de respect) ou après premières 1000 installs (plus de crédibilité) ?
- **Dataset annuel téléchargeable en CSV** — gift à la communauté à M+12 ? Gros coup symbolique mais expose le dataset brut (qui reste agrégé par construction, donc OK).
- **Participation à d'autres Developer Surveys** — JetBrains, SO, GitHub Octoverse citent des sources. Position Clawkin comme source citée ?
- **Publication académique** — un dataset d'usage réel d'un LLM-code-agent serait intéressant pour la recherche HCI / SE. Ouverture à M+6-12 ?
- **Forme exacte du clean-shot ratio** — 60s est arbitraire. Tester 30s / 60s / 120s sur les premières données réelles avant de publier quoi que ce soit.
