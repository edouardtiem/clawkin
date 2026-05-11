# 14 — Smart Routing (hypothèse à valider)

> Pivot envisagé depuis Clawkin (awareness) et Cost Firewall (frein) vers un produit qui **agit** plutôt que d'observer ou de bloquer. Hypothèse à valider en 1 semaine avant d'engager 6-10 semaines de build. Plan de validation : [docs/15](15-validation-plan-1-week.md).

---

## 1. Le pitch en une phrase

**Claude Code, but 40% cheaper. You don't change anything. We do.**

Un layer local qui intercepte les tool calls coûteux (large file reads, bash output bloat, audit tasks) et délègue leur exécution à un worker Haiku via API. Le résultat condensé revient dans la session Sonnet/Opus principale, qui reste clean. L'user voit sa facture baisser sans changer ses habitudes.

---

## 2. Pourquoi ce produit (vs les autres explorés)

| Option explorée | Pourquoi pas |
|---|---|
| Clawkin (créature awareness) | WTP très faible (9€/an), plafond ~3-8k€ MRR |
| Cost Firewall pur (notif + block) | Trop fin pour 5€/mo, ressemble à un script auto-buildable |
| Context Janitor (3 hooks) | Pareil — bundle de hooks, pas un SaaS |
| Loom for Claude Code (replay) | Hosting, BDD, redaction → trop loin de l'ADN simple |
| Smart Routing | **Action invisible + savings mesurables + pricing aligné** |

Le saut critique : ne pas *observer* ni *alerter*, mais **agir**. C'est ce qui justifie 9€/mo récurrent au lieu d'un tip jar à 5€.

---

## 3. Architecture technique

### 3.1 Le mécanisme — Foreman pattern

⚠️ **Précision technique** : on ne peut PAS changer le modèle utilisé par Claude Code pour une conversation en cours. Le `/model` est fixé par session. Donc *"router le turn vers Haiku"* est techniquement faux. Ce qu'on fait :

**Délester** : intercepter certains tool calls avant qu'ils polluent le contexte de la session principale, faire le travail à côté avec Haiku, renvoyer un résumé condensé.

### 3.2 Flux concret

```
User → "trouve tous les usages de useAuth et liste les fichiers à migrer"
   ↓
Claude (Sonnet) → veut lancer Grep useAuth
   ↓
PreToolUse hook intercepte :
   - Pattern détecté : "explore + summarize"
   - Spawn worker Haiku via API (BYOK)
   - Worker : grep + reads + résume HORS session
   ↓
Hook injecte le résumé dans le contexte Sonnet :
   "[Worker] Found 12 uses in 8 files: src/auth/login.tsx (line 4), ..."
   ↓
Session Sonnet continue avec 400 tokens injectés au lieu de 4000
```

### 3.3 Stack

- **Hooks** : `PreToolUse` sur Read / Grep / Glob / Bash, `PostToolUse` sur Bash pour truncation
- **Worker** : appel direct API Anthropic Haiku avec clé user (BYOK strict, jamais OAuth Pro/Max)
- **Classifier V1** : rules-based (regex sur prompt + pattern de tool call)
- **State local** : `~/.config/<name>/state.json` — cache des dispatches, mesures de savings
- **Dashboard** : single-page web statique servie en local, lit le state.json
- **Billing** : Stripe + webhook → mesure cumulée du mois → trigger refund auto si savings < subscription
- **Zéro daemon, zéro BDD, zéro upload (sauf Stripe events)**

### 3.4 Patterns à intercepter en V1 (conservateur)

| Pattern | Trigger | Économie estimée |
|---|---|---|
| Bash output > 200 lignes | `PostToolUse Bash` | 500-2000 tokens / call |
| File read > 500 lignes | `PreToolUse Read` | 1000-5000 tokens / call |
| Grep avec > 10 résultats | `PreToolUse Grep` puis re-dispatch | 2000-8000 tokens |
| Multi-file audit ("read all X, summarize") | Pattern detection sur prompt user | 5000-15000 tokens |
| Re-read d'un fichier inchangé | Hash-based dedup | 1000-5000 tokens |

**Règle d'or** : ne pas intercepter en cas d'ambiguïté. *Better miss savings than fabricate them.*

---

## 4. Pricing

### Modèle final retenu : **flat 9€/mo + dashboard transparent + money-back garanti**

> *"9€/mo. Dashboard live de tes économies. Si on te fait pas économiser au moins 2x ton abonnement ce mois, remboursé automatique. Pas de questions."*

### Pourquoi ce modèle

| Critère | Flat 9€/mo + refund | 30% des savings (alt) |
|---|---|---|
| Simplicité billing | ✅ | ❌ Disputes possibles |
| Trust buyer | ✅ Risque zéro | ✅ Aligné |
| Prévisibilité revenue | ✅ | ❌ Variable |
| Marketing claim | ✅ "Pay 9$, save 40$+, or it's free" | 🟡 Calcul à expliquer |
| Skin in the game | ✅ Refund auto | ✅ Aligné par design |

### Tiers

- **Solo** : 9€/mo, money-back si savings < 18€ ce mois
- **Team** : 12€/seat/mo, money-back si savings < 24€/seat ce mois
- **Free trial** : 14 jours, dashboard actif, pas de billing

---

## 5. Comment garantir des vraies économies (engineering)

### 5.1 Mesure — 3 niveaux

1. **Comptage brut (V1, 80% précis)** : chaque dispatch logue `tokens injectés vs tokens qui auraient été injectés × prix modèle`. Cumulé en savings nettes.
2. **Baseline calibration (V1)** : première semaine en mode passif (mesure sans intercepter) → établir burn rate de référence → comparer.
3. **Dry-run échantillonné (V2)** : 1 dispatch sur 20 run en parallèle "intercepté" ET "laisser Sonnet" → audit-grade savings claim, calibration continue de l'algo.

### 5.2 Les 4 règles non négociables

1. **Classifier conservateur** : intercepter seulement où le saving est évident. Skip l'ambigu.
2. **Compteur transparent par dispatch** : tooltip cliquable, log complet, l'user peut auditer.
3. **Quality auto-verification** : 1 dispatch sur 50, le résultat Haiku re-vérifié par Sonnet en background. Si miss → flag + ajuste rules.
4. **Money-back automatique** : règle simple, refund Stripe sans question si compteur < cap. ~10 lignes de code.

---

## 6. Risk matrix (à mitiger en build)

| Risque | Proba | Impact | Mitigation |
|---|---|---|---|
| Anthropic auto-trigger Task tool | 50-60% à 18m | 🔴 Tue le moat | Pivot path : multi-modèle (Codex/Cursor), team tier B2B |
| Économies réelles < 20% en moyenne | 50% | 🔴 Tue le pricing | **Benchmark obligatoire en validation (cf docs/15)** |
| Qualité Haiku visiblement dégradée | 40% | 🔴 Churn | Auto-verification + classifier conservateur |
| Latence > 1s perçue | 30% | 🟠 Churn seniors | Async workers + statusline indicator |
| Pricing Pro/Max ne décolle pas (Pro à 20€ + 9€ = +45%) | 50% | 🟠 ARPU ↓ | Tester 7€ vs 9€ vs 12€ en pre-order |
| Build > 12 semaines | 60% | 🟠 Mental runway | Scope strict V1, pas de team tier avant V2 |

---

## 7. Projections financières (réalistes après stress test)

ARPU blended estimé : **~8€/mo** (mix solo + team, après refunds).

| | M6 | M12 | M24 | M36 |
|---|---|---|---|---|
| Paying users | 100-150 | 500-900 | 2 000-3 500 | 4 000-7 000 |
| MRR | 0.8-1.2k€ | 4-7k€ | 16-28k€ | 32-56k€ |
| ARR | 10-15k€ | 50-85k€ | 200-340k€ | 380-670k€ |

**Seuil 5-10k€ MRR du brief initial** : atteignable M12-15 sur scénario réaliste.
**Plafond solo no-hire** : ~50-80k€ MRR Y3 selon exécution.

Comparaison alternatives :
- Clawkin : 0.5-3k€ MRR plafond Y3
- Cost Firewall pur : 5-15k€ MRR plafond Y3
- **Smart Routing : 30-80k€ MRR plafond Y3**

---

## 8. Différences vs brief Clawkin original

| Critère brief | Clawkin | Smart Routing |
|---|---|---|
| Zéro support | ✅ | 🟡 ~3-8h/sem ongoing |
| Solo-buildable | ✅ 2-3 sem | 🟡 6-10 sem |
| Distribution PLG | ✅ Viral screenshot | ✅ Utility PLG + content |
| Monétisation automatisable | ✅ | ✅ |
| Pas d'appels co | ✅ | ✅ (sauf si pivot enterprise) |
| Zéro LLM côté backend | ✅ | ❌ Haiku worker = LLM (côté user via BYOK) |

**Trade-off accepté** : on perd la pureté "zéro LLM" pour gagner un produit avec WTP 5-10x supérieure. La maintenance reste raisonnable (3-8h/sem) et le LLM tourne côté user via BYOK, donc pas de coût ni de risque légal côté serveur.

---

## 9. Décision

**Smart Routing est l'hypothèse retenue comme finaliste.**
**Pas encore une décision actée.**

Avant de commiter 6-10 semaines de build, il faut valider 3 inconnues critiques en 1 semaine. Plan d'exécution détaillé : [docs/15-validation-plan-1-week.md](15-validation-plan-1-week.md).

Si validation 3/3 → ship V1 (6-10 semaines).
Si 2/3 → ajuster (souvent le pricing) et re-tester.
Si 1/3 ou 0/3 → retour à Clawkin sans regret.
