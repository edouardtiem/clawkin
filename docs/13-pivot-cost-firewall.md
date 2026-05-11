# 13 — Pivot potentiel : Claude Cost Firewall

> Note de réflexion reçue en session — pivot envisagé depuis Clawkin (créature awareness) vers un outil de **prévention** de dépassement de quota Claude Code. Document de cadrage, pas encore une décision.

---

## 1. Thèse en une phrase

**ccusage et Claude-Code-Usage-Monitor te disent après coup combien tu as cramé. C'est de l'odomètre. On vend le frein.**

La proposition n'est pas technique, elle est psychologique : un user à 100$/mois en plan Max ne veut pas un dashboard, il veut pouvoir laisser tourner Claude Code sans la voix dans la tête qui dit *"et si j'avais cramé mon quota hebdo ?"*. Le produit vend **de la liberté mentale**, pas de la donnée.

---

## 2. Pourquoi #1 Cost Firewall et pas #2 Per-skill dashboard

| Critère | #1 Cost Firewall | #2 Per-skill dashboard |
|---|---|---|
| Segment cible | Tous les Pro/Max | Power users (200+ skills) |
| Taille segment | Référence | ~5× plus petit |
| Nature de la douleur | Dépassement de quota — viscérale, immédiate, partageable | Observability — abstraite |
| Willingness-to-pay | Forte (douleur connue) | Fragile (besoin éducatif) |
| Catégorie produit | Prévention | Reporting |

Direct : **#1 Claude Cost Firewall, pas #2.** Le per-skill dashboard est plus malin techniquement mais cible un segment 5× plus petit, avec une WTP plus fragile.

---

## 3. Architecture en 3 étages

### Étage 1 — Hard cap local (1 semaine)

- Hook `PreToolUse` qui parse le JSONL Claude Code local.
- Calcule le burn-rate ; si dépasse le seuil fixé par l'user (`max 30$ avant 18h`, `max 70% quota hebdo avant samedi`), retourne `exit code 2` et **bloque le tool call**.
- Claude Code s'arrête net. Le user voit : `🛑 Capwise: weekly budget reached, session paused.`
- **C'est ce que personne ne fait.** ccusage / Claude-Code-Usage-Monitor sont read-only.

### Étage 2 — Projection (2-3 jours)

- Pas du ML : fit linéaire ou exponentiel sur le burn-rate des 24 dernières heures.
- Projection type : *"à ce rythme, tu crameras ton quota dans 4h12"*.
- L'info devient **anticipatoire**, pas réactive.

### Étage 3 — Couche relationnelle (1 semaine) — **le vrai moat**

- Push notif mobile via **Pushover** ou **ntfy.sh** quand le cap approche.
- Webhooks **Slack / Discord** pour les équipes.
- **SMS Twilio** en option.
- **Multi-machine sync** : un dev qui bosse maison/bureau a deux instances Claude Code. Anthropic ne consolide pas — nous oui.

**Total : produit complet en 3 semaines solo.**

---

## 4. Économie unitaire

Cible : **1000 users payants × 7€/mois = 7000€ MRR** (dans la fourchette 5-10K€).

| Poste | Coût mensuel à 7000€ MRR |
|---|---|
| Compute (parser local + endpoint Stripe + Supabase free + Vercel edge) | < 5€ |
| Push notifs (ntfy.sh self-host, ou Pushover one-time payé par l'user) | 0€ |
| Stripe (2.9% + 0.30€/transaction) | ~250€ |
| Domaine + emails transactionnels (Resend) | 20€ |
| **Total** | **~275€** |

**Marge ~96%.** L'avantage "zéro LLM côté backend" du brief Clawkin se retrouve intact.

Variante team : **9€/seat/mois × 500 seats = 4500€ MRR** avec CAC encore plus favorable.

---

## 5. Risque Anthropic-ship-it

Risque maintenu à **3/5**, avec une nuance importante :

- Anthropic **peut** shipper un dashboard read-only à tout moment. Ce serait même bizarre qu'ils ne le fassent pas dans 12 mois.
- Anthropic **ne shippera jamais le hard cap.** Limiter automatiquement l'usage de leur produit va contre leur revenue. **Asymétrie d'incentives structurelle.**

### Les 4 fortifications

1. **Vivre en dehors du produit.** Pas une feature dans la TUI — un agent qui vit sur le mobile, le Slack d'équipe, l'Apple Watch. Le jour où Anthropic surface le spend dans la TUI, on a déjà la push notif sur Watch qu'eux ne feront jamais.

2. **Team-first dès le launch.** Tier équipe 9€/seat avec dashboard CTO + alertes Slack par dev. Anthropic n'a aucune incitation à fliquer ses propres users côté CTO — c'est du B2B SaaS qu'ils ne feraient pas même s'ils voulaient.

3. **BYOK strict. Jamais d'OAuth Pro/Max tokens.** Cf incident OpenClaw du 4 avril 2026 : Anthropic a coupé les harnais tiers en 24h. On lit seulement le JSONL local, public et documenté. Jamais dépendant.

4. **Pivot path préparé.** Si Anthropic ship un cost dashboard natif décent à 12 mois :
   - **(a)** Multi-modèle : Codex, Cursor. Devenir le seul outil cross-IDE de budget control. Le parsing JSONL est quasi identique côté Codex CLI.
   - **(b)** Predictive billing : les équipes veulent forecaster leur facture, pas juste la voir.
   - Garder la flexibilité dans l'archi dès J1.

---

## 6. Validation avant code (48h)

**À faire avant d'écrire la première ligne de code :**

- Poster sur **r/ClaudeAI** et **HN** : *"si vous pouviez avoir un seul tool autour de votre quota Claude Code, ce serait quoi ?"* — sans pitch, juste la question.
- Signal **GO** : 50+ upvotes, commentaires détaillés avec cas d'usage concrets → pivot validé.
- Signal **STOP** : 5 commentaires tièdes → revenir sur **#3 Vibe Safety Net** ou rester sur Clawkin.

---

## 7. Différence vs Clawkin (positionnement)

| Dimension | Clawkin | Cost Firewall |
|---|---|---|
| Catégorie | Awareness / virality (créature ASCII) | Prévention / contrôle (frein) |
| Cible | Tous devs Claude Code (gratuit) | Pro/Max payants avec douleur de quota |
| Moteur | PLG viral via screenshot | SaaS B2C + tier équipe B2B |
| Monétisation | 9$/an identité publique | 7€/mois individuel ou 9€/seat équipe |
| Risque ship-it Anthropic | Faible (Anthropic n'a pas intérêt à un dashboard gamifié) | Moyen (Anthropic shippera un dashboard, jamais un hard cap) |
| Time-to-market | 2-3 semaines V1 lean | 3 semaines pour les 3 étages |

---

## 8. Question ouverte

Deux directions possibles pour la suite immédiate :

- **A.** Détail architecture technique V1 (3 semaines) — schémas hooks, structure du parser JSONL, sync state cross-machine.
- **B.** Pricing / positioning marketing — landing, copy, distribution canaux, séquence launch.

À trancher après validation 48h r/ClaudeAI + HN.
