# 15 — Plan de validation Smart Routing (1 semaine)

> Avant d'engager 6-10 semaines de build sur Smart Routing (cf [docs/14](14-smart-routing.md)), valider 3 hypothèses critiques en 7 jours. **Sans code produit. Sans engagement.** Stop or go data-driven.

---

## Règle de décision

- **3/3 validations passent** → ship V1 (6-10 semaines).
- **2/3** → ajuster l'hypothèse qui foire (souvent pricing ou patterns) et re-tester en 1 semaine.
- **1/3 ou 0/3** → retour à Clawkin sans regret. Tu as économisé 7 semaines.

**Date de revue** : J+7 après le lancement de la semaine de validation.

---

## Hypothèse 1 — Les patterns gaspilleurs existent vraiment

**Question** : *Dans des sessions réelles, est-ce que les patterns interceptables (bash bloat, large reads, audit tasks) représentent >20% du burn de tokens ?*

**Seuil de validation** : ≥ 20% du burn total mesuré sur 2 semaines de sessions réelles vient des patterns interceptables identifiés en V1.

### Protocole (3 jours)

- [ ] Récupérer les JSONL de tes 2 dernières semaines de sessions Claude Code (`~/.claude/projects/*/...jsonl`)
- [ ] Demander à 3-5 amis devs Claude Code de partager 1 semaine de leurs JSONL (anonymisé)
- [ ] Écrire un parser Node ~200 lignes qui compte par session :
  - Total tokens input/output Sonnet/Opus
  - Tokens venant de bash output > 200 lignes
  - Tokens venant de file reads > 500 lignes
  - Tokens venant de re-reads de fichiers inchangés
  - Tokens venant de grep avec > 10 résultats
  - Tokens venant de patterns audit (read multiple files puis summarize)
- [ ] Sortir un rapport :
  - % du burn total couvert par les patterns
  - Économies potentielles si on avait dispatché à Haiku (estim. avec ratio prix 1/15)
  - Distribution par type de pattern

### Signal go / no-go

| Résultat | Verdict |
|---|---|
| Patterns ≥ 20% du burn + savings projetées ≥ 20% facture | ✅ **GO** sur cette hypothèse |
| Patterns 10-20% | 🟡 **AJUSTER** — élargir les patterns ou cibler segment heavy uniquement |
| Patterns < 10% | ❌ **STOP** — la prémisse économique s'effondre |

### Livrables

- Script de parsing dans `validation/parser.mjs` (à créer)
- Rapport `validation/findings-h1.md` avec graphiques

---

## Hypothèse 2 — Les users heavy paient 9€/mo flat (pas juste "ce serait cool")

**Question** : *50+ users heavy sont prêts à pré-payer 9€/mo (refundable) avec garantie money-back, en 7 jours, via une landing minimaliste ?*

**Seuil de validation** : ≥ 50 pre-orders payés (Stripe Checkout, refundable, $0 ou €9 capturé) en 7 jours.

### Protocole (3 jours dev + 4 jours collecte en parallèle H1)

- [ ] Landing minimaliste 1 page (Astro, hébergée sur clawkin.sh/routing ou nouveau sous-domaine)
  - Headline : *"Claude Code, 40% cheaper. Pay $9, save $40+, or it's free."*
  - 3 sections : pain (token burn), promesse (dashboard + money-back), pricing (9€/mo)
  - CTA : *"Reserve your spot — €9, refundable anytime"*
- [ ] Stripe Checkout en mode `setup_intent` (pré-autorisation sans débit) OU débit immédiat 9€ avec refund manuel possible
- [ ] Tracker conversion : visits → starts checkout → completes
- [ ] Distribution canaux :
  - [ ] Post r/ClaudeAI : *"I'm building [name] — 40% cheaper Claude Code with money-back guarantee. Reserve a spot if interested"*
  - [ ] Post HN Show HN : *"Show HN: [name] — auto-delegate trivial Claude Code work to Haiku"*
  - [ ] Tweet thread sur 2-3 comptes dev influents demandant feedback
  - [ ] DM 20 power users identifiés sur Reddit/X qui se plaignent de leur facture Claude Code

### Signal go / no-go

| Résultat | Verdict |
|---|---|
| ≥ 50 pre-orders payés en 7 jours | ✅ **GO** — WTP démontrée |
| 20-49 pre-orders | 🟡 **AJUSTER** — tester pricing alt (7€, 12€, freemium) sur 7 jours de plus |
| < 20 pre-orders | ❌ **STOP** — l'enthousiasme verbal ne se traduit pas en €. Retour Clawkin. |

### Livrables

- Landing déployée `routing.clawkin.sh` (ou autre)
- Stripe pre-orders comptabilisés
- Rapport `validation/findings-h2.md` : conversion funnel, retours utilisateurs, objections principales

---

## Hypothèse 3 — Anthropic n'a rien annoncé de concurrent dans la roadmap

**Question** : *Anthropic ne va-t-il pas auto-trigger le Task tool ou ship une feature équivalente dans les 12 prochains mois ?*

**Seuil de validation** : zéro annonce publique ou signal fort d'Anthropic indiquant qu'ils vont shipper :
- Auto-routing entre modèles dans Claude Code
- Auto-trigger du Task tool sur patterns
- Cost optimization native
- Context compression intelligent

### Protocole (1 jour)

- [ ] Audit changelog Claude Code des 6 derniers mois (releases GitHub, blog Anthropic)
- [ ] Audit roadmap publique Anthropic (Discord, Twitter staff, conférences)
- [ ] Search r/ClaudeAI + HN sur "Anthropic auto-route" / "Claude Code optimization" / "Task tool auto"
- [ ] Check les beta programs Anthropic en cours
- [ ] Tester soi-même Claude Code latest : le Task tool est-il auto-suggéré déjà ? Y a-t-il un signal d'optimisation latente ?

### Signal go / no-go

| Résultat | Verdict |
|---|---|
| Zéro annonce + Anthropic focused sur autre chose (memory, vision, etc.) | ✅ **GO** — fenêtre de 12+ mois |
| Signal vague mais pas de timeline | 🟡 **GO avec urgence** — ship en 6 sem, pas 10 |
| Annonce publique dans roadmap proche | ❌ **STOP** — pivot path obligatoire (multi-modèle Codex/Cursor, ou team-only B2B) |

### Livrables

- Rapport `validation/findings-h3.md` : sources auditées, citations, verdict

---

## Calendrier 7 jours

| Jour | H1 (patterns) | H2 (pricing) | H3 (Anthropic) |
|---|---|---|---|
| **J1 (lun)** | Setup parser + collecte tes JSONL | Brief landing + Stripe setup | Audit changelog complet |
| **J2 (mar)** | Run parser sur tes données | Ship landing v1 + Stripe live | Audit roadmap + community |
| **J3 (mer)** | Demander JSONL à 3-5 amis | Post r/ClaudeAI + HN | **Rapport H3 finalisé** |
| **J4 (jeu)** | Parser sur données amis + rapport | Tweet thread + DMs 20 power users | — |
| **J5 (ven)** | **Rapport H1 finalisé** | Collecte pre-orders ongoing | — |
| **J6 (sam)** | — | Collecte ongoing + relance | — |
| **J7 (dim)** | — | **Rapport H2 finalisé** | — |
| **J8 (lun)** | **Decision meeting (1h)** : 3/3, 2/3, 1/3, 0/3 → action | | |

---

## Budget

| Poste | Coût |
|---|---|
| Domaine (si nouveau) | 12€/an |
| Vercel deploy | 0€ (free tier) |
| Stripe (pas de fees si refund avant débit) | 0€ |
| Posts Reddit/HN | 0€ |
| Twitter promote (optionnel) | 20€ |
| **Total** | **~30€** |

Pour 30€ et 1 semaine, tu obtiens un verdict data-driven sur 6-10 semaines de build. **ROI imbattable.**

---

## Anti-piège : ce qui pourrait fausser la validation

- ❌ **Demander des feedbacks verbaux comme métrique** (les gens disent "oui" pour être polis). Seul le **pre-order payé** compte.
- ❌ **Promo agressive sur ton réseau perso** (tes amis vont signer pour te faire plaisir, pas signal marché). Distribution **publique only**.
- ❌ **Compter les upvotes Reddit comme validation** (engagement ≠ WTP). Seul Stripe compte.
- ❌ **Élargir les patterns en cours de validation pour faire passer H1** (cheating). Lock le scope au début, mesure honnêtement.
- ❌ **Sous-estimer H3** parce que c'est moins "fun" à investiguer. C'est le risque qui peut tuer le produit après 6 mois de build.

---

## Après la décision (J8)

### Si GO

→ Ouvrir `docs/16-roadmap-v1-smart-routing.md` avec :
- Sprint 1 (sem 1-2) : hooks de base + worker Haiku
- Sprint 2 (sem 3-4) : classifier + state local + dashboard
- Sprint 3 (sem 5-6) : Stripe + refund auto + landing prod
- Sprint 4 (sem 7-8) : beta privée 20 users issus des pre-orders H2
- Sprint 5 (sem 9-10) : launch public + content marketing

### Si STOP

→ Retour à Clawkin avec le doc 13 (Cost Firewall) et 14 (Smart Routing) archivés comme références. Pas de perte, juste 7 jours et 30€.

### Si AJUSTER

→ Re-test focused sur l'hypothèse qui a foiré, 7 jours max. Pas plus de 2 cycles total avant decision finale.
