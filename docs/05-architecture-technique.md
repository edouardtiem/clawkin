# 05 — Architecture technique V1

> Décision verrouillée. Le produit tourne sans LLM, sans coût token additionnel pour l'utilisateur, sans daemon. Tout est déterministe et local.

---

## Principe directeur

**Zéro prompt au modèle Claude pour le fonctionnement du Clawkin.** La détection d'activité, le calcul des pellets, la progression de niveau et le rendu de la statusline sont 100% déterministes et tournent entièrement sur la machine de l'utilisateur.

Conséquences :
- Le produit n'alourdit PAS la facture API de l'utilisateur
- Le coût marginal côté clawkin.sh par utilisateur est de quelques centimes par an
- Le tier Solo Dev à 9$/yr (V2) a une marge brute > 98%
- L'infra V1 tient sur un free tier Vercel/Cloudflare jusqu'à plusieurs milliers d'utilisateurs

---

## D'où viennent les données

Claude Code émet nativement tout ce dont on a besoin.

### 1. Hooks lifecycle
Déclarés dans `~/.claude/settings.json`. Chaque événement peut exécuter un script shell local. Événements disponibles :

| Événement | Déclenché quand |
|---|---|
| `SessionStart` | Début d'une session Claude Code |
| `UserPromptSubmit` | L'utilisateur envoie un prompt |
| `PreToolUse` | Avant un tool call |
| `PostToolUse` | Après un tool call |
| `Stop` | Claude finit de répondre |
| `PreCompact` | Claude s'apprête à compacter le contexte |
| `SessionEnd` | Fin de session |

Chaque hook reçoit un JSON contextuel (session_id, timestamps, données d'événement). Le script peut lire + écrire `~/.config/clawkin/state.json` en quelques millisecondes.

### 2. JSON statusLine sur stdin
Le script déclaré comme `statusLine` dans `settings.json` reçoit à chaque rafraîchissement un JSON sur stdin contenant :
- `model.name` (ex: `claude-sonnet-4-6`)
- `context_window.used_percentage` ← **métrique clé pour l'hygiène**
- `cost.total_cost_usd`
- Durée de session
- Autres champs documentés officiellement par Anthropic

Ce que ce script imprime = ce que voit l'utilisateur dans sa statusline.

---

## Mécaniques déterministes

### Attribution des pellets

Logique triggered par les hooks, pure bookkeeping :

| Événement hook | Condition | Pellets |
|---|---|---|
| `SessionEnd` | `context_used_percentage < 50%` | +1 (clean session) |
| `Stop` | pas de `UserPromptSubmit` dans les 60s qui suivent | +1 (one-shot bonus) |
| `PreCompact` | déclenché pendant la session | 0 (session flagguée "dirty", malus possible) |
| `SessionStart` | première session du jour | +1 (daily ration) + streak++ |
| `UserPromptSubmit` | — | 0 pellet (trackéé uniquement pour la détection one-shot) |

**Cap journalier** : 8-10 pellets max toutes sources confondues (à calibrer — cf [Q1 dans docs/04](04-roadmap-et-decisions.md)).

Chaque événement = 1 cycle "lire state.json → appliquer règle → écrire state.json". Durée : < 10 ms.

### Passage de niveau

State local contient :
```json
{
  "pellets_total": 147,
  "level": 23,
  "streak_days": 12,
  "last_active_date": "2026-04-21",
  "last_session_end": "2026-04-21T18:34:21Z",
  "last_prompt_submit": "2026-04-21T18:32:15Z",
  "dirty_session": false,
  "discovered_levels": [1, 2, ..., 23]
}
```

À chaque mise à jour de `pellets_total`, recalcul du niveau :
- `current_level = max(N where X[N] <= pellets_total)`
- `X[N]` est la courbe de progression (formule à calibrer en Q1)
- Si niveau change → sprite mis à jour dans la statusline + push vers badge endpoint si autorisé

### Rendu de la statusline

Script shell ultra-léger déclaré comme `statusLine` dans settings.json :

```sh
#!/bin/sh
# Lit le JSON stdin pour les données live, et state.json pour le Clawkin
read -r json
level=$(jq -r '.level' ~/.config/clawkin/state.json)
streak=$(jq -r '.streak_days' ~/.config/clawkin/state.json)
sprite=$(cat ~/.config/clawkin/sprites/level-${level}.txt)
echo "${sprite} L${level} · ${streak}d streak"
```

Zéro appel réseau, zéro parsing lourd. Exécution < 10 ms à chaque tick.

---

## Ce qui tourne côté serveur (V1 minimal)

### Badge endpoint `clawkin.sh/u/:handle.svg`
- **Input** : handle GitHub/Twitter + données pushées périodiquement par le CLI
- **Output** : SVG rendu avec sprite + level + streak
- **Storage** : KV (Upstash / Vercel KV / Cloudflare KV) — gratuit jusqu'à des dizaines de milliers d'entrées
- **Compute** : edge function stateless — gratuit sur les free tiers jusqu'à plusieurs millions de requêtes/mois
- **Auth** : aucune (handle comme identifiant public, même pattern que shields.io). L'authenticité vient du push côté CLI, pas de l'endpoint lecture.

### Install script `clawkin.sh/install`
- Sert un shell script qui :
  1. Télécharge les binaires/scripts clawkin
  2. Ajoute les entrées à `~/.zshrc` (hook de prompt) et `~/.claude/settings.json` (hooks + statusLine)
  3. Crée `~/.config/clawkin/state.json` initial
- Statique, servi depuis GitHub raw ou le CDN Vercel

### Ce qu'il n'y a **PAS** en V1

- ❌ Pas de backend d'analyse
- ❌ Pas d'OAuth (arrive en V2 avec le leaderboard)
- ❌ Pas de DB relationnelle (juste KV)
- ❌ Pas de Stripe / paiement (V2)
- ❌ Pas de système de notifications push
- ❌ Pas d'email
- ❌ Pas d'admin dashboard

Tout arrivera en V2 (leaderboard + monétisation). Voir [docs/03](03-plg-levers.md) pour le signal de bascule.

---

## Modèle de coût

### Côté utilisateur
- **Zéro coût supplémentaire en tokens.** Le produit n'appelle JAMAIS Claude. Toutes les données sont déjà émises par Claude Code nativement pour ses propres besoins.
- **CPU négligeable.** Chaque hook exécute un script shell de quelques ms, ~10-20 fois par session. Imperceptible.
- **Espace disque** : `state.json` < 1 KB + sprites locaux pré-téléchargés < 500 KB total.

### Côté clawkin.sh (serveur) — V1 à 10k users actifs
| Poste | Estimation |
|---|---|
| Badge endpoint (~100k req/jour, cachable CDN) | < 5€/mois (Vercel/Cloudflare) |
| KV storage (10 MB total) | Free tier |
| Bandwidth CDN | Free tier (< 100 GB/mois) |
| Domaine .sh | ~50€/an |
| **Total V1** | **< 20€/mois** |

### Côté clawkin.sh — V2 avec leaderboard + monétisation à 10k users payants
| Poste | Estimation |
|---|---|
| Infra compute (backend + leaderboard queries) | ~30€/mois |
| DB utilisateurs (Supabase ou équivalent) | ~25€/mois |
| Stripe fees (2.9% + 0.30€ par transaction) | ~8% du revenue |
| **Total V2** | **~100€/mois d'infra + frais Stripe** |

**Revenue V2 à 10k users payants** : 10k × 9$/an = 90k$/an = 7.5k$/mois  
**Marge brute V2** : > 98%

---

## Pourquoi on n'a **pas** besoin d'un LLM

Trois tentations à écarter activement :

### 1. "Analyser la qualité de la session avec un LLM"
Over-engineered. Les 3 métriques du brief §6 (% contexte utilisé en fin de session, taux de prompts one-shot, streak de jours actifs) sont déterministes, calculables instantanément, et suffisantes pour calibrer l'hygiène. Un LLM ajouterait de la subjectivité, du coût, de la latence, et des hallucinations potentielles pour zéro gain pertinent.

### 2. "Générer du feedback personnalisé pour le dev"
Hors scope. Le produit est positionné **awareness**, pas **helper** (cf décision session 1). Le Clawkin ne parle pas, il existe. Toute génération de texte personnalisé déplace le positionnement vers un coach, avec tout le mensonge implicite qui va avec (un LLM ne te connaît pas vraiment). On laisse au dev le soin de tirer ses propres conclusions de ce qu'il voit dans sa statusline.

### 3. "Générer les sprites avec un LLM"
Techniquement impossible sans casser la promesse produit. Le brief §8 exige que **tous les devs au même niveau voient la même créature** partout dans le monde (pour que le screenshot soit reconnu en 3 secondes, pour que le Pokédex fonctionne, pour que le "premier découvreur" ait un sens). Un LLM n'est PAS déterministe : même seed + même prompt → résultat différent selon la version du modèle, la température, le nondéterminisme interne. La génération de sprites doit être un **algorithme déterministe** de composition de primitives, pas un modèle génératif.

La bonne approche pour Q2 (cf [docs/04](04-roadmap-et-decisions.md)) : règles de composition + seed basée sur le level → toujours le même sprite pour le même level, partout, pour toujours.

---

## Dépendances critiques à monitorer

### API hooks Claude Code
Si Anthropic change le format JSON des événements, le nom des hooks, ou retire certains événements → le produit casse, sans contournement. **Suivi obligatoire des release notes Claude Code.**

### Format JSON statusLine
Idem. Le script statusLine dépend du schéma JSON envoyé. Une breaking change côté Anthropic = restauration forcée.

### Existence même de Claude Code CLI
Si Anthropic retire le CLI, dépréce la commande `claude`, ou pousse uniquement vers une UI graphique, Clawkin disparaît avec. Risque acté dans brief §12.

### Mitigations possibles (post-V1)
- Maintenir une couche d'abstraction entre les données brutes des hooks et la logique pellet, pour absorber un changement de schéma
- Documenter la version minimale de Claude Code supportée
- Watcher les releases Anthropic (GitHub, X, newsletter) — éventuellement automatisé

---

## Conséquences directes pour les décisions business

1. **Le $9/yr du tier Solo Dev V2 est confortable.** Marge > 98%. On pourrait même baisser à 5$/yr si on voulait maximiser l'adoption, mais la friction Stripe sur < 7$ bouffe la marge (brief §10).

2. **Pas besoin de fundraise pour l'infra V1.** Le solo dev peut shipper sans rien payer au-delà du domaine et de quelques euros/mois de Vercel éventuels.

3. **Argumentaire CTO propre.** "Clawkin n'alourdit pas la facture API de vos devs — aucun token supplémentaire consommé." C'est vendable tel quel.

4. **Roadmap V2 gérable.** L'ajout du leaderboard + Stripe en V2 reste simple tant qu'on n'introduit pas de LLM. Si un jour on veut faire un "AI coach" par-dessus → nouveau tier payant qui paie son propre coût. Jamais sur le free tier.
