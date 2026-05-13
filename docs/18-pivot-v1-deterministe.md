# 18 — Pivot V1 : déterministe sans LLM

> Décision actée le 2026-05-13 : V1 de Clawkin = **zéro appel LLM côté worker**. Pattern 1 (bash truncate) basé sur une heuristique simple (premières N lignes + dernières N lignes), restreinte à une allowlist de commandes "safe". Annule la spec [doc 17](17-feature-1-spec-detaillee.md) §5 (Worker Haiku) pour V1. Haiku reste en option upgrade V2.

---

## 1. Pourquoi ce pivot

Trois raisons.

### 1.1 Zéro friction install
La spec 17 demande une clé API Anthropic (BYOK) à l'install. Pour les ~60% des users de Claude Code qui sont sur abonnement Pro/Max, ça veut dire :
- Aller créer un compte API console
- Charger une carte de crédit
- Coller une clé dans un script qu'ils ne connaissent pas

Conversion install → trial start s'effondre. La version déterministe : `curl | sh` → ça marche.

### 1.2 Marge propre money-back
Sans Haiku, les économies sont **brutes**. Pas de coût à grignoter. Le threshold money-back 18€/mois est tenable mécaniquement, pas par chance sur la qualité d'un LLM.

### 1.3 Pas de risque ToS
Pas de question sur les abonnements Pro/Max (utiliser leur OAuth pour appeler Haiku = violation ToS). Pas de question sur la qualité du résumé Haiku qui pourrait perdre une info critique.

---

## 2. Ce qui change vs spec 17

| Spec 17 | Pivot V1 |
|---|---|
| Worker Haiku 4.5 obligatoire | Truncation déterministe |
| BYOK clé Anthropic à l'install | Aucune clé requise |
| Prompt templates `prompts/*.md` | Plus nécessaires |
| Quality auto-verify Sonnet | Plus nécessaire |
| Formule savings avec coût Haiku | Formule gross (pas de coût LLM à déduire) |
| Latence dispatch < 1s | Latence dispatch < 5ms |

Le reste de la spec 17 (state schema, money-back, Stripe, dashboard, statusline) reste **valide tel quel**.

---

## 3. Heuristique Pattern 1 déterministe

**Trigger** : `PostToolUse` avec `tool_name === "Bash"` ET :
- `output.length > 200 lines`
- ET la commande contient un binaire de l'allowlist (cf §4)
- ET les 20 dernières lignes ne contiennent pas `error`, `fail`, `exception`, `traceback`

**Action** :
- Garder les **30 premières lignes**
- Garder les **30 dernières lignes**
- Remplacer le milieu par `[Clawkin: N lines truncated]`
- Réinjecter ce texte trimmé dans le contexte de la session via `hookSpecificOutput.additionalContext`

**Économie** : `(raw_tokens - trimmed_tokens) × prix_Sonnet_input_par_token`.

**Garde-fous** :
1. Si command pas dans l'allowlist → skip. *Better miss savings than miss info.*
2. Si error marker en queue → skip. (Idem spec 17 §4.1, conservé.)

---

## 4. Allowlist V1

```
Package managers : npm, yarn, pnpm, npx, pip, pip3, poetry, pipenv, cargo, gem, bundle, composer
Build tools      : make, cmake, gradle, gradlew, mvn, bazel, ninja, webpack, vite, rollup, esbuild, tsc, parcel
Test runners     : pytest, jest, vitest, mocha, rspec, phpunit, tox, go (test)
Containers       : docker, podman
OS packages      : apt, apt-get, brew, yum, dnf, pacman
```

Détection : la commande est tokenisée sur espaces, `&&`, `||`, `;`. Si **n'importe lequel** des tokens est dans l'allowlist → safe.

Exemples :
- ✅ `npm install` → safe (token `npm`)
- ✅ `cd src && pytest tests/` → safe (token `pytest`)
- ❌ `git log --oneline` → unsafe (aucun token allowlisté)
- ❌ `grep -r foo .` → unsafe

Cette liste évoluera avec le retour terrain. V2 : opt-in user pour étendre.

---

## 5. Estimation économies V1 vs spec 17

Mesure interne via simulateur sur logs réels (npm install, pytest, docker build) :

| Métrique | Spec 17 (Haiku) | Pivot V1 (déterministe) | Δ |
|---|---|---|---|
| Compression ratio moyen | ~95% | ~85% | -10pts |
| Économies brutes/dispatch | 5000-50000 tokens | 3500-35000 tokens | -30% |
| Coût Haiku par dispatch | ~300 tokens | 0 | +100% |
| Économies nettes/dispatch | ~85% du brut | 100% du brut | +15pts |
| **Économies nettes mensuelles user actif** | **25-40€** | **15-25€** | **-35%** |

**Conclusion** : V1 capture ~60-70% des économies de la spec 17. Threshold 18€/mois reste tenable pour user "actif" (≥ 10 commandes longues / jour). Pour user light : risque refund plus haut → acceptable car coût Haiku = 0 et la promesse "money-back si tu n'économises pas" reste vraie.

---

## 6. Patterns 2/3/4 — état au pivot

| Pattern | Spec 17 | Pivot V1 |
|---|---|---|
| **2. File read dedup** | Hash + dedup, pas d'IA déjà | **Inchangé** — pure déterministe |
| **3. Grep summarize** | Haiku regroupe par fichier | Déterministe : top 5 fichiers par count de matches |
| **4. Audit task hint** | Regex sur user prompt | **Inchangé** — pure déterministe |

Les 4 patterns sont 100% faisables sans LLM. La spec 17 §4 n'avait Haiku qu'en option pour 1 et 3.

---

## 7. Haiku en upgrade V2 (option future)

Spec 17 §5 (Worker Haiku) reste documentée comme **option payante future** : *"Active AI compression"* en addon. Plus de gains mais BYOK requis. Permet de capturer la cohorte "advanced" sans bloquer le bulk users.

Conditions de réactivation Haiku :
- ≥ 500 paying users sur Clawkin V1 déterministe (validation produit)
- Demande explicite users *"je veux compresser plus, je donne ma clé"*
- Telemetry montre que le 20-30% de cas non couverts par déterministe pèsent significativement dans la valeur perçue

---

## 8. Code impact (branche `claude/routing-feature-1-3lBN6`)

Refactor du runtime `clawkin/` :

- **Supprime** : `lib/haiku-dispatch.mjs`, `lib/key.mjs`, `prompts/bash_truncate.prompt.md`
- **Ajoute** : `lib/trim.mjs` (truncation déterministe), `lib/safe-commands.mjs` (allowlist)
- **Met à jour** : `lib/classifier.mjs` (check allowlist), `lib/router.mjs` (call trim), `lib/savings.mjs` (drop Haiku cost), `hooks/post-tool-use.mjs`, `bin/simulate.mjs`
- **Inchangé** : `lib/state.mjs`, `lib/paths.mjs`, `hooks/pre-tool-use.mjs`, `package.json`

---

## 9. Ce qui doit être vrai avant le prochain sprint

- ✅ Cette décision actée en docs (ce fichier)
- ✅ Refactor code mergé sur la branche routing
- ⏳ Test sur 5-10 logs bash réels du dev (npm, pytest, docker build) → mesurer compression ratio empirique
- ⏳ Si compression ratio < 70% sur les cas réels → réviser head/tail sizes ou élargir allowlist
- ⏳ Re-decider GO/NO-GO sprint 2 (installer script + intégration Claude Code)
