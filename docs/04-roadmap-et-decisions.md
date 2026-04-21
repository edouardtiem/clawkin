# 04 — Roadmap et décisions

> Document vivant. Met à jour l'état des lieux, les prochaines étapes et le journal des grandes décisions. Référence centrale pour rouvrir le projet dans 1 / 2 / 6 semaines sans perdre le fil.

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
| Landing page | ✅ Prête à ship — v1.11 finale |
| Architecture technique | ✅ Validée — zéro LLM, déterministe local |
| Business model V1 | ✅ Freemium dès J1 — paid 9$/an débloque identité publique (cf [docs/06](06-freemium-et-plg.md)) |
| Leaderboard | 🔄 Reclassé "optionnel, post-traction" — plus la clé de voûte du paid |
| **Produit réel (CLI)** | ❌ Pas commencé |
| **Générateur sprites (Q2)** | ❌ Pas entamé — plus gros risque technique |
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
   - Migration de `landing/v1.11` vers un projet Astro (idéalement) ou Next.js
   - Déploiement Vercel sur clawkin.sh
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
