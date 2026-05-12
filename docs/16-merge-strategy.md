# 16 — Stratégie de merge : Clawkin + Smart Routing

> Décision actée : ne pas pivoter *vers* Smart Routing en abandonnant Clawkin, mais **fusionner les deux en un produit unique en 3 phases**. Smart Routing devient l'âme (utilité, savings, pricing), Clawkin reste la face (créature, virality, brand).

---

## 1. La décision en une phrase

**Clawkin n'est pas remplacé par Smart Routing. Clawkin évolue : la créature ne grandit plus avec ton temps d'usage (vanity), elle grandit avec tes tokens économisés (achievement réel).**

> *"Clawkin started as a creature that watched you work. It evolved into a creature that helps you work smart."*

Cette formulation respecte l'intégralité du brief original (zéro friction, awareness, screenshot-viral, statusline) **et** ajoute la couche utility qui justifie un pricing récurrent à 9€/mo (vs 9€/an vanity).

---

## 2. Pourquoi la fusion plutôt que le pivot

| Faiblesse seule | Comment l'autre la résout |
|---|---|
| **Clawkin** : WTP faible (9€/an vanity) | Smart Routing apporte la **utility-backed value** justifiant 9€/mo |
| **Clawkin** : pitch difficile (*"pourquoi tu paies pour un pixel ?"*) | Smart Routing donne le **ROI cash** : *"tu paies 9€, tu économises 40€+"* |
| **Smart Routing** : invisible (l'user ne voit rien tourner) | Clawkin donne le **face visible** : la créature dans la statusline = présence permanente |
| **Smart Routing** : zéro virality (utilité ne se screenshot pas) | Clawkin apporte le **viral hook** : *"my Clawkin is level 312, $1,800 saved"* |
| **Smart Routing** : risque churn (junior outgrowth) | Clawkin crée **l'attachement émotionnel** : tu cancel pas un produit où ta créature de niveau 312 vit |

Ensemble, les deux produits **se renforcent mutuellement**. C'est plus solide que chacun seul.

---

## 3. Les 3 phases

### Phase 1 — Ship Smart Routing pur (semaines 0-8)

**Objectif** : prouver que des users paient 9€/mo pour des savings réels et mesurables.

**Ce qu'on ship** :
- Foreman pattern (cf [docs/14](14-smart-routing.md))
- Hooks d'interception + worker Haiku via BYOK
- Dashboard savings local + statusline indicator simple
- Stripe + money-back automatique
- Landing avec pitch utility *"Claude Code, 40% cheaper"*

**Ce qu'on ne ship PAS** :
- Pas de créature visible
- Pas de levels
- Pas de social/community
- Pas de sprites en statusline

**Pourquoi** : la validation H2 (cf [docs/15](15-validation-plan-1-week.md)) doit mesurer *"les gens paient pour des savings"*. Si on ajoute la créature dès le V1, on ne saura jamais lequel a marché. Test propre d'abord, layer visuel après.

**Brand** : on garde `clawkin.sh` et le nom Clawkin (acquis, sympathique, dev-friendly), mais le positioning bascule vers utility. La créature reste latente dans l'identité graphique (favicon, micro-references) sans être le pitch.

### Phase 2 — Réactiver Clawkin par-dessus (mois 3-6 post-PMF)

**Pré-requis** : Smart Routing en PMF, 500+ paying users, savings prouvées.

**Ce qu'on ajoute** :
- **La créature en statusline** réactivée — mais sa **mécanique d'évolution change** :
  - Avant : grandit avec l'activité Claude Code (vanity)
  - Maintenant : grandit avec **tokens économisés** et **dispatches réussis**
- **Levels redéfinis** : "Level 247 — $2,400 saved" au lieu de "Level 247 — 89 jours actifs"
- **Badge GitHub README** réactivé (cf docs/11) — affiche le total savings
- **Page profil publique** : *"discipline metrics"* (savings ratio, dispatches handled, etc.)
- **Annual Report** (cf docs/09) — recyclé avec savings comme métrique principale

**Free tier réactivé** :
- Créature visible + stats basiques + bash truncator gratuit
- Free tier vital pour la virality
- Conversion path : *"unlock Foreman dispatch + creature evolution"* à 9€/mo

**Pourquoi cette phase 2** :
- Une fois la WTP prouvée, on **ré-injecte la virality** qui était le moteur original de Clawkin
- Les screenshots reviennent (créature + savings count = irrésistible sur Twitter/Reddit)
- Le moat anti-Anthropic se renforce : Anthropic peut copier les savings (Phase 1), mais pas l'identité créature/community (Phase 2)

### Phase 3 — Team tier + cross-IDE (mois 9-18)

**Ce qu'on ajoute** :
- **Team totem** : créature partagée d'équipe (totem collectif) qui grandit avec les savings cumulés de l'équipe
- **Dashboard CTO** : visibilité savings par dev, par projet, par client
- **Alertes Slack/Discord** team : *"votre équipe vient d'économiser 4 200€ ce mois"*
- **Cross-IDE** : extension du Foreman pattern à Codex CLI, Cursor (architecture déjà compatible)

**Pricing tier** :
- Team : 12€/seat/mo
- Enterprise (50+ seats) : tarif négocié + features (audit, SSO, etc.) — décision à prendre selon appétit pour cycle B2B

**Pourquoi cette phase 3** :
- Le team tier multiplie le MRR par 2-3x (cf projections docs/14)
- Le cross-IDE est le pivot path anti-Anthropic (cf docs/13 fortification #4)
- Team totem = moat anti-churn supplémentaire (annuler = perdre l'identité collective)

---

## 4. Ce qu'on garde / archive / rebuild

### Assets gardés intacts

| Asset | Usage Phase 1 | Usage Phase 2+ |
|---|---|---|
| Domaine `clawkin.sh` | ✅ Brand utility | ✅ Brand fusionné |
| Astro setup + Vercel | ✅ Direct | ✅ |
| BaseLayout, typo monospace, dark theme | ✅ Réutilisé | ✅ |
| Sprites/emblems (`sprites/`) | 🟡 Latent (favicon, micro-refs) | ✅ Réactivés en statusline + badge |
| 9 versions HTML expérimentales (`landing/v*`) | Référence design | Référence |
| Docs 00-12 (philosophie, formule, surfaces) | Historique | **Recyclés avec savings comme métrique** |

### Landing actuelle (`src/pages/index.astro`)

- **Option A** : réécrire pour Smart Routing pur (Phase 1), garder le code Clawkin actuel en `archive/landing-clawkin-v1/` pour réutilisation Phase 2
- **Option B** : nouvelle route `/routing` pour validation, garder index.astro Clawkin intact pendant validation

**Reco** : **Option B pendant la validation** (cf [docs/15](15-validation-plan-1-week.md) — test isolé propre). Si H2 valide → bascule en **Option A** au moment du ship V1.

### Code produit à builder neuf (Phase 1)

- `validation/parser.mjs` — H1 validation
- `hooks/` — PreToolUse, PostToolUse Claude Code hooks
- `worker/` — appel API Haiku BYOK
- `classifier/` — rules-based V1
- `dashboard/` — vue locale statique des savings
- `api/checkout.ts`, `api/webhook.ts` — Stripe
- Supabase table `preorders` puis `subscribers`

### Code à reporter à Phase 2

- Système créature/sprites en statusline
- Formule évolution (docs/10) — adapter pour savings
- Badge GitHub (docs/11)
- Annual Report (docs/09)
- Page profil publique

---

## 5. Marketing & narrative

### Phase 1 — Hero message landing

> **Claude Code, 40% cheaper.**
> Pay $9, save $40+, or it's free.
> 
> We auto-delegate the grunt work to Haiku workers.
> Your main session stays clean. Your bill drops.

(Footer subtle : *"by clawkin.sh — a small tool built with care"*)

### Phase 2 — Hero message après réactivation créature

> **Clawkin saves your tokens.**
> The creature shows your discipline.
> Pay $9, save $40+, or it's free.

(La créature redevient le visual de la hero, savings count + level dessous)

### Phase 3 — Hero team

> **Your team saved €4,200 last month.**
> Your team totem is level 47.
> 12€ per seat. Money-back guaranteed.

---

## 6. Métriques de réussite par phase

| Phase | Métrique de succès | Seuil |
|---|---|---|
| **Phase 1** | MRR + retention | 5-10k€ MRR M12, churn < 5%/mo |
| **Phase 2** | Virality + free→paid conversion | 1 share organique / 50 users actifs, 8%+ free→paid |
| **Phase 3** | Team ARPU + cross-IDE share | 30%+ MRR vient des teams, 15%+ users utilisent cross-IDE |

---

## 7. Risques spécifiques de la stratégie fusion

| Risque | Mitigation |
|---|---|
| **Confusion marketing** ("c'est un outil savings ou un jeu ?") | Phase par phase, jamais les 2 pitches en même temps |
| **Phase 2 jamais lancée** (Phase 1 prend tout le focus) | Date butoir Phase 2 = M+6 post-launch Phase 1, lock dans roadmap |
| **Créature dilue le pitch utility** | En Phase 2, la créature reste **secondaire** — savings = headline, créature = délice |
| **Smart Routing échoue (validation 0-1/3)** | La fusion devient caduque, retour à Clawkin pur — pas de perte (rien builder côté Smart Routing si on stop à validation) |

---

## 8. Décisions actées vs ouvertes

### Actées
- ✅ Stratégie fusion en 3 phases (vs pivot pur ou produits séparés)
- ✅ Phase 1 = Smart Routing pur (validation H2 propre)
- ✅ Brand Clawkin gardé tout du long
- ✅ Domaine `clawkin.sh` réutilisé
- ✅ Sprites/emblems gardés en latence pour Phase 2

### Ouvertes (à trancher après validation J8)
- 🟡 Si Smart Routing valide (3/3 ou 2/3) → confirmer roadmap Phase 1
- 🟡 Free tier inclus dès Phase 1 (bash truncator) ou repoussé à Phase 2 ?
- 🟡 Phase 2 trigger date : M+3, M+6, ou *"quand 500 paying users atteints"* ?
- 🟡 Team tier (Phase 3) : avant ou après cross-IDE ?

---

## 9. Référence croisée

- **Brief original** : [docs/00-brief-base.md](00-brief-base.md)
- **Roadmap & décisions** : [docs/04-roadmap-et-decisions.md](04-roadmap-et-decisions.md) — à mettre à jour avec cette stratégie une fois validation J8 actée
- **Cost Firewall (origine du pivot)** : [docs/13-pivot-cost-firewall.md](13-pivot-cost-firewall.md)
- **Smart Routing spec produit** : [docs/14-smart-routing.md](14-smart-routing.md)
- **Plan de validation 1 semaine** : [docs/15-validation-plan-1-week.md](15-validation-plan-1-week.md)

---

## 10. La phrase d'ancrage

À garder en tête à chaque décision future :

> **Phase 1 prouve qu'on peut faire payer. Phase 2 prouve qu'on peut faire aimer. Phase 3 prouve qu'on peut faire scaler.**

Pas l'inverse. Pas en parallèle. Dans cet ordre.
