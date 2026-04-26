# 11 — Propositions d'amélioration de la valeur perçue

> **Statut : exploratoire — non décidé.**
> Document de réflexion issu d'une conversation externe le 2026-04-26. Aucune de ces propositions n'est validée pour implémentation. À arbitrer en discussion avant d'éventuellement passer en roadmap (cf [docs/04](04-roadmap-et-decisions.md)).
>
> Garder ces idées au chaud sans les acter : elles peuvent inspirer des choix futurs, être implémentées partiellement, ou être écartées.

---

## Pourquoi ce document existe

Le produit actuel (v0.1.0) repose sur un mécanisme solide : gamifier l'optimisation de la consommation de tokens et de la gestion de la fenêtre de contexte Claude Code, sans jamais l'appeler ainsi. La landing page existe, la doc stratégique est complète, le CLI est en construction.

**Le gap identifié dans la conversation** : la valeur perçue serait insuffisante pour déclencher l'install et surtout la rétention. Trois problèmes hypothétiques :

1. **La boucle cause-effet est invisible.** Le dev ne voit pas ce que son comportement produit sur son Clawkin. Sans feedback immédiat, il ne comprend pas le mécanisme.
2. **Le différenciateur paid est flou.** Le free user a déjà un badge. Pourquoi payer ?
3. **La LP ne montre pas la profondeur du système.** Un dev qui arrive cold voit un pet ASCII. Il ne réalise pas qu'il y a un système de progression, une identité unique, une histoire non-falsifiable.

Les 4 propositions ci-dessous adressent chacun de ces gaps. **À discuter avant tout commit.**

---

## Proposition 1 — Session Replay ASCII

### Concept

Après chaque session Claude Code, le CLI affiche un résumé de 3 lignes dans le terminal au moment de la fermeture. Pas de notification, pas de toast : juste un bloc ASCII dans le flux normal du terminal.

```
── session ended ─────────────────────────
  clawkin  +22xp  ▲ clean shot  ctx 41%
  L48 → L49  ·  streak holds  ·  #312 Architect
──────────────────────────────────────────
```

Si la session était mauvaise :

```
── session ended ─────────────────────────
  clawkin  -4xp  ▼ context saturated 89%
  L48  ·  streak holds  ·  your clawkin looks tired
──────────────────────────────────────────
```

### Valeur supposée

- **Feedback loop immédiat** : le dev comprend la boucle dès la première session. Règle de game design : la récompense doit être visible dans les 3 secondes après l'action.
- **Viralité passive** : chaque screenshot de terminal partagé inclut naturellement ce résumé.
- **Signal de qualité en temps réel** : `ctx 41%` et `clean shot` sont les deux métriques les plus directement actionnables pour le dev.

### Débat

| Pour | Contre |
|---|---|
| Feedback loop manquant résolu dès J1 | Risque de verbosité — les devs désactivent tout ce qui pollue |
| Contenu viral par construction | Doit être configurable (opt-out en une ligne) |
| Renforce la compréhension du mécanisme XP | Si mal formaté, perçu comme du bruit |

### Piste de décision (à challenger)

Implémenter en V1, activé par défaut, désactivable via variable d'environnement `CLAWKIN_QUIET=1`.

### Complexité estimée

2-3 heures. String formatting sur les données déjà collectées.

---

## Proposition 2 — Le Ghost : ton meilleur toi passé

### Concept

La statusline et la page profil paid affichent en permanence un indicateur discret comparant la qualité actuelle à ton pic personnel des 30 derniers jours.

```
▣▤  L49 · 4sem  ↑  |  claude-sonnet-4-6 · 41% ctx · $0.09
```

- `↑` = au-dessus de ton ghost (qualité moyenne de la session > pic 30j)
- `↓` = en dessous du ghost
- `·` = dans la norme (zone ±10%)

Pas de chiffre, pas de message. Juste une flèche.

### Valeur supposée

- **Rétention intrinsèque** : se battre contre soi-même est un mécanisme de rétention éprouvé (Mario Kart ghost, Strava segment PR, Zwift ghost rider).
- **Répond au besoin réel des devs seniors** : "est-ce que je progresse ou je tourne en rond ?"
- **Différenciateur paid concret** : le free user voit son niveau et sa streak. Le paid user voit s'il est au-dessus ou en dessous de son meilleur.

### Débat

| Pour | Contre |
|---|---|
| Mécanisme de rétention éprouvé | Si trop visible, peut créer de l'anxiété (contra-positioning avec le "awareness not compulsion") |
| Argument de conversion paid concret | Le ↑/↓ peut être mal interprété sans contexte |
| Zéro comparaison avec d'autres users — sain | Requiert 30 jours de data — les nouveaux users ne verront rien |

### Piste de décision (à challenger)

Implémenter en V1, réservé paid uniquement. Affiché dans la statusline et sur la page profil. Désactivé les 30 premiers jours (pas de ghost sans historique suffisant).

### Complexité estimée

1 journée. Calcul du Q moyen 30 derniers jours, comparaison avec la session courante, output d'un caractère.

---

## Proposition 3 — Fossil Gallery : l'histoire non-falsifiable

### Concept

Chaque fois que le numéro #N du Clawkin change significativement (pattern d'usage qui évolue), l'ancienne forme est archivée automatiquement dans une "fossil gallery" sur la page profil paid. Le dev peut voir qui il était comme dev à chaque période.

```
── your history ──────────────────────────
  #031  march      Surgeon      ████████
  #247  april      Architect    ██████░░
  #891  this week  Explorer     ████░░░░  ← now
──────────────────────────────────────────
non-falsifiable. only yours.
```

### Valeur supposée

- **Narrative design** : chaque dev a une bio technique unique, encodée dans ses patterns d'usage, impossible à copier ou acheter.
- **Différenciateur paid émotionnel** : free user = photo. Paid user = album.
- **Valeur qui s'accumule dans le temps** : plus un user reste, plus sa fossil gallery est riche. Le churn devient irrationnel.
- **Data-as-asset** : les patterns de transitions peuvent alimenter le "State of Claude Code" trimestriel (cf [docs/09](09-data-collection-et-rapports.md)).

### Débat

| Pour | Contre |
|---|---|
| Valeur perçue forte sur le long terme | Dépend de la qualité visuelle des sprites |
| Churn-breaker naturel | Requiert le générateur de sprites Q2 pour être visuellement impactant |
| Argument de conversion paid émotionnel | Premier changement de forme significatif à ~J30-J60 |

### Piste de décision (à challenger)

Documenter et architecturer maintenant (la logique de détection de changement de #N dans le V1). Affichage visuel complet en V1.5, après le générateur de sprites Q2.

### Complexité estimée

- Détection et stockage des transitions #N : 0.5 journée (V1)
- Affichage visuel avec sprites : 2-3 jours (V1.5, après Q2)

---

## Proposition 4 — Monthly Report Card CLI

### Concept

Le premier lundi de chaque mois, à la première session Claude Code, le CLI affiche un résumé mensuel de 6-8 lignes dans le terminal. Pas d'email, pas de notification OS — uniquement dans le flux du terminal au bon moment.

```
── april 2026 ────────────────────────────
  sessions   34      quality avg   1.41×
  best week  w15     ctx discipline  ↑ +8%
  xp earned  +1,240  streak        4 sem
  level      L38 → L56    #428 Architect
  vs march   quality +12%  sessions +6%
──────────────────────────────────────────
```

### Valeur supposée

- **Rituel de début de mois** : le lundi matin = reset psychologique naturel.
- **Vue macro complémentaire** au feedback immédiat de la Proposition 1.
- **Comparaison à soi-même** : `vs march: quality +12%` est la seule comparaison non-toxique.
- **Contenu partageable** : 6 lignes copiables dans un tweet ou un Slack.

### Débat

| Pour | Contre |
|---|---|
| Timing — lundi matin dans le terminal | Risque de bruit si cadence trop haute |
| Complémentaire au Session Replay | Requiert 30 jours de data |
| Partageable naturellement | Si le mois était mauvais, le rapport est démotivant |

### Piste de décision (à challenger)

Implémenter en V1, cadence mensuelle. Déclenché uniquement si >5 sessions dans le mois écoulé. Si le mois était en baisse, formuler de façon neutre sans culpabiliser.

### Complexité estimée

1 journée. Templating sur des agrégats mensuels.

---

## Conséquences hypothétiques sur la Landing Page

Si les 4 propositions étaient retenues, la LP actuelle (`landing/v1.11-no-leaderboard/`) devrait être retravaillée. Trois pistes :

### 1. La fenêtre demo en 2 actes

- **Acte 1** (session propre) : `clawkin → clean shot detected. ctx 41%. +22xp. L48 → L49`
- **Acte 2** (session bloatée, fade in à +2s) : `clawkin → context saturated at 89%. -4xp. your clawkin looks tired.`

### 2. La fossil gallery comme concept visuel

Bloc ASCII 4 lignes montrant le concept d'histoire non-falsifiable. Dernière ligne : `non-falsifiable. only yours.`

### 3. Le ghost dans la statusline de démo

Ajouter `↑` ou `↓` à la statusline de la démo.

---

## Récapitulatif (à arbitrer, pas à exécuter)

| Proposition | Scope envisagé | Priorité suggérée | Complexité |
|---|---|---|---|
| Session Replay ASCII | V1 — activé par défaut | Critique J1 | 2-3h |
| Ghost (↑/↓ paid only) | V1 — paid uniquement | V1 | 1 jour |
| Fossil Gallery (architecture) | V1 — affichage V1.5 | V1 + V1.5 | 0.5j + 2-3j |
| Monthly Report Card CLI | V1 | V1 | 1 jour |
| LP — démo 2 actes | V1 | Avant launch | 2-3h |
| LP — fossil concept + ghost statusline | V1 | Avant launch | 1-2h |

**Total dev estimé si tout retenu : 2-3 jours.**

---

## Garde-fous (non-négociables, déjà actés ailleurs)

Si on implémente l'une de ces propositions, elle doit rester dans les red lines déjà décidées :

- ❌ Pas de notifications "your clawkin misses you"
- ❌ Pas de streak counter quotidien avec état "broken"
- ❌ Jamais de comparaison avec d'autres users
- ❌ Zéro LLM dans le pipeline de calcul
- ✅ Tout est opt-out via variable d'environnement
- ✅ Tout est déterministe — mêmes inputs → mêmes outputs
- ✅ Awareness, jamais compulsion

---

## Questions ouvertes pour la discussion

À traiter avant d'acter quoi que ce soit :

1. La Proposition 1 (Session Replay) est-elle vraiment compatible avec "awareness not compulsion" ? Un résumé après chaque session, n'est-ce pas un nudge déguisé ?
2. Le Ghost (Proposition 2) introduit une logique de "performance vs soi-même" — est-ce qu'on ne glisse pas de l'awareness vers la pression d'auto-optimisation ?
3. La Fossil Gallery (Proposition 3) suppose une détection robuste des changements de #N — est-ce que la formule actuelle (cf [docs/10](10-formule-et-progression.md)) le permet sans bruit ?
4. Le Monthly Report (Proposition 4) chevauche-t-il le "State of Claude Code" trimestriel prévu (cf [docs/09](09-data-collection-et-rapports.md)) ? Risque de redondance ?
5. Les modifs LP risquent-elles de complexifier un message qu'on a justement passé 11 itérations à simplifier ?
