# 04 — Roadmap et décisions

> Document vivant. Met à jour l'état des lieux, les prochaines étapes et le journal des grandes décisions. Référence centrale pour rouvrir le projet dans 1 / 2 / 6 semaines sans perdre le fil.

---

## 🎯 Direction actuelle (2026-05-12) — Stratégie fusion Clawkin + Smart Routing

**La direction produit retenue est la stratégie fusion en 3 phases, documentée en [docs/16-merge-strategy.md](16-merge-strategy.md).**

Clawkin n'est pas abandonné. Smart Routing devient l'**âme** du produit (utilité, savings, pricing récurrent 9€/mo). Clawkin reste la **face** (créature, virality, brand). Les deux s'intègrent dans un même produit livré en 3 phases.

### Phases

1. **Phase 1 (sem 0-8)** — Ship Smart Routing pur. Foreman pattern (délégation Haiku via BYOK), dashboard savings, Stripe + money-back. Créature en latence. Cf [docs/14](14-smart-routing.md).
2. **Phase 2 (mois 3-6 post-PMF)** — Réactivation de la créature comme layer visuel des savings. Level reflète discipline tokens, pas activité brute. Free tier rouvert pour la virality.
3. **Phase 3 (mois 9-18)** — Team tier 12€/seat + team totem partagé + cross-IDE (Codex, Cursor).

### Statut

- ✅ Stratégie de fusion verrouillée (cf docs/16)
- ⏳ **Validation 1 semaine en attente** — protocole [docs/15](15-validation-plan-1-week.md) à lancer avant tout build Phase 1
- ⏳ Decision meeting J+8 : 3/3 → ship Phase 1, 2/3 → ajuster, ≤1/3 → retour Clawkin pur

### Documents de référence pour cette direction

| Doc | Rôle |
|---|---|
| [docs/13-pivot-cost-firewall.md](13-pivot-cost-firewall.md) | Origine de la réflexion pivot — référence historique |
| [docs/14-smart-routing.md](14-smart-routing.md) | Spec produit Phase 1 (Foreman pattern, pricing, archi) |
| [docs/15-validation-plan-1-week.md](15-validation-plan-1-week.md) | Protocole de validation avant build |
| [docs/16-merge-strategy.md](16-merge-strategy.md) | **Le doc d'ancrage stratégique** |

### Statut des décisions Clawkin antérieures (docs 00-12)

Les décisions documentées dans `docs/00` à `docs/12` (positionnement awareness, formule progression, emblème statusline, plan 250 silhouettes, etc.) **restent valides comme référence pour Phase 2 et Phase 3**. Elles ne sont pas annulées — elles sont mises en latence pendant Phase 1. Quand on réactive la créature en Phase 2, on s'appuie sur ces docs.

Le reste de ce document `docs/04` ci-dessous reflète l'état Clawkin pur d'avril 2026 et reste utile comme **historique** + base pour Phase 2.

---

## État des lieux (2026-04-21)

**Le projet existe en doc, pas en code.** Session de design stratégique du 21 avril 2026, zéro ligne de produit écrite.

**Repo versionné** : [github.com/edouardtiem/clawkin](https://github.com/edouardtiem/clawkin) — fondation poussée le 2026-04-21 en fin de session 2 (docs + landing + config dev).

**Vercel** : projet à créer le 2026-04-22 par Edouard, branchement sur le repo GitHub pour auto-deploy de la landing (aujourd'hui `landing/v1.11-no-leaderboard/`) sur `clawkin.sh` une fois le domaine pointé.

| Domaine | État |
|---|---|
| Nom + domaine | ✅ Verrouillé — Clawkin + clawkin.sh |
| Positionnement | ✅ Verrouillé — awareness, pas helper |
| Scope V1 | ✅ Verrouillé — lean : CLI Clawkin + badge README |
| Landing page | ✅ Migrée Astro + composants + Vercel Analytics (session 4, 2026-04-27) |
| Architecture technique | ✅ Validée — zéro LLM, déterministe local |
| Business model V1 | ✅ Freemium dès J1 — paid 9$/an débloque identité publique (cf [docs/06](06-freemium-et-plg.md)) |
| Data collection comme asset | ✅ Pivot session 3 — dataset Claude Code agrégé = asset défendable (cf [docs/09](09-data-collection-et-rapports.md)) |
| Formule d'évolution et endgame | ✅ Verrouillée session 3 — 6 signaux, courbe OSRS-like, Lignées + Apex + Zen, cadence annuelle de features (cf [docs/10](10-formule-et-progression.md)) |
| Emblème statusline + surfaces visuelles | ✅ Verrouillé session 4 — emblème `k` lowercase Braille `⡧⡂` fixe en statusline, 250 silhouettes 12×12 réservées au badge GitHub + page profil (cf [docs/11](11-emblemes-et-surfaces.md)) |
| Plan production 250 silhouettes | ✅ Documenté session 4 — distribution 25 × 10 familles, 5 vagues, style guide, mapping pattern→sprite, naming, format SVG (cf [docs/12](12-production-250-silhouettes.md)) |
| Leaderboard | 🔄 Reclassé "optionnel, post-traction" — plus la clé de voûte du paid |
| **Produit réel (CLI)** | ❌ Pas commencé |
| **Générateur sprites (Q2)** | 🟡 wave-01 (30/250) faite — wave-02 à 05 à produire (~3h dont naming) |
| **Formule progression (Q1)** | ❌ Pas entamée |
| Validation externe | ❌ Zéro dev externe consulté |

---

## Décisions actées (avec lien vers le détail)

### Stratégie produit
- **Nom Clawkin + domaine clawkin.sh** — cf [docs/02](02-nom-et-identite.md)
- **Positionnement awareness** (pas helper actif). Le Clawkin ne coache pas, il rend visible. Duolingo-like : la chouette n'apprend pas l'espagnol, elle te fait ouvrir l'app.
- **Scope V1 lean** — pas de leaderboard, pas de monétisation, pas d'OAuth, pas de Stripe au launch. Ship en 2-3 semaines, pas 2-3 mois. Cf [docs/03](03-plg-levers.md)

### Architecture technique
- **Zéro LLM** sur le produit. Tout est déterministe et local. Cf [docs/05](05-architecture-technique.md)
- **Zéro daemon.** Hooks Claude Code + script statusline shell = toute l'infra user side.
- **$9/yr V2 tient** — marge > 98% vu qu'on n'a pas de coût LLM par user.

### PLG V1
- **Badge README GitHub** = levier principal (endpoint `clawkin.sh/u/:handle.svg`)
- **Screenshot statusline** + **évolution visuelle du Clawkin aux paliers** = leviers secondaires
- Cf [docs/03](03-plg-levers.md)

### Modèle freemium V1 (session 2, supersede partiellement docs/03)
- **Règle fondamentale** : le gratuit maximise la distribution, le paid maximise l'identité du user. Free = ambassadeur, paid = citoyen.
- **Gratuit** : Clawkin local complet + badge README standard signé `clawkin.sh` + URL publique anonyme (hash) + cartes de partage avec signature discrète. Bourré de surfaces signées qui circulent passivement.
- **Paid 9$/an** : handle personnalisé (`clawkin.sh/u/edouard`) + page profil publique riche + badge README animé/custom + nom custom du Clawkin + cartes propres.
- **Funnel free → paid dès J1** : réservation gratuite du handle (activation payante sous 60j), upgrade prompts timés à l'achievement (L50, streak 30j), contagion passive via badges en circulation.
- **Leaderboard** : n'est plus la clé de voûte. Réactivable plus tard uniquement si demande communauté forte.
- Détail complet dans [docs/06](06-freemium-et-plg.md).

### Landing page
- Hero 3 lignes awareness ("Lives in your statusline. Grows when you work cleanly. Quietly changes how you work.")
- Clawkin ASCII qui respire dans le hero
- Install bar avec typing animation + copy
- Terminal window mockup (narrate un fresh install L12 · 3d)
- Section Badge (preview + snippet markdown)
- Pact block 2 colonnes sans puces
- Footer minimal
- Fichier : `landing/v1.11-no-leaderboard/index.html`

---

## Prochaines étapes prioritaires (ordre recommandé)

### Phase 1 — Lever les risques techniques (avant de coder le CLI)

1. **Q2 — Générateur de sprites** (le plus gros risque)
   - Proto un générateur qui produit 100 silhouettes 12×12 déterministes, distinctes, jolies
   - Valider qu'on peut scaler à 1000 sans redondance visuelle
   - Règles de composition : silhouette de base + tête + membres + marques + accessoires + palette de variantes
   - Critère de succès : 100 créatures vues en diaporama → toutes reconnaissables, aucune qui "fait pareil qu'une autre"
   - Si bloqué : le produit ne tient pas sa promesse. Mieux vaut le découvrir maintenant.

2. **Q1 — Formule de progression**
   - 2-3h de Python ou tableur
   - Définir X[N] = pellets nécessaires pour atteindre niveau N
   - Simuler 3 profils de devs sur 30 / 90 / 180 / 365 jours :
     - Dev efficace faible volume
     - Dev moyen régulier
     - Dev gros volume brouillon
   - Vérifier : L50 ≈ 1 mois (moyen régulier), L250 ≈ 6 mois, L1000 ≈ 18-24 mois
   - Vérifier : le bon profil gagne à chaque horizon
   - Ajuster cap journalier + multiplicateur qualité en conséquence

### Phase 2 — Construire la V1 produit

3. **CLI Clawkin**
   - Script shell `~/.claude/hooks/clawkin.sh` branché sur les 7 hooks lifecycle
   - Script `~/.claude/statusline.sh` lit `~/.config/clawkin/state.json` et imprime `{sprite} L{level} · {streak}d`
   - Installer `curl -sL clawkin.sh | sh` qui ajoute les entrées à `~/.zshrc` et `~/.claude/settings.json`
   - Uninstaller symétrique
   - Testé sur zsh + bash + fish (au moins zsh + bash au launch)

4. **Badge endpoint + page profil**
   - Service stateless qui reçoit un push d'état depuis le CLI (ex: 1×/jour ou à chaque level-up)
   - Sert deux surfaces : le SVG badge (free/premium) et la page HTML profil (paid uniquement)
   - Routes : `clawkin.sh/c/:hash.svg` (free, anonyme), `clawkin.sh/u/:handle.svg` + `clawkin.sh/u/:handle` (paid, handle claimed)
   - Vercel edge function + KV (Upstash gratuit)

5. **Infra paid V1 (nouveau — cf [docs/06](06-freemium-et-plg.md))**
   - GitHub OAuth pour claim du handle (évite l'usurpation)
   - Stripe checkout + webhooks renouvellement 9$/an
   - Système de réservation de handle avec grace period 60j
   - ~1 semaine de dev solo supplémentaire, compatible avec la fenêtre 2-3 semaines

6. **Landing déployée**
   - ✅ Migration vers Astro (session 4, 2026-04-27) — composants extraits, Vercel Analytics intégré, dev server `npm run dev`
   - Déploiement Vercel sur clawkin.sh (auto-détecté depuis le push)
   - Connexion install script `clawkin.sh/install` → GitHub raw

### Phase 3 — Validation avant launch public

7. **Montrer à 2-3 devs Claude Code proches**
   - Avant même d'avoir le CLI complet, montrer v1.11 + parler du concept + pitcher le paid 9$/an
   - Récupérer feedback sur : lisibilité, intérêt réel, missing pieces, willingness-to-pay
   - Ne pas launch avant d'avoir ce signal

8. **Build-in-public dès le CLI fonctionnel**
   - Premier tweet = premier Clawkin visible dans la statusline
   - Flip GitHub repo public au même moment
   - Thread qui explique la genèse + la philosophie awareness + le modèle freemium

---

## Backlog post-launch (V2 et au-delà)

- **Tier Équipe** 5-7$/dev/mois — post-10k installs Solo Dev (brief §10, inchangé)
- **Leaderboard mondial + local** — reclassé "optionnel". Réactivable uniquement si demande communauté forte ou signal explicite (Discord, tickets répétés). N'est plus la clé de voûte du paid. Cf [docs/06 section 2](06-freemium-et-plg.md) et [docs/03](03-plg-levers.md).
- **Premier découvreur viral hook** — dépend du leaderboard, donc reclassé avec lui
- **Weekly recap email** — "your clawkin this week"
- **API / open data** — pour que la communauté build des widgets
- **Pattern leaderboards locaux par quartier/ville/pays** — cf [docs/01](01-leaderboards-nouveaux-vs-veterans.md), idem dépend du leaderboard
- **Founding supporter tier** (session 2, à tester) — tier early à 20$/an la première année pour les supporters des premiers jours

---

## Questions ouvertes (brief §14)

- **Q1** — Formule mathématique de progression → à traiter Phase 1
- **Q2** — Générateur de silhouettes → à traiter Phase 1 (risque principal)
- **Q3** — Nom + landing + pitch → ✅ résolu ([docs/02](02-nom-et-identite.md), landing v1.11)

Questions nouvelles qui ont émergé en session 1 :
- **Leaderboards nouveaux vs vétérans** → différée V2 ([docs/01](01-leaderboards-nouveaux-vs-veterans.md))
- **Architecture LLM ou pas** → ✅ résolue — zéro LLM ([docs/05](05-architecture-technique.md))

Questions nouvelles qui ont émergé en session 2 (cf [docs/06 section 12](06-freemium-et-plg.md)) :
- **Grace period précise du handle réservé** — 60j par défaut, à calibrer selon taux de conversion observé
- **Pricing alternatif à tester** — 9$/an acté, mais 12$/an et founding supporter 20$/an restent à explorer avant le launch
- **Périmètre exact de la page profil publique** — quelles stats afficher sans glisser vers un dashboard analytics

---

## Journal des grandes évolutions

### Session 5 — 2026-05-12 (pivot stratégique → fusion Clawkin + Smart Routing)

1. **Constat de départ** : note de réflexion d'Edouard sur un potentiel pivot depuis Clawkin (créature awareness) vers un *"Claude Cost Firewall"* — produit qui bloque le dépassement de quota avec un hard cap local + push notif. Documenté dans [docs/13](13-pivot-cost-firewall.md).
2. **Itération sur le concept** : challenge du Cost Firewall pur — *"trois hooks + une notif = un script, pas un SaaS"*. Exploration de plusieurs adjacents : Agent Watchdog, Verification layer, Audit ledger, Loom for Claude Code (session replay), Cost Attribution freelance, Context Janitor.
3. **Convergence sur Smart Routing** : la seule option qui coche les 5 cases (pain viscérale + WTP claire + asymétrie Anthropic + simple-buildable + différenciation forte). Foreman pattern : déléguer le grunt work (large reads, bash bloat, audit tasks) à un worker Haiku via BYOK, le main thread Sonnet/Opus reste clean. Doc spec : [docs/14](14-smart-routing.md).
4. **Pricing verrouillé** : flat 9€/mo + dashboard transparent + **money-back automatique** si savings < 2× subscription dans le mois. Marketing claim : *"Pay $9, save $40+, or it's free."*
5. **Stress test des projections** : marché réel plus étroit qu'estimé initialement (Pro/Max users majoritaires ≠ API heavy users), ARPU réaliste ~7-8€ blended, plafond solo Y3 ~30-80k€ MRR. Risques principaux : Anthropic auto-trigger Task tool (50-60% à 18m), économies réelles < 20% en moyenne, qualité Haiku perçue.
6. **Plan de validation 1 semaine** designé pour stop-or-go data-driven avant 6-10 sem de build : H1 patterns réels (parser JSONL), H2 50+ pre-orders Stripe (landing live), H3 audit roadmap Anthropic. Budget ~30€. Doc : [docs/15](15-validation-plan-1-week.md).
7. **Décision majeure — stratégie fusion** : ne PAS abandonner Clawkin. Fusionner les deux produits en 3 phases. Phase 1 ship Smart Routing pur (savings = pricing récurrent), Phase 2 réactive la créature comme layer visuel des savings ("level 247 = $2,400 saved" plutôt que "89 jours actifs"), Phase 3 team tier + cross-IDE. Tous les assets Clawkin (sprites, emblems, brand, docs 00-12) sont gardés en latence pour Phase 2-3. Rien à jeter. Doc d'ancrage : [docs/16](16-merge-strategy.md).
8. **Action externe attendue d'Edouard** : lancer la semaine de validation lundi prochain selon [docs/15](15-validation-plan-1-week.md). Decision meeting J+8 pour acter Phase 1 ou retour Clawkin pur.

**Artefacts livrés en session 5** :
- `docs/13-pivot-cost-firewall.md` — note de réflexion initiale (historique)
- `docs/14-smart-routing.md` — spec produit Phase 1
- `docs/15-validation-plan-1-week.md` — protocole validation pré-build
- `docs/16-merge-strategy.md` — **stratégie d'ancrage 3 phases**
- Update `docs/04-roadmap-et-decisions.md` — bloc "Direction actuelle" en haut + ce journal

**Phrase d'ancrage** :
> *Phase 1 prouve qu'on peut faire payer. Phase 2 prouve qu'on peut faire aimer. Phase 3 prouve qu'on peut faire scaler.*

### Session 4 — 2026-04-27 (migration landing en code, première session prod)

1. **Décision techno landing** : challenge sur Next.js, choix d'**Astro** comme meilleur fit (build statique, ship 0 JS par défaut, composants framework-agnostic, anti-overhead). Next reclassé "framework app, pas landing" — anti "IT-proof".
2. **Migration `index.html` (550L) → projet Astro** :
   - `BaseLayout.astro` : head, fonts, styles globaux, injection Vercel Analytics
   - 7 composants extraits dans `src/components/` : Nav, Hero, InstallBar, DemoWindow, Badge, Pact, SiteFooter
   - Script de typing/reveal extrait dans `src/scripts/landing.js`, bundlé via Astro
   - `index.astro` final = 22 lignes (composants + import script)
3. **Vercel Analytics intégré** via `@vercel/analytics` v2 + `inject()` dans le layout. Vérifié `window.va` chargée en preview.
4. **Config dev server mise à jour** : `.claude/launch.json` passe de `npx serve landing` à `npm run dev` (Astro dev server port 3000). Build vérifié, preview vérifiée (typing + reveals + analytics OK).
5. **Trigger de migration anticipé** : prévu Phase 2 #6 (post-CLI) dans roadmap initiale, advancé en session 4 pour préparer le terrain composants avant d'itérer sur design/animations futures.

**Artefacts livrés en session 4** :
- `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, 7 composants `src/components/*.astro`
- `src/scripts/landing.js` — script extrait de l'inline
- `astro.config.mjs`, `tsconfig.json`, scripts npm `dev`/`build`/`preview`
- `package.json` + `package-lock.json` (astro, @vercel/analytics)
- Suppression de `index.html` racine (remplacé par build Astro vers `dist/`)
- Update `.gitignore` (dist/, .astro/) et `.claude/launch.json`

**Commit** : `d0c311e — landing: migre vers Astro + ajoute Vercel Analytics` (push sur main).

**Prochain sujet à traiter** :
- Vérifier que Vercel auto-détecte bien Astro au prochain deploy (sinon : Framework Preset → Astro dans settings)
- Reprise des chantiers V1 produit (Phase 1 risques techniques, ou Q1 formule progression)

### Session 1 — 2026-04-21 (design stratégique, 0 code)

1. **Import du brief** dans `docs/00-brief-base.md`, création du dossier `docs/`
2. **Brainstorm "nouveau vs vétéran"** dans le leaderboard ([docs/01](01-leaderboards-nouveaux-vs-veterans.md))
3. **Décision nom** : Clawkin (après rejet de Clawde pour risque trademark Anthropic — précédent Codeium qui s'est fait taper sur "Clawd Code")
4. **Décision domaine** : `clawkin.sh` pour la rime avec l'install `curl -sL clawkin.sh | sh`
5. **Landing v1 / v2 / v3** (3 directions : man page, amber CRT, Vercel-like) → Edouard choisit la v1
6. **Itérations v1.5 → v1.11** :
   - v1.5 : ajout nav + window mockup + install bar avec copy
   - v1.6 : fusion hero NAME+SYNOPSIS + labels latéraux (choix B+C du brainstorm)
   - v1.7 : tagline value-prop (awareness frame), leaderboard ajouté, deal 2 colonnes
   - v1.8 : Clawkin ASCII qui respire + window mockup remonté
   - v1.9 : undiscovered rows + signal de prix + L250→L12 + deal sans puces
   - v1.10 : polish ($9/yr phrasing + footer nettoyé)
   - v1.11 : **retrait complet du leaderboard + section badge ajoutée**
7. **Pivot stratégique majeur** : leaderboard différé à V2, badge README devient PLG principal
8. **Architecture technique** : confirmation que le produit tourne sans LLM

**Artefacts livrés** :
- `docs/00-brief-base.md` — source de vérité du concept
- `docs/01-leaderboards-nouveaux-vs-veterans.md` — brainstorm différé V2
- `docs/02-nom-et-identite.md` — nom verrouillé
- `docs/03-plg-levers.md` — stratégie PLG V1/V2
- `docs/04-roadmap-et-decisions.md` — ce document
- `docs/05-architecture-technique.md` — comment ça marche sans LLM
- `landing/v1-pure-terminal/` → `landing/v1.11-no-leaderboard/` — 11 itérations de landing
- `landing/v2-amber-crt/`, `landing/v3-modern-dev/` — directions alternatives
- `.claude/launch.json` — config dev server (`npx serve landing`)

### Session 4 — 2026-04-27 (emblème statusline + séparation surfaces visuelles, 0 sprite final mais design verrouillé)

1. **Migration landing v1.11 vers Astro** + composants extraits + Vercel Analytics intégré (commit `d0c311e`). Dev server `npm run dev` port 3000.
2. **Production proto-01** : 10 silhouettes test 12×12 half-blocks (Mole, Imp, Moth, Coil, Slime, Krys, Jelly, Beetle, Ram, Mush). Validation visuelle de la direction esthétique par Edouard.
3. **Test de la règle d'évolution 5 stages par accrétion de pixels** sur Mole + Imp. Stages 1-3-5 distincts visuellement, stages 2-4 trop subtils mais acceptable pour V1 launch (option A).
4. **Production wave-01** : 30 silhouettes (10 originales + 20 nouvelles couvrant 10 familles : quadrupède, bipède, volant, rampant, amorphe, géométrique, marin, insectoïde, cornu, totem). Préparation pour 250 par vagues de 50.
5. **Test critique en condition réelle** : activation du test-statusline.sh dans Claude Code via `~/.claude/settings.json`. Verdict d'Edouard sur le 12×12 6-lignes : "trop gros, inacceptable pour un dev". Pivot forcé.
6. **9 itérations de format** testées en condition réelle terminal : half-blocks 6→4→2 lignes, full-blocks 4×2, Braille 4×4 1 ligne, couleurs ambre/vert/cyan/magenta toutes rejetées, position droite/gauche, K1/K3.
7. **Découverte clé** : la statusline et le badge GitHub sont **deux surfaces distinctes avec deux fonctions distinctes**. Statusline = branding (1 emblème fixe), badge = identité publique (250 silhouettes différenciées). C'est plus cohérent, et résout le tradeoff "always visible" vs "non intrusif".
8. **Génération de la galerie d'emblèmes** : 13 candidats au total (3 K-direct-branding + 3 originaux Pawprint/Watcher/Claw + 10 wave 2 propositions originales). Deep research parallèle sur les icônes dev iconiques 1975-2025 pour valider les références.
9. **Choix final emblème** : `k` lowercase Braille = `⡧⡂`. Wordplay direct sur Claw**K**in. Aucun outil dev majeur n'utilise son initiale stylisée. Lowercase pour la cohérence culture CLI (`git`, `npm`, `cargo`, `go`).
10. **Format statusline final verrouillé** : 1 ligne unique, sprite à gauche, couleur native du terminal user, info en gris dim : `⡧⡂ #001 Mole · L247 · 12w · 35% ctx`.
11. **Implication produit** : les Silent milestones (sprites qui changent aux paliers L1000/2500/5000/10000) s'appliquent désormais au **badge GitHub** uniquement, pas à la statusline. Le k reste l'identité Clawkin permanente.

**Artefacts livrés en session 4** :
- `docs/11-emblemes-et-surfaces.md` — nouveau document, formalise le pivot et les deux surfaces
- Update `docs/04-roadmap-et-decisions.md` — ce document
- Update memory `project_pet_terminal.md` avec le pivot session 4
- `sprites/proto-01/` — 10 silhouettes proto + test stages
- `sprites/wave-01/` — 30 silhouettes (10 originales + 20 nouvelles)
- `sprites/emblems/` — 13 candidats emblème statusline
- `sprites/test-statusline.sh` — script statusline avec emblème k final
- Migration landing Astro + Vercel Analytics (commit `d0c311e`)

**À retenir pour les prochaines sessions** :
- Statusline = `⡧⡂` (k lowercase Braille). Jamais changeant. Couleur native terminal.
- Les 250 silhouettes 12×12 sont pour le badge/profil/cartes uniquement.
- Le test en condition réelle est obligatoire avant tout lock de design (9 itérations sinon).

### Session 3 — 2026-04-23 (data comme asset stratégique, 0 code)

1. **Décision ship landing v1.11 en prod** via Vercel une fois le projet branché sur le repo (action parallèle d'Edouard).
2. **Pivot data collection** : challenge du scope tracking docs/07 — jusqu'ici pensé comme outil de décision produit interne. Reframe comme **asset stratégique défendable** (SEO, trust, valeur rachat). Le code Clawkin se clone en 2-3 semaines, un dataset 12 mois d'usage Claude Code agrégé ne se clone pas.
3. **Identification du playbook éprouvé** : Stack Overflow Developer Survey, GitHub Octoverse, JetBrains Developer Ecosystem, Datadog State of DevOps, Vercel State of Frontend — "State of X" quarterly = SEO + crédibilité + intérêt M&A démontrable.
4. **Conception de la pipeline "local aggregation, scalar upload"** : le CLI voit tout en local (hooks + JSON statusline), agrège on-device, n'upload que scalaires/histogrammes quotidiens. Zéro capacité de ré-identification depuis les données uploadées, red lines privacy intactes.
5. **Résolution des 3 questions techniques ouvertes** :
   - UUID anonyme free user → stocké dans `~/.config/clawkin/uuid` séparé du state volatile. Persiste aux réinstalls tant que config dir non wipé. Bruit résiduel (3-7%/an) accepté.
   - Event upgrade_prompt_shown → buffer local `events.jsonl` + flush quotidien via même endpoint que daily_ping. Un seul appel réseau/user/jour. Résilient au offline.
   - `/state` public → pas au launch. Activation à 500 installs (signal de traction crédible, avant c'est contre-productif).
6. **Design du rapport "State of Claude Code"** trimestriel : headlines testables, JSON dataset public, format synthèse multi-canal (web + JSON + thread + HN + presse dev).
7. **Anticipation Anthropic** : 3 scénarios (acquisition, partnership/TOS, blocage API) + mitigations. Communication proactive avant premier rapport public.
8. **Chantiers V1 révisés** : ~10 jours solo (vs 5-6 initial docs/07) pour intégrer pipeline data publishable. Compatible fenêtre 2-3 semaines si buffer local démarre J1 + dashboard admin peut attendre M+1.

**Artefacts livrés en session 3** :
- `docs/09-data-collection-et-rapports.md` — nouveau document stratégique, supersede partiellement docs/07 sur l'ambition
- Update `docs/07-metrics-et-tracking.md` — pointeur vers docs/09 en intro, red lines conservées
- Update `docs/04-roadmap-et-decisions.md` — ce document
- Commit préalable de `docs/07` et `docs/08` (manquaient du push session 2)

**Actions externes en cours par Edouard** :
- Finalisation Vercel (démarrée session 2, en cours)
- Domaine `clawkin.sh` à pointer
- Ship landing v1.11 en prod dès Vercel prêt

---

### Addendum session 3 (même journée) — Game design et formule de progression

9. **Questionnement du système d'évolution** par Edouard : l'idée initiale (Pattern A seul = numéro 1-1000 linéaire) est identifiée comme trop plate pour un public dev senior. Recherche deep gamification lancée.
10. **Synthèse gaming patterns** : identification de 8 patterns transversaux depuis Pokémon, Tamagotchi, Dark Souls, OSRS, Nier, Hollow Knight, EVE. Recommandation : combiner Pattern A (Pokédex partagé) + C (Shiny déterministe) + E (Opacité révélée, ex-Prop 4).
11. **Intégration Prop 4 en V1** : distinction faite entre **concept communiqué** (les 6 signaux sont nommés publiquement) et **règles cachées** (poids, courbe, seuils, triggers jamais publiés). Dark Souls vibe, défensibilité forte.
12. **Design formule par 3 experts en parallèle** : Claude Code hooks (signaux disponibles), game designer (courbe + endgame), psy rétention (long-terme top users). Synthèse verrouillée dans [docs/10](10-formule-et-progression.md).
13. **Décisions Edouard sur la formule** :
    - Décision 1 : cap diminishing daily returns fixé à **5 sessions/jour** (vs 3-4 initial).
    - Décision 2 : **cadence annuelle de content** — chaque année, une nouvelle feature visuelle à un nouveau palier de 1K niveaux, apparaissant directement sur le Clawkin. Premier L1000 user attendu à 18-24 mois, donc traits Lignées à livrer en V1.5.
    - Décision 3 : Annual Report verrouillé — **templates + variables + règles déterministes**, zéro LLM. URL anonyme free `clawkin.sh/c/{hash}/{year}` + URL handle paid `clawkin.sh/u/{handle}/{year}`, même richesse de contenu. Notification via CLI banner silencieux uniquement, jamais d'email. Rendu on-demand cached. Coût 0€ sur Vercel free tier jusqu'à 100K+ users. Spec complète dans [docs/10 §9.1](10-formule-et-progression.md#section-91).

**Artefacts livrés en addendum session 3** :
- `docs/10-formule-et-progression.md` — nouveau document, verrouille formule XP + courbe + endgame + rétention + warning list + 12 traits Lignées candidats
- Update `docs/04-roadmap-et-decisions.md` — ajout ligne formule dans état des lieux + ce journal

**Prochain sujet à traiter** : décision 3 (génération Annual Report sans IA, scalable), puis Q2 sprites generator (plus gros risque technique du projet).

### Session 2 — 2026-04-21 (stratégie business & PLG, 0 code)

1. **Estimation croissance réaliste** sur 12 mois : médiane ~5k installs à M+6, ~12k à M+12, en scénario baseline (ship propre, launch HN + /r/ClaudeAI + Twitter, pas de pic viral planifiable).
2. **Challenge du scénario "paid adossé au leaderboard V2"** : sans leaderboard au launch, rien à vendre à 9$/an ; le doc 03 laissait la monétisation orpheline pendant 6 mois.
3. **Challenge plus profond du leaderboard lui-même** : 2-3 mois de dev backend, responsabilité d'hébergement à perpétuité, bénéfices remplaçables par la contagion badge passive.
4. **Décision : leaderboard reclassé "optionnel, post-traction"**, n'est plus la clé de voûte.
5. **Challenge du gratuit tel que défini** : ne pousse pas au partage, zéro moteur PLG passif.
6. **Framing des deux paths clarifié** : free maximise la distribution de la marque, paid maximise l'identité du user. Free = ambassadeur, paid = citoyen.
7. **Killer feature paid retenue** : handle personnalisé + page profil publique + badge README premium + nom custom du Clawkin, à 9$/an en un seul tier.
8. **Funnel free → paid designé dès J1** : réservation gratuite du handle avec grace period 60j, upgrade prompts timés à l'achievement (L50, streak 30j), contagion passive par badges en circulation.
9. **Chiffres de conversion révisés à 2-4%** (vs 0,5-1% pour du tipping sans feature gate) → ARR M+12 projeté 1 400-7 200$ au lieu de 360-1 800$.

**Artefacts livrés en session 2** :
- `docs/06-freemium-et-plg.md` — nouveau document dédié, supersede partiellement docs/03 et brief §10
- Update `docs/04-roadmap-et-decisions.md` — état des lieux, décisions actées, Phase 2 enrichie (Stripe + OAuth), backlog recentré, journal
- **Versioning** : init Git + push fondation sur [github.com/edouardtiem/clawkin](https://github.com/edouardtiem/clawkin) (branche `main`, repo public)
- `.gitignore` — exclut `.claude/settings.local.json` (permissions Claude Code locales d'Edouard), `.DS_Store`, `node_modules/`, `.vercel/`

**Actions externes planifiées au 2026-04-22 (Edouard)** :
- Création du projet Vercel branché sur le repo GitHub
- Configuration du build `landing/v1.11-no-leaderboard/` comme root de déploiement
- Domaine `clawkin.sh` à pointer vers Vercel une fois le projet créé
