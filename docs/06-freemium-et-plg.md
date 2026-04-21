# 06 — Modèle freemium et stratégie PLG V1

> Décision actée 2026-04-21 (session 2). Supersede partiellement [docs/03](03-plg-levers.md) (le leaderboard n'est plus la clé de voûte de la monétisation) et le brief §10 (la monétisation s'active dès V1, pas V2).

---

## 1. Contexte de la décision

Session 2 a challengé deux points restés ouverts après session 1 :

1. **Sans leaderboard, qu'est-ce qu'on vend à 9$/an ?** Le brief §10 adossait intégralement le paid à la présence publique dans un leaderboard. Le doc 03 a différé ce leaderboard à V2 — mais a laissé la monétisation orpheline. Résultat : "focus viralité absolue pendant 6 mois" devenait de facto "zéro revenu pendant 6 mois".

2. **Le gratuit tel que défini ne poussait pas au partage.** Le Clawkin vit dans la statusline de celui qui l'utilise, point. Aucun moteur d'acquisition passif : un user gratuit n'exposait la marque à aucun non-user pendant son usage normal. Levier PLG maigre.

La décision reconfigure le modèle freemium pour corriger les deux angles d'un coup.

---

## 2. Le leaderboard : reclassé de "V2 obligatoire" à "optionnel, post-traction"

### Coûts cachés du leaderboard
- Auth (GitHub OAuth) + DB utilisateurs relationnelle
- Anti-gaming, modération, politique de fair-play
- Géolocalisation pour les classements locaux
- Hébergement à perpétuité (un leaderboard qu'on éteint = trahison communauté)
- 2-3 mois de dev solo minimum

### Bénéfices remplaçables
- **Hook "premier découvreur"** → remplaçable par la contagion passive des badges dans le wild (un dev qui voit un badge distinctif sur un README veut le sien)
- **Classements locaux Strava-like** → inatteignables avant 5k+ users répartis géographiquement, chicken & egg
- **Proof social** → remplaçable par un compteur live sur la landing ("X devs tracking their hygiene")

### Nouvelle position
Le leaderboard n'est **plus la clé de voûte** de la monétisation ni du PLG. Il peut être ajouté plus tard si la communauté le demande fortement (signal explicite Discord / Twitter / tickets), mais il ne structure plus le product design. La roadmap et les décisions monétaires doivent tenir debout sans lui.

---

## 3. Les deux paths — règle fondamentale

> **Le gratuit maximise la distribution de Clawkin. Le payant maximise l'identité du user.**
>
> Free = ambassadeur. Paid = citoyen.

Trois implications :

1. **Le gratuit reste entier.** Jamais bridé pour forcer l'upgrade. Un user gratuit a un Clawkin complet, fier, satisfaisant seul.
2. **Le gratuit est un vecteur d'acquisition.** Il est bourré de surfaces signées `clawkin.sh` qui circulent passivement auprès de non-users.
3. **Le paid vend une différenciation, pas une existence.** On n'achète pas "être visible publiquement" — on achète "être visible à SON nom, avec SA signature".

---

## 4. Path Gratuit — Clawkin local + distribution passive

Tout ce qui suit est gratuit pour toujours.

### Valeur locale (intime)
- Clawkin complet dans la statusline Claude Code
- Clawkin dans le prompt shell entre les sessions
- Évolution aux paliers (sprite qui change tous les 10 niveaux)
- Tracking d'hygiène via hooks lifecycle (SessionStart, Stop, PreCompact, etc.)
- Commandes CLI locales : `clawkin`, `clawkin status`, `clawkin rank`

### Surfaces publiques signées (acquisition passive)
- **Badge README standard** : sprite + level + streak, avec `clawkin.sh` en pied. Beau, distinctif, partageable. Pas bridé esthétiquement — sinon personne ne l'affiche et le levier principal meurt.
- **URL publique anonyme** : `clawkin.sh/c/a8f2c9` (hash non-claimable). N'importe quel user gratuit peut déjà poster *"regarde mon Clawkin"* avec un lien cliquable.
- **Cartes de partage** aux paliers (L10, L50, L100) : signature discrète, pas de watermark agressif. Objectif : partage spontané sur Twitter/Bluesky.
- **Moments de share déclenchés par le produit** : ASCII soigné au passage des paliers, avec une ligne *"this moment is ready to screenshot"*. Timing + esthétique → share naturel, jamais forcé.

### Ce que le gratuit n'a pas
- Pas de handle personnalisé lisible (`@edouard`) — juste un hash aléatoire
- Pas de page profil publique riche
- Badge README non-animé, pas de couleur custom, pas de nom custom
- Cartes de partage avec signature `clawkin.sh` (petite mais visible)

---

## 5. Path Payant — Identité publique à 9$/an

Un seul tier. Simple. On ne multiplie pas les paliers en V1.

### Ce que débloque le paid
- **Handle personnalisé** : `clawkin.sh/u/edouard` remplace le hash anonyme
- **Page profil publique riche** : Clawkin animé live, stats lifetime, histoire ("born March 2026, evolved 14 times"), palette signature, indexée Google — asset identitaire durable
- **Badge README premium** : animation SVG, couleur custom, handle visible, ✓ checkmark
- **Nom custom du Clawkin** : "Loki" au lieu de "Clawkin #8472". Le nom apparaît partout (statusline locale, badge, page profil)
- **Cartes de partage propres** : signature minimale ou absente, thème choisi, incluent handle + nom custom

### Ce que le paid **ne vend pas**
- Pas de skin custom qui casserait "level = créature partagée mondialement" (brief §8)
- Pas de sync multi-machines qui casserait le zéro-daemon (brief §3)
- Pas d'analytics avancées — Clawkin reste un produit awareness, pas un dashboard
- Pas de support prioritaire — "zéro support" est un critère dur d'Edouard

---

## 6. Tableau récapitulatif

| Surface | Gratuit | Paid 9$/an |
|---|---|---|
| Clawkin local (statusline + prompt shell) | ✓ complet | ✓ complet |
| Évolution aux paliers, hygiène, CLI | ✓ | ✓ |
| Badge README | standard, signé `clawkin.sh` | animé, couleur custom, handle visible, ✓ |
| URL publique | hash anonyme `clawkin.sh/c/ab38f2` | handle `clawkin.sh/u/edouard` |
| Page profil publique | — | riche (stats, histoire, palette, live) |
| Nom du Clawkin | "Clawkin #8472" | "Loki" custom |
| Cartes de partage (aux paliers) | signature discrète `clawkin.sh` | propres, thème custom, handle visible |

---

## 7. Funnel free → paid dès J1

Trois mécaniques, aucune bloquante, toutes compatibles avec les 3 piliers non-négociables du brief §4 (zéro friction active, toujours visible, screenshot lisible en 3s).

### 1. Réservation gratuite du handle, activation payante
Dès l'installation, le user peut réserver `@edouard` gratuitement. Le handle est mis en garde-fou : si pas d'activation (paiement) sous 60 jours, il se libère à nouveau.
- **Effet** : pression sociale subtile ("je risque de perdre mon nom") sans jamais forcer.
- **Pas de punition** : le free user garde son hash anonyme s'il ne paie pas. Rien ne casse.

### 2. Upgrade prompts timés à l'achievement
Jamais au onboarding. Uniquement aux moments où le user ressent de la fierté :
- Passage L50, L100, L250
- Streak 30 jours atteint
- Nouvelle forme "rare" débloquée

Message style ASCII discret dans le terminal :
```
Your Clawkin just hit L50.
Make it public — clawkin.sh/claim
```
Zéro popup, zéro blocker, zéro notification push. Timé avec l'émotion, pas avec la frustration.

### 3. Contagion passive via badges en circulation
Les badges paid (animés, nom custom, handle `@edouard`) circulent sur des README que voient les users gratuits. Ils se disent *"ce dev a un Clawkin avec son nom"* → demande générée sans pub.

Mécanisme auto-renforçant : plus il y a de paid users, plus il y a de badges paid en circulation, plus les gratuits upgradent.

---

## 8. Chiffres de conversion attendus

Pour une vraie feature publique (pas du tipping), référence freemium dev tools :

| Horizon | Installs cumulés | Conversion | Payants | ARR à 9$/an |
|---|---|---|---|---|
| M+3 | 2 000 – 4 500 | 2% | 40 – 90 | 360 – 800$ |
| M+6 | 4 000 – 9 000 | 2-3% | 80 – 270 | 720 – 2 400$ |
| M+12 | 8 000 – 20 000 | 2-4% | 160 – 800 | 1 400 – 7 200$ |
| M+18 | 15 000 – 30 000 | 3-5% | 450 – 1 500 | 4 000 – 13 500$ |

**3 à 5× meilleur** que le scénario "attendre V2 leaderboard" du doc 03. Et sans jamais construire de leaderboard.

La cible 5-10k€/mois du brief §10 reste atteignable à M+18/M+24, portée par le tier Équipe qui arrive en Phase 2 (post-10k installs).

---

## 9. Conséquences sur la roadmap

Ce qui entre en V1 par rapport au scope doc 04 :

### Infra additionnelle V1
- **Stripe** (checkout + webhooks renouvellement)
- **GitHub OAuth** (pour claim du handle — on veut éviter l'usurpation)
- **Vercel KV** étendu (stocker handles réservés, état paid/free, profils)
- **Endpoint page profil** `clawkin.sh/u/:handle` (HTML + métadonnées OG)

Estimation coût dev additionnel : **~1 semaine solo** au-delà du CLI et du badge endpoint. Reste compatible avec la fenêtre "ship en 2-3 semaines" — à condition de ne rien sur-investir (checkout Stripe standard, pas de customer portal custom, etc.).

### Inchangé
- Q1 (formule progression) et Q2 (générateur sprites) restent les blockers techniques prioritaires
- Le brief §10 tier Équipe (5-7$/dev/mois) reste un objectif Phase 2, post-10k installs
- Les 3 piliers non-négociables du brief §4 restent la grille de décision

### Supprimé / reclassé
- Leaderboard mondial + local : reclassé "optionnel, réactivable si demande forte communauté"
- Hook "premier découvreur" comme moteur viral structurant : remplacé par contagion passive badge
- Tous les livrables qui dépendaient du leaderboard dans le brief et le doc 03

---

## 10. Signaux de validation et de pivot

### Le modèle fonctionne si
- Conversion gratuit → paid **≥ 2% à M+3**
- Les badges paid circulent visiblement sur les README GitHub (métrique : % de badges servis avec paramètre `premium=true`)
- Les cartes de partage aux paliers sont postées organiquement (métrique : mentions `clawkin.sh` sur Twitter/Bluesky par semaine)
- Le CPL reste à **0€** — zéro ad dépensé

### On pivote si
- Conversion **< 0,5% à M+3** → signal que l'offre paid n'a pas de tension. Retravailler la différenciation (plus d'animation badge ? plus de personnalisation profil ?).
- Les cartes gratuites ne se partagent pas → le moteur PLG passif est cassé. Revoir esthétique / signature / moments de déclenchement.
- Les users paid demandent activement un leaderboard (signal Discord / support mail répété) → alors, et seulement alors, reconsidérer V2 leaderboard comme feature payante additionnelle.

---

## 11. Risques acceptés

1. **Plus de complexité V1** (Stripe + OAuth) que le lean pur gratuit. Mais la charge reste maîtrisée en solo et l'infra paid sert aussi le PLG (page profil publique visible par tous).

2. **Si la conversion est faible, infra paid engagée pour rien.** Compensé par le fait que Stripe et OAuth sont des briques standard, rapides à shipper, et réutilisables pour tout tier futur (Équipe, etc.).

3. **Perte théorique du hook viral "premier découvreur"** par rapport au plan brief §8. Compensé par la contagion badge passive et les cartes de partage aux paliers. Moins explosif ponctuellement, plus durable cumulativement.

4. **Le paid pourrait sentir "cosmétique" à certains devs.** C'est assumé — c'est exactement la promesse du brief §10 : *"gratuit fonctionnel, payant pour la gloire"*. Les devs achètent du statut, pas des features.

---

## 12. Questions ouvertes nouvelles (session 2)

- **Mécanique précise de réservation du handle** : 60 jours de grace period est un chiffre arbitraire. À calibrer selon taux de conversion observé — peut-être 30 jours (pression plus forte) ou 90 jours (laisser le temps de s'attacher).
- **Pricing alternatif à tester** : 9$/an est cohérent avec le brief §10 mais peut être challengé. 12$/an ? 7$/an ? Un tier "founding supporter" à 20$/an la première année ? À décider avant le launch.
- **Périmètre exact de la page profil publique** : quelles stats afficher ? Streak actuel, streak max, nombre de paliers franchis, date de naissance, Clawkin history (évolutions passées) ? Trop d'infos = dashboard analytics (hors scope awareness). Trop peu = pas de différenciation avec le badge. Trouver le point d'équilibre.
