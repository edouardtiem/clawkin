# 07 — Metrics et tracking V1

> Décision actée 2026-04-21 (session 2, après pivot freemium J1). Fixe quoi mesurer, comment, avec quelles lignes rouges. L'instrumentation doit être construite AVANT le launch, pas après.
>
> **⚠️ Supersedé partiellement par [docs/09](09-data-collection-et-rapports.md) (2026-04-23)** sur l'ambition et la finalité du tracking. Le pivot docs/09 fait passer la data d'un outil de décision interne à un asset stratégique publié. Red lines privacy de ce document conservées intactes et renforcées dans docs/09. Lire docs/09 d'abord.

---

## 1. Principe directeur

**Tracking = outil de décision, pas surveillance.** On mesure l'agrégat pour prendre des décisions produit (pivoter, doubler, tuer une feature). On ne profile jamais un individu, on ne regarde jamais le contenu d'une session Claude Code, on ne collecte jamais de donnée personnelle au-delà de ce que GitHub OAuth donne nativement pour les paid.

Cohérence avec le positionnement awareness : le produit ne juge pas l'utilisateur, le tracking non plus.

---

## 2. Contexte — pourquoi l'instrumentation devient critique en V1

Le pivot freemium J1 (cf [docs/06](06-freemium-et-plg.md)) introduit un funnel revenue dès le premier install. Sans instrumentation dès le jour 1, on perdra les 200-500 premiers utilisateurs — la cohorte la plus précieuse pour valider le modèle. Trois décisions produit critiques dépendent directement de la data :

- Est-ce que le modèle freemium fonctionne (conversion ≥ 2% à M+3) ?
- Quels upgrade prompts convertissent réellement (L50 ? streak 30j ? nouveau sprite rare ?)
- Est-ce que les badges paid circulent vraiment plus visiblement que les free (test de la règle fondamentale "free = ambassadeur, paid = citoyen") ?

Aucune de ces questions n'est répondable a posteriori. D'où l'urgence.

---

## 3. Les 4 buckets à suivre

### A. Adoption (volume)

Mesure la base brute d'utilisateurs et leur persistence dans le temps.

| Métrique | Source | Cible / lecture |
|---|---|---|
| Installs cumulés | Install script hits, dédupliqués par UUID | 2-4,5k à M+3 |
| DAU / WAU / MAU | Daily ping (UUID anonyme) | DAU croissant, ratio DAU/MAU > 20% |
| Rétention J30 | Installs N jours ago qui pinguent aujourd'hui | > 30% = produit sticky |
| Rétention J60 / J90 | Idem | Observable à partir de M+2 |

### B. Funnel freemium (critique)

La nouvelle catégorie qui n'existait pas dans le plan initial. Chaque marche doit être instrumentée.

| Métrique | Source | Cible / seuil de pivot |
|---|---|---|
| Taux de réservation de handle | % d'installs qui font `clawkin claim <handle>` | À calibrer empiriquement |
| Taux d'activation handle | % de réservations → paid dans 60j | > 20% = funnel sain |
| **Conversion free → paid globale** | Paid users / installs (rolling window) | **≥ 2% à M+3 = OK, < 0,5% = pivot** |
| Attribution par trigger | Event `upgrade_prompt_shown{trigger}` + conversion | Identifier le prompt qui convertit le mieux |
| Time-to-paid | Médiane jours install → premier paiement | Observable à M+2 |
| MRR / ARR | Stripe webhooks | ARR 360-800$ à M+3 (cf docs/06 §8) |
| Churn annuel | Subscriptions non renouvelées / total | Observable à M+12 |

### C. Surfaces virales (le moteur PLG)

Teste la règle fondamentale du pivot freemium : les surfaces paid doivent circuler **plus visiblement** que les free.

| Métrique | Source | Lecture |
|---|---|---|
| Vues de badges **free** (`/c/:hash.svg`) | Edge function logs | Indicateur de PLG passif gratuit |
| Vues de badges **paid** (`/u/:handle.svg`) | Edge function logs | Indicateur de PLG passif payant |
| Ratio vues paid / vues free | Calcul dérivé | **> 1 ou croissant** = règle validée. **< 1** = différenciation paid insuffisante |
| Vues de pages profil (`/u/:handle`) | Server logs | Asset identitaire utilisé ? |
| Vues d'URLs anonymes (`/c/:hash`) | Server logs | Free users partagent-ils leur Clawkin ? |
| Cartes de partage générées vs partagées | Event + tweet volume | Proxy : mentions `clawkin.sh` sur Twitter/Bluesky |
| Referrers landing top 10 | Analytics landing | D'où vient le trafic ? Twitter ? HN ? GitHub ? |

### D. Community (signal qualitatif)

Pas de KPI précis — signaux à surveiller manuellement au début.

| Signal | Méthode | Action quand ça bouge |
|---|---|---|
| Mentions `clawkin.sh` / `@clawkin` / `#clawkin` | Alertes Twitter + Bluesky | Répondre personnellement tant que volume < 10/semaine |
| GitHub stars sur le repo CLI | GitHub native | Proxy de hype, pas de revenue |
| Demandes répétées de leaderboard | Email / Discord / Twitter | Si signal fort : reconsidérer V2 leaderboard (cf docs/06 §10) |
| Tickets / emails support | Inbox | Doit rester bas — "zéro support" est un critère dur |

---

## 4. Schéma ASCII du funnel

```
                 Landing view (Plausible / CF Analytics)
                         │
                         ▼
               Install script hit (clawkin.sh/install)
                         │
                         ▼
              ┌─── First daily ping ─┐         ← churn ici = user qui install
              │   (activation)       │           et n'utilise jamais
              ▼                      │
       Active user (DAU)             │
           │   │                     │
           │   ▼                     │
           │  Achievement atteint    │
           │  (L50, streak 30j, ...) │
           │   │                     │
           │   ▼                     │
           │  upgrade_prompt_shown   │  ← track le trigger
           │   │                     │
           │   ▼                     │
           │  claim_url_opened       │  ← intention exprimée
           │   │                     │
           │   ▼                     │
           │  handle_reserved        │  ← 60j grace period démarre
           │   │                     │
           ▼   ▼                     │
       D7/D30 retention              │
       (pings continus)              │
                                     │
                         ┌───────────┘
                         ▼
                  checkout_completed (Stripe webhook)
                         │
                         ▼
                    Paid user → MRR++
                         │
                         ▼
                  invoice_paid (annuel)       ← renouvellement
                         │                      ou subscription_cancelled
                         ▼                      (churn paid)
                    Renewed / Churned
```

---

## 5. Stack technique concret

### 5.1 Landing page
- **Plausible Analytics** (10€/mois, self-hosted possible gratuit) ou **Cloudflare Web Analytics** (gratuit)
- Trackés : pageviews, referrers, conversion event "install command copied"
- Sans cookies, sans tracking cross-site, RGPD-clean par défaut

### 5.2 Free users (anonyme)
- **Install script** (`clawkin.sh/install`) : log natif Vercel/Cloudflare des requêtes
- **Daily ping** (`clawkin.sh/ping?id=<uuid>&v=0.1.0`) :
  - UUID généré à l'install, stocké dans `~/.config/clawkin/state.json`
  - CLI fait le ping au premier `SessionStart` du jour (arrière-plan, non-bloquant)
  - Serveur : edge function + Vercel KV → compte uniques par jour
  - Opt-out via env var `CLAWKIN_NO_TELEMETRY=1`, documenté

### 5.3 Paid users (OAuth + Stripe)
- **GitHub OAuth** : claim de handle signé, évite usurpation (cf docs/06 §9)
- **Stripe webhooks** : endpoint dédié qui écoute
  - `checkout.session.completed` → marque handle comme `activated`
  - `invoice.paid` → trace renouvellement
  - `customer.subscription.deleted` → flag churn
- **Handle reservation store** : KV entry par handle avec `{state: "reserved" | "activated" | "expired", owner_uuid, reserved_at, expires_at}`

### 5.4 Badges & pages profil
- Endpoints : `clawkin.sh/c/:hash.svg` (free), `clawkin.sh/u/:handle.svg` (paid), `clawkin.sh/u/:handle` (paid HTML)
- Logs natifs du provider (Vercel/Cloudflare) donnent le volume par endpoint
- Tagging dans les logs via query param `?src=readme|tweet|direct` (optionnel, rempli côté CLI quand le snippet est généré)
- Aggregation périodique vers KV → dashboard

### 5.5 Event stream pour les upgrade prompts (critique)
- Chaque fois que le CLI affiche un upgrade prompt dans le terminal → event anonymisé vers serveur
- Endpoint : `clawkin.sh/e?t=prompt_shown&trigger=L50&uuid=...`
- Permet l'attribution : "quel trigger convertit le mieux ?"
- Sinon on ne peut jamais optimiser les prompts

### 5.6 Dashboard admin
- Page privée `clawkin.sh/admin` protégée par basic auth (env var mdp)
- Read-only, HTML statique généré à la volée depuis KV
- Zéro framework : fetch KV + render HTML en edge function
- Sections dans §8

---

## 6. Events à instrumenter (schéma)

### Côté CLI (client)
```
install_completed           → ping au serveur au premier run
daily_ping                  → ping anonyme, UUID only, 1x/jour
achievement_unlocked        → {level: 50}
upgrade_prompt_shown        → {trigger: "L50" | "streak_30" | "rare_form"}
claim_url_opened            → user a cliqué / tapé clawkin.sh/claim
telemetry_opted_out         → event unique : signale que cet UUID désactive le ping (respecté ensuite)
```

### Côté serveur (derived, via webhooks ou logs)
```
install_script_served       → raw count des hits sur /install
badge_served                → {tier: "free" | "paid", handle_or_hash, ref}
profile_viewed              → {handle}
handle_reserved             → {handle, owner_uuid, expires_at}
checkout_completed          → Stripe webhook
invoice_paid                → Stripe webhook (renouvellement)
subscription_cancelled      → Stripe webhook (churn)
handle_expired              → 60j atteint sans activation, handle libéré
```

Tous stockés en append-only dans un KV prefix `events:` avec horodatage. Aggregation batch (quotidienne) vers vues pré-calculées pour le dashboard.

---

## 7. Red lines — non-négociables

Franchir une seule de ces lignes détruit le positionnement awareness et la crédibilité du produit auprès de l'audience dev. Elles priment sur toute optimisation de conversion.

- ❌ **Aucun tracking du contenu des sessions Claude Code.** Ni prompts, ni réponses, ni outils appelés, ni fichiers touchés. Le produit ne SAIT PAS ce que fait l'utilisateur au-delà des métriques agrégées (% contexte, durée, événements lifecycle).
- ❌ **Aucun Google Analytics / Segment / Mixpanel / FullStory.** L'audience dev sniffe un GA tag en 2 secondes et bounce.
- ❌ **Aucune session recording / heatmap / replay.** Non seulement sur le produit, aussi sur la landing.
- ❌ **Pas d'email collection sur la landing.** Pas de newsletter drip, pas de form. L'install est le seul CTA.
- ❌ **Pas de finger-printing cross-session** pour les free users. Un UUID local, c'est tout.
- ❌ **Pas de tracking cross-device pour les free users.** Ils peuvent installer sur 3 machines, ils apparaîtront comme 3 UUIDs distincts. On accepte le bruit statistique plutôt que de violer la vie privée.
- ✅ **Opt-out universel** via `CLAWKIN_NO_TELEMETRY=1`, documenté dans le footer de la landing et le `--help` du CLI.

Pour les paid users : on a GitHub OAuth donc on connaît leur handle + email public si renseigné. Mais ça reste opt-in (ils signent explicitement). Et on ne track toujours pas leur usage session par session — juste les événements de paiement + les pings quotidiens (même endpoint que free, juste avec leur UUID signé).

---

## 8. Dashboard admin — structure

Page `clawkin.sh/admin`, basic auth. Sections, dans l'ordre d'importance décisionnelle :

### Section 1 — Où suis-je dans le funnel freemium
- Courbe : installs cumulés (avec ligne cible 2k à M+3)
- Counter MRR + ARR + delta vs mois dernier
- **Ratio conversion free → paid** (avec ligne 2% cible, 0,5% seuil pivot)
- Chart cohorte : installs de chaque semaine + leur courbe de conversion → paid
- Breakdown : conversion par trigger d'upgrade prompt (table)

### Section 2 — Santé du moteur PLG
- Graphe : vues de badges free vs paid (cumulées + hebdo)
- Ratio badges paid / badges free (le test de la règle fondamentale)
- Top 10 URLs de pages profil paid les plus vues
- Mentions sociales `clawkin.sh` par semaine (input manuel au début)

### Section 3 — Santé de la base
- DAU / WAU / MAU
- Rétention J7 / J30 / J60 (si applicable)
- Installs par jour sur 30j

### Section 4 — Signaux faibles à surveiller
- Tickets / emails de support reçus cette semaine
- Mentions de "leaderboard" dans les signaux externes (seuil bascule V2)
- Opt-outs telemetry (volume absolu + en % des installs) — si ça grossit, audit privacy policy

---

## 9. Signaux de pivot explicites

Repris de [docs/06 §10](06-freemium-et-plg.md#section-10) et enrichis.

### Le modèle fonctionne si
- Conversion free → paid **≥ 2% à M+3**
- Ratio badges paid / free **croissant** au fil des mois
- Cartes de partage aux paliers **postées organiquement** (mentions sociales semaine > 5 à M+3)
- DAU/MAU **> 20%** (produit sticky)
- CPL reste à **0€** (aucune pub dépensée)

### On pivote si
- **Conversion < 0,5% à M+3** → retravailler la différenciation paid (animation badge plus visible ? page profil plus riche ? prompts mieux timés ?)
- **Ratio badges paid / free stagnant ou décroissant** → la prop de valeur paid n'active pas la contagion. Revoir l'esthétique premium.
- **Cartes free ne se partagent pas** (0 mentions / semaine à M+2) → le moteur PLG passif est cassé. Revoir les moments de déclenchement + l'esthétique.
- **Users paid demandent un leaderboard de façon répétée** (≥ 10 tickets / semaine à M+2) → alors seulement reconsidérer V2 leaderboard comme feature payante additionnelle.
- **DAU/MAU < 10%** → problème de stickyness du Clawkin lui-même, pas du funnel. Revenir sur le game design.

---

## 10. Chantiers à construire (estimation solo)

| Chantier | Jours dev | Priorité |
|---|---|---|
| Endpoint `/ping` + KV storage UUID/day | 0.5 | Critique J1 |
| Endpoint `/install` servant script + logs | 0.5 | Critique J1 |
| Endpoint `/e` (event stream prompts) + aggregation | 1 | Critique J1 |
| Stripe webhooks handler + KV state | 1 | Critique J1 |
| Handle reservation store + 60j expiry job | 0.5 | Critique J1 |
| GitHub OAuth flow | 1 | Critique J1 |
| Dashboard admin HTML statique | 1 | Critique J1 |
| Plausible / CF Analytics landing | 0.25 | Critique J1 |
| Badge endpoints avec tier tagging | déjà dans V1 scope | — |

**Total additionnel : ~5-6 jours solo** au-delà du CLI + badge endpoints déjà prévus. Compatible avec la fenêtre 2-3 semaines de [docs/06 §9](06-freemium-et-plg.md#section-9).

---

## 11. Dépendances critiques

- **Vercel KV** (ou équivalent Cloudflare/Upstash) — le socle du stockage events + aggregates
- **Stripe** — seul provider de paiement ; fallback aucun en V1
- **GitHub OAuth** — seul provider d'identité paid en V1 ; alternative Twitter/Bluesky possible en V2 si besoin
- **Plausible ou Cloudflare Analytics** — sur la landing ; fallback possible (Matomo self-hosted) mais ajoute de l'ops
- **Claude Code hooks API** — si schéma change, le daily_ping peut continuer mais la détection d'achievements peut casser. À surveiller.

---

## 12. Questions ouvertes

- **Quelle durée de rétention de l'event stream ?** 90 jours en raw, puis aggregate only ? Aligné RGPD + coût KV.
- **Publier le "state of clawkin" publiquement ?** `clawkin.sh/state` public avec installs cumulés + DAU + nombre de paid ? Moteur de trust pour la communauté. À tester après M+1.
- **Source of truth pour le count de paid users ?** Stripe ou KV local ? Probablement les deux, avec réconciliation quotidienne.
- **Webhook de backup si Stripe down ?** Probablement overkill en V1.
