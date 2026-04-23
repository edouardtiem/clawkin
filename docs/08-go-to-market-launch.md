# 08 — Go-to-market et launch strategy

> Décision actée 2026-04-21 (session 2, après recalibrage marché et pivots multiples). Document stratégique pour le launch public : marché réel, projections, canaux, positionnement install vs valeur, pivot B2B, pre-launch prep. À relire 2 semaines avant le launch.

---

## 1. Marché réel — chiffres validés par recherche (avril 2026)

Section à rafraîchir trimestriellement car la croissance Claude Code est exponentielle.

### Claude Code — métriques Anthropic

- **1,6M WAU début 2026**, doublement depuis le 1er janvier → **2-3M+ WAU à avril 2026**, probable 4-6M+ à fin 2026 si la courbe continue
- **$2,5B de revenus annualisés** — produit dev le plus rentable de tous les temps en vitesse de ramp
- **6× de croissance entre avril 2025 et janvier 2026**
- **$1B ARR atteint en 7 mois** après le launch (mai 2025 → novembre 2025) — record historique enterprise software

### Adoption chez les devs pro

- **18% des devs pro l'utilisent en janvier 2026** (JetBrains AI Pulse Survey) — up from 3% mi-2025, 12% septembre 2025
- Awareness : **31% → 49% → 57%** entre avril 2025 et janvier 2026
- **46% des devs senior** le nomment "most loved" (vs Cursor 19%, Copilot 9%)
- Tied avec Cursor à 18% d'adoption workplace, derrière Copilot à 29%
- Coding tasks = **34% de l'usage total de Claude** (plus grande catégorie)

### Adoption enterprise

- **70% du Fortune 100** utilise Claude
- **8/10 du Fortune 10**
- **300 000+ clients business** chez Anthropic
- Les clients dépensant >$100k/an ont **× 7** en une année

### Implication pour la willingness-to-pay

Les devs Clawkin paient déjà Anthropic (budget Claude Code souvent plusieurs centaines de $/dev/mois en entreprise). Ajouter 9$/an au Solo Dev ou 3€/dev/mois au Team = marginal, en dessous du seuil de perception. **La contrainte prix n'est pas un blocker.**

---

## 2. Marché adressable pour Clawkin

### Segmentation sur 2,5M Claude Code WAU (avril 2026, conservateur)

| Segment | % base | Volume | Comportement attendu |
|---|---|---|---|
| Enthousiastes terminal customization | 5-10% | 125-250k | Install direct si exposés au produit |
| Installeront si exposés (badge vu, screenshot, bouche-à-oreille) | 25-35% | 625-875k | Install progressif sur 6-18 mois |
| Ignoreront ou résisteront (pragmatiques, anti-cute, locked-down) | 40-55% | 1M-1,4M | Jamais |
| Détesteront activement | 3-8% | 75-200k | Génèrent bruit (parfois positif au net) |

**Marché réellement adressable sur 18 mois : 750k-1,2M devs potentiels.**

### Segmentation sur 5M WAU (fin 2026, projection base-case)

Même pourcentages, volume × 2. **Marché adressable fin 2026 : 1,5M-2,5M.**

### Part réaliste à capter

Les dev tools indie atteignent généralement 0,5-5% de leur marché adressable sur 12-18 mois avec exécution correcte. Pour Clawkin :

- **Conservative (1% à M+18)** : 10-25k installs
- **Médiane (2-3%)** : 20-75k installs
- **Upside (5%)** : 50-125k installs

---

## 3. Projections révisées (intègre marché + B2B à 1-2k + contraintes Edouard)

Contraintes : zéro network dev au départ, faceless mode, solo.

| Scénario | Proba | Installs M+12 | B2B teams | ARR M+12 |
|---|---|---|---|---|
| A — soft launch, organique linéaire | 40% | 20-60k | 30-100 | **60-180k€** |
| B — breakout launch (HN front page ou viral tweet) | 15-20% | 150-400k | 300-1,2k | **600k-3M€** |
| C — anémique (ratés HN+PH+Reddit successifs) | 25-30% | 8-25k | 10-40 | **30-120k€** |
| D — échec (Anthropic ship concurrent, hook API casse, 0 traction) | 10-15% | <1k | 0-3 | <10k€ |

**Médiane pondérée M+12 : ~80-150k€ ARR.** Avec croissance linéaire continue en M+12 → M+24.

**La cible brief 5-10k€/mois (60-120k€/an) n'est plus un optimistic case — elle est l'outcome le plus probable du Scénario A médian.** Elle devient le *minimum viable success* plutôt que le ceiling.

---

## 4. Positionnement install vs valeur — l'insight critique

### Le piège à éviter

Pitch à ne PAS faire sur la landing, les tweets, les posts : *"Clawkin t'aide à mieux utiliser Claude Code"*.

Raison : la plupart des devs ne s'identifient pas comme "ayant besoin d'amélioration". Même ceux dont l'hygiène est objectivement mauvaise pensent "je fais comme il faut, merci". **Framing self-improvement = conversion basse.**

### Le pattern Strava / Duolingo

- Strava ne vend pas "deviens meilleur coureur". Il vend "track tes runs + compare-toi". L'amélioration est ce qui se passe, pas ce qui est vendu.
- Duolingo ne vend pas "apprends l'espagnol". Il vend "la chouette, la streak, tes potes". Apprendre est l'effet.

Clawkin doit suivre : **vendre l'existence du Clawkin (délice, identité, tribu), livrer l'hygiène comme conséquence passive.**

### Les 4 vraies raisons pour lesquelles les devs installeront

1. **Délice / décoration** (plus gros driver). Genre éprouvé depuis 30+ ans : oneko, cowsay, bongocat, Starship, oh-my-zsh. Les devs adorent les petits trucs mignons dans leur terminal.
2. **Identité tribale.** "J'ai un Clawkin" = signe d'appartenance, comme "j'utilise Neovim" ou "mes dotfiles sont sur GitHub". Le badge README rend ce signal visible publiquement.
3. **Curiosité.** Screenshot ou badge vu → landing → install en une commande. Zéro friction.
4. **FOMO / contagion.** À partir de ~5-10% de pénétration dans la communauté, les autres regardent pour ne pas rester derrière.

### Où l'angle "hygiène" MARCHE quand même

- **Segment des devs déjà conscients de leur problème** (~15-25% de la base) : ont déjà blown-up des contextes, vu leur facture API, senti PreCompact comme une défaite. Pour eux, Clawkin est "je te rends visible ce que tu ignorais". Fort taux de conversion.
- **Entreprises avec token-burn dashboard existant** : pitch B2B (cf §6) devient killer parce que Clawkin reframe positivement un levier déjà en place.

### La landing v1.11 fait ça bien — ne la casse pas

Tagline actuelle : *"Lives in your statusline. Grows when you work cleanly. Quietly changes how you work."*

- Ligne 1 = existence (délice, identité) → vend l'install
- Ligne 2 = mécanisme → intrigue
- Ligne 3 = conséquence → *quietly changes*, pas *makes you better*

Le dev conclut lui-même qu'il va s'améliorer. On ne le promet pas, on le suggère.

**Règle d'or du build-in-public** : tweete *"meet clawkin, your terminal pet"* ou *"your clawkin just hit L50"*, jamais *"Clawkin makes you better at Claude Code"*.

---

## 5. Les contraintes Edouard — zéro network + faceless

Ces deux contraintes changent la stratégie d'acquisition.

### Zéro network dev au départ
- Pas de boost organique day 1. Pas de "Edouard recommends it" effect.
- Entièrement dépendant des canaux gratuits (HN, PH, Reddit, X) + du produit lui-même pour la rétention/contagion.
- **Doit construire une audience @clawkin AVANT le launch public** : viser 500-1000 followers dev en 3-4 semaines de pre-launch build-in-public.

### Faceless mode (pas de visage d'Edouard)
- Le personnage c'est `@clawkin`, pas Edouard. Le produit parle pour lui.
- **Compatible** avec le positionnement awareness (pas d'ego, juste le produit).
- **Compatible** avec un large pan des dev tools indie (Midjourney semi-anon au début, plein de CLIs anonymes).
- **Contrainte B2B** : certains CTOs veulent connaître le fondateur avant de payer. Compensé par (a) github propre public, (b) doc impeccable, (c) alias pro plausible pour les échanges directs, (d) témoignages clients early dès qu'on en a.

### Compensations à construire dès maintenant (dans le scope V1 build)

1. **Compte `@clawkin` sur X et Bluesky** — démarre à 0, vise 500-1k followers avant launch day. Cadence : 2-3 tweets/semaine honnêtes, milestones produit + insights build-in-public. Ne jamais forcer, ne jamais teaser un truc qu'on ne livre pas.

2. **Content SEO sur clawkin.sh/blog** — 3-4 posts techniques qui vivent en permanence et attirent du trafic Google :
   - *"How Claude Code lifecycle hooks actually work"*
   - *"Why your team's token-burn dashboard is making engineers worse"*
   - *"Building a deterministic sprite generator for 10,000 creatures"* (post-Q2)
   - *"What 1000 Claude Code sessions taught me about context hygiene"*
   Les devs googlent ces sujets. Chaque post est un hameçon durable.

3. **Submit à awesome-lists** : `awesome-claude-code`, `awesome-cli`, `awesome-terminal-toys`, `awesome-dotfiles`. Exposition durable + backlinks indexés.

4. **Cold email DevRel Anthropic** — une fois le CLI fonctionnel. Objectif : être sur leur radar. Une mention dans une newsletter Claude Code = 5-20k visites. Script court, orienté valeur, pas demande de promo.

5. **Seed users 10-20** — une fois le CLI qui tourne, recruter 10-20 devs sur Twitter / Reddit / Discord Anthropic. Leur donner accès tôt, écouter leurs retours, les transformer en ambassadeurs early. Ces 10-20 = ta tribu de base avant le launch public.

6. **GitHub repo propre** avant le launch public. README soigné, license MIT ou BSD-3, CONTRIBUTING.md clair, code lisible. Premier vecteur de crédibilité pour un projet faceless.

---

## 6. Le pivot B2B à 1-2k users — pitch et exécution

### Activation

Le tier Équipe du brief §10 (5-7$/dev/mois) est avancé de "post-10k installs" à **"dès 1-2k users"**. Justifié par les chiffres Claude Code — willingness-to-pay enterprise très élevée, budget déjà alloué.

### Pricing V1 B2B

**3€/dev/mois** (aligné avec la proposition Edouard). Dans la zone "impulse buy" pour un CTO avec team de 10-30 devs. Budget infra, pas budget SaaS.

### Angle A — principal commercial

**"L'alternative humaine au token-burn dashboard."**

Contexte : beaucoup de boîtes avec 20+ devs Claude Code installent déjà des dashboards "qui brûle combien de tokens". Ces dashboards créent de l'anxiété, poussent à la sous-utilisation, backfire. Les devs over-optimisent pour "ne pas dépenser" plutôt que pour "faire du bon boulot".

Pitch 30 secondes au CTO :
> *"Vos devs ont un dashboard qui les classe par dépense tokens. Ça les rend plus prudents, pas meilleurs. Clawkin remplace ça par un indicateur d'hygiène — contexte bien géré, sessions propres, régularité. Vos devs voient la même info, mais reformulée positivement : ratio qualité/coût au lieu de coût brut. 3€/dev/mois, auto-serve, 2 fichiers à éditer par dev. Pas de nouveau outil à maintenir."*

### Angle B — renfort narratif

**"Le contribution graph pour le dev AI-assisté."**

GitHub contribution graphs sont critiqués depuis des années (mesurent le volume, biais contre architecture/revues, mauvaise proxy pour la perf dev). Clawkin mesure l'hygiène au lieu du volume.

Angle plus long à vendre mais défendable comme "l'outil qui reconnaît la qualité du dev à l'ère Claude Code".

### Go-to-market B2B

Bottoms-up, pas top-down :
1. Un dev dans la team installe Clawkin à titre personnel
2. Il en parle en pair prog / screen share, les collègues voient le pet
3. Un ou deux autres devs installent
4. Le tech lead ou CTO remarque → installe le dashboard équipe (3€/dev/mois, auto-serve)
5. Roll-out interne organique, pas de sales call

**Aucun sales pipeline, aucun appel découverte.** Compatible avec les critères durs d'Edouard (pas d'appels commerciaux).

### Auto-serve dashboard équipe — features V1

- Liste des devs de l'équipe avec leur Clawkin actuel + level + streak
- Indicateur d'hygiène agrégé équipe (moyenne, distribution)
- Comparaisons inter-équipes dans la même boîte (si plusieurs teams)
- **PAS** d'analytics individuelles (contradictoire avec "pas de tracking individuel")
- **PAS** de notifications Slack (garder le respect du focus dev)
- Checkout Stripe standard, pas de customer portal custom

Estimation dev : **1 semaine solo** au-delà de la V1 Solo Dev.

---

## 7. Canaux de launch — les 4 priorités

### Priorité 1 — Hacker News (Show HN)

**Pourquoi ça compte** : front page 24h = 50-200k visiteurs uniques, souvent 1-5k installs pour un produit bien positionné. Canal historique des outils dev indie.

**Format** : `Show HN: Clawkin – the pet that lives in your Claude Code terminal`
- Description courte, honnête, 1 GIF/screenshot
- Lien vers clawkin.sh (pas GitHub direct — on veut les convertir au landing)

**Timing** : mardi ou mercredi matin 9-11h UTC. Pas lundi (afflux de posts), pas vendredi (faible engagement).

**Préparation** :
- Compte HN avec karma raisonnable (posts/commentaires pertinents pendant 2-3 semaines avant). Compte neuf = moins de visibilité.
- Premières 2-4h critiques : engager chaque commentaire avec respect, vite, sans promo.
- Préparer réponses aux objections classiques : "c'est inutile", "il y a déjà X", "pourquoi pas Cursor", "trop de surveillance", "quel est le business model".

**Risque** : 1 seul shot. Si le post coule, on attend 3-6 mois pour retenter (sinon détecté comme reposts).

### Priorité 2 — Product Hunt

**Pourquoi** : audience différente de HN (plus marketing/PM/founder), complémentaire. Gagner #1 Product of the Day = 10-30k visites sur 48h.

**Format** : launch en début de semaine (mardi/mercredi US Pacific). Pas besoin d'un hunter si on prépare bien sa propre launch.

**Préparation** :
- Page PH avec 4-6 visuals (screenshots, GIF, badge)
- Tagline courte qui colle à Clawkin.sh
- Upvoter son propre launch tôt + mobiliser seed users + communauté @clawkin

### Priorité 3 — Reddit

Subreddits ciblés (par ordre de pertinence) :
- **r/ClaudeAI** — audience directement concernée, probabilité sticky haute
- **r/sideproject** — audience indie dev très friendly aux launches
- **r/commandline** — enthousiastes terminal customization (core segment)
- **r/programming** — plus grosse audience, plus exigeante, volatile
- **r/indiehackers** — audience business-dev
- **r/vim / r/emacs / r/linux** — si framings spécifiques au customization

**Format** : post honnête ("I made a Claude Code pet, here's why"), pas promo agressive. Reddit déteste les launches corporate, adore les passion projects.

### Priorité 4 — X (Twitter)

**Pattern** : thread build-in-public en 6-10 tweets avec visuels.
- Tweet 1 : hook + screenshot
- Tweets 2-6 : story de construction + insights
- Tweet final : CTA install

**Multiplicateurs** :
- Tagger / quoter des tech influencers Claude Code si pertinent (Mike Kryvitsky, Mike Bostock, etc.) — sans spam
- Republier depuis @clawkin ET éventuellement un compte perso anonyme pour doubler la portée
- Se préparer à répondre à chaque réponse les 24 premières heures

### Priorités secondaires (lancer en parallèle ou J+7)

- **Lobste.rs** — audience dev pointue, très qualitative si on y entre
- **Indie Hackers** — écrire un post "how I built it", attire les indie founders
- **dev.to** — bon pour SEO + récurrence
- **GitHub trending** — arrive naturellement si le repo démarre à prendre des stars
- **Newsletter Claude Code** (via DevRel Anthropic ou newsletter indie type Changelog, TLDR Dev)

---

## 8. Stratégie seed community — pas influencer marketing

### Le principe

L'influencer marketing classique (send/pay à 50 comptes, hope 5 post) **décrédibilise** dans l'audience dev Claude Code. Un dev qui voit 5 tweets quasi-identiques la même semaine détecte l'astroturfing en 3 secondes et le produit perd l'authenticity premium qui est la vraie monnaie de l'audience indie dev.

À la place : **seed community building**. Donner early access + status à 10-15 personnes dont tu respectes personnellement le goût, sans jamais demander de post. Les posts émergent si le produit est vraiment bon, et ils sont authentiques par construction.

### La différence structurelle

| Influencer marketing (à éviter) | Seed community (à faire) |
|---|---|
| "Pay/send 50 influencers, hope 5 post" | "Give early access à 10-15 personnes précises" |
| Cash ou free products contre posts | Status, accès, ownership — jamais d'argent |
| Message contrôlé par toi | Message libre, peut même critiquer |
| "Will you promote this?" | "I thought you'd like this because [X]" |
| Objectif : volume de mentions | Objectif : 3-5 posts authentiques |
| Credibility → dilution | Credibility → amplification |

### Règles d'exécution

**1. Shortlist narrow, pas large.** 10-15 personnes dont le goût matche le positionnement awareness (honest, anti-hype). Sélection par **taste**, pas par follower count. Des devs dont tu sais qu'ils détestent la hype autant que toi.

**2. Zéro cash.** L'argent transforme instantanément un endorsement en publicité payée. Rewards possibles à la place :
- **Founding member status** — liste permanente sur `clawkin.sh/thanks`, mentionné à vie
- **Lifetime premium access** — coût marginal zéro pour toi, 9$/an perpétuel pour eux
- **Custom Clawkin name + badge variant** — *"Loki by @founder"*, status symbol visible et partageable
- **Accès roadmap** — Discord privé, voix dans les décisions produit

**3. Pas de demande de post, juste un cadeau.** Formule type :
> *"Hey [nom], I'm building this thing and I thought you'd like it because [raison spécifique à eux]. No ask, just curious what you think. Here's lifetime access either way."*

S'ils postent : bonus. S'ils ne postent pas : contact gagné, pas perdu ton temps.

**4. Let the product do the work.** Si Clawkin est vraiment délicieux (sprites qui tuent, pet qui respire bien, badge qui fait envie), les gens le partagent naturellement. Le seed est un accélérateur, pas un moteur.

### Variante plus forte — co-construction

Pour 2-3 personnes dont tu pressens qu'ils ont envie d'être impliqués :

> *"Hey [nom], tu veux choisir une créature pour le palier L100 avant le launch ? Ton nom reste associé à vie au L100."*

Ils créent → ils postent naturellement → authentique → zéro question de crédibilité.

Pattern éprouvé par Discord (founding servers), Substack (founding writers), plein d'indie tools.

**Jamais proposer un palier "premier" ou L1** — garde ces paliers majeurs pour les découvreurs publics qui viendront post-launch (cohérent avec brief §8 "premier découvreur" mécanic).

### Canaux et cibles

**À faire**
- Dev Twitter/Bluesky individuels (follower count 5k-100k) dont tu admires personnellement le taste. Approche seed uniquement.
- Créateurs Claude Code spécifiques (YouTube tutos, Substack AI dev, newsletters niche). Seed approach.
- Newsletters dev avec slots sponso **clairement disclosed** (TLDR Dev, Bytes, Changelog Nightly). 500-2000$/placement. Pas de problème de crédibilité parce que c'est déclaré sponsorisé. À tester vers M+3 avec petit budget, pas avant launch.

**À éviter**
- Approcher Fireship / ThePrimeagen / les gros YouTubeurs avec *"will you review this?"*. Ils reçoivent 50 pitches/jour et ignorent. S'ils reviewent, ce sera spontané.
- Toute campagne type "100 influencers en même temps". Mort immédiat.
- Plateformes qui packagent des placements influencer (Passionfroot et équivalents). Sentent le commercial, perte de crédibilité.

### Timing

**Pre-launch** (inclus dans les 4 semaines de §9)
- Shortlist 15 personnes que tu admires personnellement
- Envoie à 5-10 un DM personnel avec early access, raison spécifique, pas d'ask
- Propose co-construction à 2-3 personnes (palier L50 / L100 / L500)

**Au launch**
- Les gens qui aiment postent d'eux-mêmes (espère 3-5 sur 15 seeded)
- Remercie publiquement dans thread launch — comme "early community", jamais comme "sponsors"

**Post-launch**
- Si ça prend, ouvre Discord "founding members"
- Les premiers posts attirent d'autres créateurs qui demandent accès → amplification organique sans effort commercial

### La règle d'or

**Ne demande jamais un post. Donne des raisons de poster.**

Tout le reste découle de ça. Tant que tu tiens cette règle, zéro risque de décrédibilisation. Si tu la casses (une seule fois), tu perds l'authenticity premium qui est ton vrai levier face aux concurrents à gros budget.

### Budget à prévoir

- **Lifetime premium distribué aux seed** : 10-15 personnes × 9$/an perpétuel = revenue non capté estimé ~135$/an. Négligeable.
- **Newsletter sponso M+3** (optionnel) : 500-2000$ par placement, 1-2 placements à tester. Max ~4000$ sur un budget test.
- **Pas de cash aux individuels. Jamais.**

Total investi pour cette stratégie : **<5000$ sur 12 mois**, majoritairement en revenue différé (lifetime access) pas en cash out.

---

## 9. Timeline pre-launch (4 semaines avant le launch public)

### S-4 (4 semaines avant)
- CLI fonctionnel et stable sur zsh + bash
- Badge endpoint live
- Landing v1.11 déployée sur clawkin.sh
- Compte @clawkin créé (X + Bluesky)
- Première vague seed users (5-10)

### S-3
- Premier blog post SEO publié sur clawkin.sh/blog
- Cadence @clawkin : 2-3 tweets build-in-public par semaine
- Submissions awesome-lists
- Cold email DevRel Anthropic envoyé

### S-2
- Second blog post
- Seed users élargis (15-20)
- Préparation post HN + page PH + drafts tweets
- Handle @clawkin : viser 300-500 followers

### S-1
- Répétition du launch avec seed users
- Finalisation visuels (GIF pour PH, screenshots pour HN, thread X préparé)
- @clawkin : viser 500-1k followers
- Stress test infra (badge endpoint, install script, ping)

### Launch week
- Lundi : post Reddit r/sideproject (warm-up, feedback)
- Mardi matin UTC : Show HN
- Mardi après-midi : Product Hunt launch
- Mercredi : thread X en prime time US
- Jeudi : posts Reddit ciblés (r/ClaudeAI, r/commandline)
- Vendredi : rebond avec métriques publiées ("24h after launch")
- Weekend : repos, monitoring
- S+1 : follow-ups, premiers insights shippés aux seed users

---

## 10. Signaux de succès et de pivot pendant le launch

### Le launch fonctionne si (à M+1)
- 2 000+ installs cumulés
- HN front page atteint OU Product Hunt top 5 OU viral X tweet (>10k impressions)
- 300+ stars GitHub
- DAU/MAU > 20%
- 0-3 teams B2B closes organically (signal précoce que le pitch B2B résonne)

### Le launch est mitigé si (à M+1)
- 500-2k installs
- HN post à <50 upvotes et PH <100 votes
- DAU/MAU < 15%
→ Iterer sur différenciation paid + messaging + retenter sur Reddit ciblés à M+2/M+3

### Le launch a raté si (à M+1)
- <500 installs
- Engagement public proche de zéro
- Retention J7 <20%
→ Debriefer honnêtement : produit, positionnement, ou canaux ? Pivoter en conséquence (cf docs/07 §9 signaux de pivot).

---

## 11. Risques stratégiques et mitigations

### Anthropic ship un concurrent natif
**Probabilité** : faible-moyenne sur Clawkin (positionnement identitaire émotionnel), moyenne-haute sur un context/token optimizer natif.

**Mitigation** : vitesse d'exécution (ship en 2-3 semaines), marque claire, communauté @clawkin active. Si Anthropic ship un optimizer fonctionnel, Clawkin coexiste sur l'axe émotionnel — pas le même produit. Comme Strava cohabite avec Apple Health.

### Le hook API Claude Code change
**Probabilité** : moyenne sur 12-18 mois. Anthropic a déjà évolué son API plusieurs fois.

**Mitigation** : documenter la version Claude Code minimale supportée. Monitoring release notes. Bonne couche d'abstraction dans le CLI entre événements et logique pellet.

### HN + PH + Reddit ratent tous les trois
**Probabilité** : 15-25%.

**Mitigation** : pas un drame. Continue build-in-public, SEO compounding, content marketing. Les wins viraux viennent parfois plusieurs mois après le "launch officiel". Exemple : Starship a percé 6 mois après sa première release.

### Zéro network empêche la seed community
**Probabilité** : moyenne. Dépend de combien tu investis dans le pre-launch + la seed community (cf §8-9).

**Mitigation** : la pre-launch phase de 4 semaines est non-négociable. Si tu ships sans seed users, tu prends une chance en plus sur le hasard des canaux publics.

### Le B2B ne prend pas à 1-2k users
**Probabilité** : moyenne.

**Mitigation** : C'est OK. Continue le Solo Dev. Monitore les signaux (cf docs/06 §10). Si pas de demande B2B à M+6, réévalue pricing ou différenciation paid.

---

## 12. Questions ouvertes

- **Faut-il recruter un compère dev-rel / community manager à 6 mois ?** Trade-off : Edouard reste solo sans ego fatigue, vs perte de contrôle de la voix. À décider à M+3.
- **Micro-influenceurs Claude Code : stratégie gratuite possible ?** À discuter (prochain sujet après ce doc). Craintes : décrédibilisation, contrôle du message.
- **Open source la CLI ou pas ?** Open source = trust dev + contributions possibles, mais = risque de fork/copycat. Probablement open source la CLI mais pas le backend/dashboard.
- **Presskit** : faut-il préparer un presskit avant le launch (screenshots, logo, assets) pour les journalistes tech ? Low-cost, utile si un TechCrunch mord.
