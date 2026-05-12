# 16 — Stratégie d'évolution Clawkin : 3 features en 3 phases

> Décision actée : Clawkin est **un seul produit qui évolue**, pas deux produits qui fusionnent. La feature de routing tokens (économies) est le premier étage. La créature visuelle et le team totem viennent par-dessus dans les phases suivantes. Brand unique, domaine unique, install unique.

---

## 1. La décision en une phrase

**Clawkin est un produit qui aide les devs à mieux utiliser Claude Code. Sa première feature économise leurs tokens. Les features suivantes ajoutent l'identité visuelle, puis la dimension équipe.**

> *"Clawkin saves your Claude Code tokens. The creature comes next."*

Pas de marque séparée *"Smart Routing"*. Pas de produit parallèle. Une seule landing, un seul install, une seule histoire qui s'enrichit.

---

## 2. Pourquoi cette logique (un produit, pas deux)

| Logique fusion (ancienne) | Logique évolution (retenue) |
|---|---|
| Deux produits qui se complètent | Un produit qui s'enrichit |
| *"Smart Routing × Clawkin"* | *"Clawkin v1, v2, v3"* |
| Tension de marque ("on est lequel ?") | Brand unique, voix unique |
| Risque de pitch éclaté | Pitch simple : *"Clawkin fait X aujourd'hui, fera Y demain"* |
| Maintenance de 2 récits | Maintenance d'un récit qui s'épaissit |
| Implique deux roadmaps | Implique une feature flag |

L'évolution est **future-proof** : tu pourras ajouter une feature 4 (par ex. predictive billing, ou cross-IDE multi-modèle) sans renommer le produit.

---

## 3. Les 3 features dans l'ordre

### Feature 1 — Token Routing (semaines 0-8)

**Le pitch user** : *"Clawkin saves your tokens. Pay $9, save $40+, or it's free."*

**Ce que Clawkin fait** :
- Intercepte les tool calls coûteux (large reads, bash bloat, audit tasks)
- Délègue à un worker Haiku via BYOK
- Le main thread Sonnet/Opus reste clean
- Dashboard local des savings + statusline indicator minimaliste
- Stripe + money-back automatique

**Ce que Clawkin ne fait PAS encore** :
- Pas de créature visible
- Pas de levels, pas de gamification
- Pas de social, pas de team

**Spec détaillée** : [docs/14](14-smart-routing.md) (vue produit) + [docs/17](17-feature-1-spec-detaillee.md) (spec implementation).

### Feature 2 — Créature visuelle (mois 3-6 post-PMF)

**Le pitch enrichi** : *"Clawkin saves your tokens. The creature shows your discipline."*

**Ce qui s'ajoute** :
- Créature en statusline (sprites existants, cf [docs/11](11-emblemes-et-surfaces.md), [docs/12](12-production-250-silhouettes.md))
- Levels redéfinis avec savings comme métrique principale (*"L247 — $2,400 saved"*) — formule à adapter depuis [docs/10](10-formule-et-progression.md)
- Badge GitHub README (cf [docs/11](11-emblemes-et-surfaces.md))
- Page profil publique (handle paid)
- Free tier : créature + stats basiques (bash truncator gratuit) — la virality revient
- Annual Report (cf [docs/09](09-data-collection-et-rapports.md)) recyclé avec savings comme métrique

**Pourquoi cette feature 2** :
- La WTP est déjà prouvée par Feature 1, on ajoute le délice
- La virality (screenshot créature + savings count) revient avec un signal *réel* d'accomplissement, plus de la vanité
- Le moat anti-Anthropic se renforce : Anthropic peut copier les savings, pas l'identité créature/community

### Feature 3 — Team & cross-IDE (mois 9-18)

**Le pitch équipe** : *"Your team saved €4,200 last month. Your team totem is level 47."*

**Ce qui s'ajoute** :
- Tier team 12€/seat/mo
- Team totem partagé qui grandit avec les savings cumulés de l'équipe
- Dashboard CTO : visibilité savings par dev, projet, client
- Webhooks Slack/Discord pour notifs team
- Cross-IDE : extension du Foreman pattern à Codex CLI, Cursor (architecture déjà compatible)

**Pourquoi cette feature 3** :
- Multiplie le MRR par 2-3× (cf projections [docs/14](14-smart-routing.md))
- Le cross-IDE est le pivot path anti-Anthropic (cf [docs/13 fortification #4](13-pivot-cost-firewall.md))
- Team totem = moat anti-churn collectif

---

## 4. Ce qu'on garde, mis en latence, rebuild

### Assets gardés actifs dès Feature 1

| Asset | Usage Feature 1 |
|---|---|
| Brand "Clawkin" | ✅ Brand unique, voix unique |
| Domaine `clawkin.sh` | ✅ Landing utility savings |
| Astro setup + Vercel Analytics | ✅ Direct |
| BaseLayout, typo monospace, dark theme | ✅ Réutilisé |
| Emblème `⡧⡂` (k lowercase Braille) | ✅ En footer / micro-references |

### Assets mis en latence pour Feature 2

| Asset | Réactivation |
|---|---|
| Sprites 250 silhouettes (`sprites/`) | Feature 2 — créature en statusline + badge |
| Formule progression (docs/10) | Feature 2 — adapter avec savings comme XP |
| Badge GitHub README (docs/11) | Feature 2 — surface publique |
| Annual Report (docs/09) | Feature 2 — pivot métrique vers savings |
| Page profil publique (docs/06) | Feature 2 — handle paid |
| Plan production 250 silhouettes (docs/12) | Feature 2 — production des vagues 02-05 |

**Aucun asset n'est jeté.** Tout est en pause active, prêt à être réactivé.

### Assets à builder pour Feature 1

- Parser JSONL (validation H1)
- Hooks Claude Code (PreToolUse / PostToolUse)
- Worker Haiku BYOK
- Classifier rules-based V1
- Dashboard savings (statique, lit le state local)
- Statusline indicator minimal (juste `⡧⡂ saved $X.YY today`)
- Stripe checkout + webhook + refund auto
- Supabase table `subscribers`

---

## 5. Marketing & narrative qui évolue

### Feature 1 — Hero landing

> **Clawkin saves your Claude Code tokens.**
> Pay $9, save $40+, or it's free.
>
> We auto-delegate the grunt work to Haiku workers.
> Your main session stays clean. Your bill drops.

Brand "Clawkin" présent mais discret. La valeur (savings) est en headline.

### Feature 2 — Hero enrichi

> **Clawkin saves your tokens.**
> The creature shows your discipline.
> *"L247 — $2,400 saved"*

La créature devient visible. Le pitch double : utility + identity.

### Feature 3 — Hero team

> **Your team saved €4,200 last month.**
> Your team totem is level 47.
> 12€ per seat. Money-back guaranteed.

---

## 6. Métriques de succès par feature

| Feature | Métrique de succès | Seuil |
|---|---|---|
| **Feature 1** | MRR + retention solo | 5-10k€ MRR à M12, churn < 5%/mo |
| **Feature 2** | Virality + free→paid conversion | 1 share organique / 50 users actifs, 8%+ free→paid |
| **Feature 3** | Team ARPU + cross-IDE share | 30%+ MRR vient des teams, 15%+ users utilisent cross-IDE |

---

## 7. Risques spécifiques de l'évolution

| Risque | Mitigation |
|---|---|
| **Confusion marketing** (*"Clawkin, c'est quoi déjà ?"*) | Un pitch par feature, jamais 2 en même temps. Feature 1 = savings, point. |
| **Feature 2 jamais livrée** (Feature 1 prend tout le focus) | Date butoir Feature 2 = M+6 post-launch Feature 1, lock dans roadmap |
| **Créature dilue le pitch utility** | En Feature 2, savings reste headline, créature en sub-headline |
| **Feature 1 échoue à la validation** | Retour à Clawkin créature pur (docs 00-12 restent valides). Pas de perte côté code (rien builder sans validation) |

---

## 8. Décisions actées vs ouvertes

### Actées

- ✅ Un seul produit (Clawkin), pas deux qui fusionnent
- ✅ Brand "Clawkin" gardé tout du long, dès Feature 1
- ✅ Domaine `clawkin.sh` réutilisé pour la landing Feature 1
- ✅ Sprites/emblems/docs 00-12 gardés actifs en latence pour Feature 2
- ✅ Feature 1 = Token Routing pur, pas de créature au launch
- ✅ Validation H2 obligatoire avant build Feature 1 (cf [docs/15](15-validation-plan-1-week.md))

### Ouvertes (à trancher après validation J+8)

- 🟡 Si Feature 1 valide (3/3 ou 2/3) → confirmer la roadmap d'évolution
- 🟡 Free tier inclus dès Feature 1 (bash truncator gratuit) ou repoussé à Feature 2 ?
- 🟡 Feature 2 trigger date : M+3, M+6, ou *"quand 500 paying users atteints"* ?
- 🟡 Feature 3 ordre : team tier avant ou après cross-IDE ?

---

## 9. Référence croisée

- **Brief original** : [docs/00-brief-base.md](00-brief-base.md)
- **Roadmap & décisions** : [docs/04-roadmap-et-decisions.md](04-roadmap-et-decisions.md)
- **Origine du pivot** : [docs/13-pivot-cost-firewall.md](13-pivot-cost-firewall.md)
- **Spec produit Feature 1 (vue produit)** : [docs/14-smart-routing.md](14-smart-routing.md)
- **Plan de validation 1 semaine** : [docs/15-validation-plan-1-week.md](15-validation-plan-1-week.md)
- **Spec implementation Feature 1 (détaillée)** : [docs/17-feature-1-spec-detaillee.md](17-feature-1-spec-detaillee.md)

---

## 10. La phrase d'ancrage

À garder en tête à chaque décision future :

> **Feature 1 prouve qu'on peut faire payer.**
> **Feature 2 prouve qu'on peut faire aimer.**
> **Feature 3 prouve qu'on peut faire scaler.**

Pas l'inverse. Pas en parallèle. Dans cet ordre.
