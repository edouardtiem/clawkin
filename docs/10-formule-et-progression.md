# 10 — Formule d'évolution et système de progression

> Décision actée 2026-04-23 (session 3). Verrouille la formule d'XP, la courbe de progression, les mécaniques d'endgame et la stratégie de rétention long-terme. Synthèse de 3 rapports d'experts (Claude Code hooks, game design progression, psychologie rétention). Intègre les arbitrages Edouard sur décisions 1 et 2. Décision 3 (format Annual Report, génération sans IA, scalable à 10K users) à trancher séparément.

---

## 1. Principe directeur

Trois lignes qui guident tout ce qui suit :

- **Qualité domine volume.** Un dev qui code 2h proprement doit progresser plus qu'un dev qui code 10h brouillon. Le grind de sessions vides ne doit jamais fonctionner.
- **Awareness, pas compulsion.** Zéro streak anxiogène, zéro notification culpabilisante, zéro "your pet misses you". Le Clawkin est indifférent à ton absence.
- **Déterministe partout.** Mêmes signaux → même résultat. Pas d'aléatoire par user pour les paliers (sauf les Rare events et variants cosmétiques, qui sont déterministes par hash).
- **Règles cachées (Prop 4).** Les signaux sont nommés publiquement, les poids et seuils ne sont jamais publiés.

---

## 2. Les 6 signaux Claude Code utilisés

Tous extractibles des hooks lifecycle + JSON statusline, aucun ne regarde le contenu du code.

| # | Signal | Ce qu'il mesure |
|---|---|---|
| 1 | **Edit success rate** | Les modifications de fichiers passent-elles du premier coup ? Un prompt clair = modif qui matche. Conflit sur `old_string` = mauvaise lecture ou prompt flou. |
| 2 | **Read-before-Edit ratio** | Claude a-t-il lu un fichier avant de le modifier ? Le réflexe du dev pro : on regarde avant de toucher. |
| 3 | **Peak context %** | Jusqu'où la fenêtre de contexte s'est remplie. Finir à 50% = session propre. Finir à 95% = contexte forcé, aurait dû splitter. |
| 4 | **Tool diversity** (entropie Shannon) | Variété d'outils utilisés (Read, Edit, Grep, Bash, Task, WebFetch). Diversité = session structurée et riche. |
| 5 | **Bash exit_code success** | Les commandes shell passent-elles ou plantent-elles ? Commandes qui passent = instructions claires. |
| 6 | **Cache hit ratio** | Prompt cache qui tient sur une session cohérente. Rester focus = cache rempli. Chaotique = cache cassé. |

**Poids dans le quality multiplier `Q`** (cachés publiquement) :

- Edit success rate : 25%
- Read-before-Edit : 20%
- Peak context % (inversé) : 15%
- Tool diversity : 12%
- Bash success rate : 10%
- Cache hit ratio : 8%
- Malus `-5 XP × PreCompact_count` (saturation contexte non gérée)

---

## 3. La formule d'évolution

### XP par session

```
XP_session = base × Q × D × S
```

- `base = 15` XP par session clean terminée
- `Q ∈ [0.3, 2.5]` = **quality multiplier**, cf §2
- `D = max(0.1, 1 − sessions_du_jour / 5)` — **diminishing daily returns**. Sessions 1-2 = 100%, session 3 = 60%, session 5 = 20%, session 6+ = 10% (cap dur). Arbitrage Edouard 2026-04-23 : cap à 5 sessions (vs 3-4 initial).
- `S = 1 + 0.05 × min(streak_semaines, 10)` — **bonus régularité hebdomadaire**, plafonné +50% à 10 semaines. Basé sur les **semaines**, pas les jours : rater 2 jours ne casse rien. Anti-anxiété Duolingo.

Borne [0, 300] par session pour éviter les outliers.

### XP cumulée nécessaire par niveau

Courbe inspirée OSRS + WoW rested :

```
XP_cumulée(L) = ⌊50 × L^1.8 × log₂(L + 2)⌋
```

---

## 4. Cibles vérifiées sur 3 profils (simulation 365 jours)

| Profil | Q moyen | Sessions/j | Streak | XP/j net | L @30j | L @180j | L @365j |
|---|---|---|---|---|---|---|---|
| **Intense propre** | 2.0 | 4 | 10 sem | ~85 | L65 | L320 | **L680** |
| **Moyen régulier** | 1.0 | 5 | 5 sem | ~42 | L48 | L240 | **L510** |
| **Tiède brouillon** | 0.5 | 8 (spam) | 2 sem | ~18 (cap bite) | L28 | L135 | **L290** |

**Propriété critique** : le dev intense propre à 4 sessions out-pace le dev spammer à 8 sessions. La qualité domine le volume. Un bot qui ouvre 100 sessions vides plafonne à `D → 0.1` et `Q → 0.3`, gagne ~3 XP/jour. **Non-gameable by design.**

### Cibles macro

- L50 ≈ 1 mois (dev moyen régulier)
- L250 ≈ 6 mois
- L1000 ≈ 18-24 mois
- L10000 ≈ 15+ ans (théorique, Apex)

---

## 5. Mapping niveau ↔ #N de créature

Le **niveau** et le **numéro** sont deux choses distinctes.

- **Le niveau L** croît monotoniquement avec l'XP cumulée. Jamais ne décroît.
- **Le numéro #N** (de #1 à #1000) est une fonction multi-variables de ton **pattern d'usage récent** (90 derniers jours). Peut monter, descendre, ou rester stable quand ton niveau monte.

Exemple : tu peux passer de L247 à L312 pendant que ton numéro reste à #428 (ton pattern d'usage est stable et propre). Un mois plus tard, tu changes de rythme (plus intense), tu bascules vers #652.

**Le numéro raconte qui tu es maintenant. Le niveau raconte combien tu as parcouru.**

La page profil paid affiche ta frise temporelle : `#247 (Q1) → #412 (Q2) → #38 (Q3) → #891 (now)` — bio condensée, non falsifiable.

Fonction déterministe : `#N = f(hash(clean_shot_ratio, peak_context_avg, tool_diversity, streak_regularity, xp_velocity))` mappée sur [1, 1000]. Formule exacte non publiée (Prop 4).

---

## 6. Anti-gaming explicite

Patterns bloqués by design :

- **Sessions vides automatisées** — `Q` tombe à 0.3 (pas de tool calls, pas d'edits), `D` tombe à 0.1 après 5 sessions. Résultat ≈ 3 XP/jour vs 85 pour un dev intense. Inutile.
- **Laisser Claude mouliner 12h** — le cost/duration n'est PAS compté. Seuls les signaux de qualité (edits, reads, context management) comptent. Un refactor de 10k lignes via un Write ne donne rien.
- **Multi-accounts** — un UUID = un Clawkin. Rien n'empêche de multi-account mais chaque instance part de L0. Pas de gain.
- **Bots de diversité artificielle** — un Read suivi d'un Grep suivi d'un Bash random passe `tool_diversity` mais rate `Edit success rate` et `Read-before-Edit` (qui demandent un vrai lien fichier → modif).

---

## 7. Endgame après L1000 atteint

Trois mécaniques orthogonales qui ne se remplacent pas.

### 7.1 Lignées — variété horizontale (priorité haute, V1.5)

À L1000 atteint, ton Clawkin développe un **trait dominant** selon ton profil d'usage des 90 derniers jours. Par paire à L2000 (combinaisons), par triple à L5000 → **220 lignées visuelles distinctes** possibles.

Pas un reset. Ton numéro et ton XP conservés. Juste de la variété qui encode qui tu es comme dev.

Compatible data-as-asset : "State of Claude Code — 34% des devs avec trait Architecte codent en Rust".

### 7.2 Apex — statut pur (priorité haute, implémentation triviale)

Après L10000, un compteur XP continue silencieusement sans nouveau niveau visible, jusqu'à 1 milliard d'XP = statut **Apex**.

Zéro reward mécanique. Juste :
- Un glow permanent sur le sprite dans la statusline
- Nom gravé sur le hiscore public permanent `clawkin.sh/hiscore`

Accessible ~5-8 ans d'usage régulier. Moins de 0.1% des devs y arriveront. **Le statut EST la reward.** OSRS 200M XP vibe.

### 7.3 Zen — XP offline (priorité moyenne, V2)

Post-L1000, ton Clawkin "médite" pendant tes périodes offline (vacances, weekends). Gagne 1 XP Zen par heure offline, plafonné 720/mois.

Le Zen ne donne pas de niveau. Il débloque des **variations cosmétiques rares** (postures de sommeil, animations idle, accessoires discrets).

**Principe** : ne pas coder te donne quelque chose. Anti-FOMO par construction. Anti-burnout dev senior friendly. Compatible awareness ("l'absence est une donnée, pas une punition").

---

## 8. Cadence de contenu annuelle (décision 2)

**Principe verrouillé 2026-04-23** : **chaque année, une nouvelle feature visuelle apparaît à chaque palier de 1K niveaux, visible sur le Clawkin.**

### Rationale

Les devs top (L1000+) doivent avoir quelque chose de neuf à découvrir régulièrement sans qu'on refonde le produit. La cadence annuelle :
- Garde la promesse "tout dev au même niveau voit la même créature" (même feature pour tous à L2000 à un moment donné)
- Ne nécessite pas de re-design produit, juste du content update
- S'aligne avec le rythme éditorial du "State of Claude Code" annuel
- Crée un moment de hype annuel ("Clawkin 2027 update is out, check your level")

### Calendrier prévisionnel (indicatif, sous réserve ajustement)

| Année | Palier ajouté | Feature visuelle |
|---|---|---|
| Y1 (2026) | L1000 | Lignées (12 traits) |
| Y2 (2027) | L2000 | Combinaisons de traits (paires) |
| Y3 (2028) | L3000 | À définir — options : saisons dans le sprite, compagnons, arrière-plan animé |
| Y4 (2029) | L4000 | À définir |
| Y5 (2030) | L5000 | Triples de traits |
| Y6+ | L6000+ | À définir chaque année |

**Note** : les features Y3+ ne sont pas à verrouiller maintenant. On a 18-24 mois avant que le premier dev n'atteigne L2000, et 5+ ans avant L5000. On décidera chaque année en observant ce qui marche et ce que la communauté demande.

**Logique rétroactive** : si un dev est déjà à L3000 quand la feature Y3 est released, la feature apparaît sur son Clawkin immédiatement. Pas besoin de "ré-atteindre" le palier.

---

## 9. Rétention long-terme — 4 mécaniques ambiantes

Orthogonales à l'endgame. Marchent dès J1 et continuent à L10000+.

### 9.1 Annual Clawkin Report (snapshot rituel) — spec complète

1×/an, jour anniversaire d'install. Page HTML statique déterministe, générée sans IA.

#### Principe de génération : templates + variables

Aucun LLM. Le rapport est **composé**, pas écrit. Chaque phrase est un template pré-écrit, rempli depuis les agrégats de l'user.

```
Template :
  "En {year}, tu as codé {hours} heures avec Claude Code,
   dont {deep_pct}% en sessions profondes (+{delta}% vs {prev_year})."

Données user (JSON) :
  { year: 2026, hours: 412, deep_pct: 67, delta: 23, prev_year: 2025 }

Rendu :
  "En 2026, tu as codé 412 heures avec Claude Code,
   dont 67% en sessions profondes (+23% vs 2025)."
```

Zéro inférence. Pur string formatting. Instantané. Déterministe.

#### Narration "intelligente" par règles déterministes

30-50 phrases narratives pré-écrites, chacune activée par un trigger booléen sur les stats de l'user :

```
If max(weekly_sessions_Q2) > 1.3 * avg_weekly:
  "Ton printemps a été un pic — ta semaine la plus dense 
   (week 18) a dépassé ta moyenne annuelle de {pct}%."

If longest_quiet_streak > 14 days AND quality_after > quality_before:
  "Tu as pris une pause de {days} jours en {month}. 
   À ton retour, ta qualité moyenne était {delta}% supérieure."

If most_used_trait matches "Architecte":
  "Cette année, tu as été un Architecte. 
   Tes sessions sont structurées, ton contexte maîtrisé."
```

L'user perçoit un rapport qui lui parle. En vrai, c'est du branching déterministe.

#### Contenu type d'un rapport

- **Chiffres bruts** : heures totales, sessions ouvertes, longest streak, XP gagné, niveau atteint, numéro Clawkin actuel et précédents
- **Histogrammes** : sessions par heure de la journée, par jour de la semaine, tool distribution, model distribution
- **Charts SVG minimalistes** style terminal/ASCII : courbe de level au fil de l'année, barres par mois
- **Milestones personnels** : "Tu as passé L1000 le 14 mars", "Ton #247 Clawkin est apparu le 2 juin"
- **Narration conditionnelle** (cf supra) : 5-8 phrases actives sur les 30-50 templates disponibles
- **Trait de Lignée dominant** (si L1000+) : le trait qui a dominé ton année
- **Comparaisons à toi-même passé** : "Tes semaines calmes sont 2× plus longues qu'en 2025"

#### Esthétique

- **V1 (MVP)** : HTML + Tailwind, typographie clean, look terminal-esque, charts SVG épurés. Zéro JS framework lourd, zéro animation. Shareable mais austère.
- **V1.5** : animations douces à l'ouverture, transitions, easter eggs anniversaire (Roman numeral pour le N-ième anniversaire, palette aux couleurs du trait Lignée).
- **V2+** : version partageable sur réseaux (GIF ou vidéo courte rendue server-side), compatible embed Twitter/Bluesky.

#### Distribution free vs paid

- **Free users** : URL publique anonyme `clawkin.sh/c/{hash}/{year}`
- **Paid users** : URL handle custom `clawkin.sh/u/{handle}/{year}`
- **Même richesse de contenu dans les deux cas.** Seul le slug change.
- **Motif** : l'Annual Report est le meilleur moteur viral possible (share Twitter aux anniversaires). Le handle custom reste le diff identitaire paid pour la page profil permanente, pas pour le rapport.

#### Notification

- **CLI banner silencieux** uniquement, à la première session du jour anniversaire : une ligne discrète en bas du terminal :
  ```
  >>> your 2026 clawkin report is ready — clawkin.sh/u/edouard/2026
  ```
- **Aucun email, jamais.** Dev seniors détestent l'email, et on n'a pas leur adresse (seulement handle GitHub pour paid).
- **Aucune notification OS / push.** Anti-compulsion strict.
- Le dev voit le banner, ou ne le voit pas. Il peut toujours retrouver son rapport par l'URL quand il veut.

#### Génération : on-demand

- **Rendu au premier accès de l'URL**, caché ensuite (Vercel edge cache).
- Pas de batch cron annuel, pas d'infra supplémentaire.
- Premier access : 100-300ms. Subsequent : instant (cache hit).
- Peut basculer vers pré-génération batch plus tard si besoin.

#### Coûts à 10K users (free tier infra)

| Item | Coût |
|---|---|
| Compute edge function (render 1 page) | ~10ms × 10K = 100s total / an |
| Stockage HTML généré | ~50KB × 10K = 500MB |
| Cache hit rate après 1ère visite | ~100% |
| **Coût Vercel + Cloudflare** | **0€ (free tier)** |

Scale infini. Zéro coût variable. Même à 100K users, reste sur des cents par an.

#### Red lines conservées

- Aucun email collecté pour l'Annual Report
- Aucun contenu de code analysé (zéro LLM dans la pipeline)
- Rendu 100% serveur Vercel/Cloudflare, déterministe
- URLs anonymes `c/{hash}` jamais cross-référencées à une identité réelle
- Templates et règles publiés en open source (pas les données user, elles)

### 9.2 Silent evolution milestones (Dark Souls style)
À L1000, L2500, L5000, L10000, le sprite change (pelage, posture, détail pixel). **Zéro annonce. Zéro toast. Zéro "Congratulations!"**. Le dev remarque, ou pas. Crée les conversations entre users ("wait, ton Clawkin a une couronne ?") — seul marketing non-cringe possible.

Intègre directement Prop 4 (règles cachées).

### 9.3 You vs past-you (miroir personnel)
Sur la page profil paid, ligne sobre : *"Over 2 years, your 30-day cadence has deepened by 34%. Your quiet weeks are 2× longer than in 2024."*

Calculé localement depuis l'historique agrégé. Déterministe. **Jamais comparé aux autres users.** Transforme la data en miroir de soi, pas en scoreboard.

### 9.4 Rare visual events (~1-2× / an)
~1 jour sur 200-300, une variation cosmétique apparaît (posture de nuit, accessoire saisonnier discret, palette alternée). Déterministe par `hash(date + user_uuid)` → reproductible mais non anticipable. Aucune action ne le déclenche. Donne une raison de regarder son terminal "sans raison".

### 9.5 Install-aversary silencieux (bonus)
Jour pile de l'anniversaire d'install, le badge README affiche un chiffre romain (II, III, V) à côté du niveau pendant 24h. Disparaît. Signaling ambiant pur.

---

## 10. Ce qu'on ne fait JAMAIS

Franchir une seule de ces lignes détruit le positionnement.

- ❌ **Streak counters quotidiens avec état "broken"** — Duolingo toxic
- ❌ **Notifications "your pet misses you" / anthropomorphisme affectif** — Tamagotchi culpabilisant, mépris instantané dev senior, screenshot moqueur sur Twitter
- ❌ **Achievement toasts "Deep Coder III!" avec animation** — signale F2P mobile, cheapify
- ❌ **Leaderboards globaux live** — décourage post-#1000. Si V2 leaderboard, figé par cohorte annuelle type Wrapped
- ❌ **Cost / session count / lines added comme moteur XP** — pur volume, grind-able trivialement
- ❌ **Rate limit usage comme signal positif** — récompenser le burn de prompts = anti-signal

---

## 11. Intégration Prop 4 — règles cachées

### Communiqué publiquement
- Les 6 signaux **nommés** (Edit success rate, Read-before-Edit, Peak context %, Tool diversity, Bash success rate, Cache hit ratio)
- Le concept général ("Clawkin évolue avec ta pratique, pas ton volume")
- Les mécaniques globales (Lignées, Apex, Zen, Annual Report)
- La promesse de progression approximative (L50 ≈ 1 mois, L1000 ≈ 2 ans)

### Jamais publié
- Les poids exacts (25% / 20% / 15%)
- La formule précise (`base = 15`, `D = ...`, `S = ...`)
- La courbe exacte (`50 × L^1.8 × log₂(L+2)`)
- Les seuils de Silent milestones (L1000, L2500, L5000, L10000)
- Les triggers exacts des 12 traits de Lignées
- Les seeds des Rare events
- Les combinaisons de Lignées à L2000 et L5000

### Réaction aux reverse-engineers
La communauté reverse-engineer sur Reddit/Twitter. **On ne confirme ni n'infirme.** On rigole. Un wiki communautaire se construit. C'est le folklore Dark Souls appliqué à un pet dev.

**Gain stratégique** : défensibilité forte (personne ne peut cloner la formule), folklore qui émerge organiquement, culture culte à long-terme.

---

## 12. Les 12 traits de Lignées — candidats (à affiner)

Liste de travail pour la V1.5. Les triggers exacts sont **cachés** (Prop 4), mais les noms et thématiques sont publics.

| # | Trait | Thème dominant (trigger caché) |
|---|---|---|
| 1 | **Architecte** | Sessions structurées, tool diversity élevée, peak context maîtrisé |
| 2 | **Surgeon** | Edit success rate très élevé, sessions chirurgicales |
| 3 | **Cartographer** | Read >> Edit, exploration codebase-heavy |
| 4 | **Alchemist** | Usage MCP lourd, intégrations multiples |
| 5 | **Conductor** | Usage Task/subagents fréquent |
| 6 | **Hermit** | Sessions majoritairement solo, sans subagent |
| 7 | **Gardener** | Sessions incrementales, petites edits fréquentes |
| 8 | **Lighthouse** | Clean-shot ratio très élevé sur la durée |
| 9 | **Scholar** | WebFetch + Grep docs fréquents |
| 10 | **Craftsman** | Sessions longues avec Edit success haut |
| 11 | **Explorer** | Tool diversity maximale |
| 12 | **Pathfinder** | Early adopter (MCP custom, hooks custom, output styles) |

**À affiner** : les 12 noms, leurs mappings précis de triggers, et surtout leur traduction visuelle en sprite 12×12. Pas de deadline : on a 18-24 mois avant le premier L1000 d'un user. Block à la V1.5 (post-launch).

---

## 13. Chantiers à construire pour V1

Au-delà du dataset/pipeline déjà acté dans [docs/09](09-data-collection-et-rapports.md).

| Chantier | Jours dev | Priorité |
|---|---|---|
| Calcul local des 6 signaux + agrégation par session | 1 | Critique J1 |
| Fonction `XP_session(base, Q, D, S)` + courbe `XP_cumulée(L)` | 0.5 | Critique J1 |
| Mapping niveau → #N (fonction multi-variables hash) | 1 | Critique J1 |
| 1000 sprites déterministes numérotés (Q2 roadmap) | 5-10 | Critique — plus gros risque |
| Rare events system (hash date × uuid → déterministe) | 0.5 | Critique J1 |
| Install-aversary detection + Roman numeral badge | 0.25 | J+30 |
| Silent milestones (L1000, L2500, L5000, L10000) — sprite variants | 2 | V1.5 (avant premier L1000 user) |
| 12 traits Lignées — triggers + sprite variants | 5-8 | V1.5 (18-24 mois) |
| Apex compteur + hiscore public | 1 | V2 (pas avant Y3-Y5) |
| Zen XP offline | 2 | V2 |

**Total critique J1** : ~3.5 jours (formule + signaux + mapping + rare events).
**Total V1.5** : ~7-10 jours supplémentaires (milestones + premiers traits Lignées).

---

## 14. Questions ouvertes

- **Liste finale des 12 traits** — validation/remplacement des noms, définition des triggers exacts (mais cachés).
- **Cadence de release des features annuelles** — premier lundi de janvier ? anniversaire du launch Clawkin ? jour de la Dev Conference Anthropic ?
- **Hiscore public Apex** — pseudonymisé (handle seulement) ou avec lien vers page profil ? Activation seuil.
- **Rare events — fréquence cible exacte** — 1 jour sur 200 ou 300 ? À calibrer sur vraie data après launch.
- **Silent milestones — formule pour la variation visuelle** — est-ce un pixel qui change, une couleur qui bascule, une forme qui s'ajoute ? Décision de design à faire en parallèle de la Q2 (générateur sprites).
