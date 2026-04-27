# 12 — Production des 250 silhouettes (badge GitHub + page profil)

> Décision actée 2026-04-27 (session 4). Plan de production des 250 silhouettes qui peuplent les surfaces visuelles publiques de Clawkin (badge GitHub README, page profil web, cartes de partage). Cohérent avec [docs/11](11-emblemes-et-surfaces.md) — la statusline reste l'emblème k fixe.

---

## 1. Périmètre

**Surfaces concernées** : badge GitHub README, page profil `clawkin.sh/u/{handle}`, cartes de partage Twitter/Discord, page `/c/{hash}` (free anonyme).

**Surface non concernée** : statusline terminal (emblème k fixe `⡧⡂` cf [docs/11](11-emblemes-et-surfaces.md)).

**Volume cible launch** : 250 silhouettes × 5 stages d'évolution algorithmique = 1250 états visuels distincts.

**Cadence post-launch** : ajout annuel d'une nouvelle "marque" visuelle à chaque palier de 1K niveaux (cf [docs/10 §10](10-formule-et-progression.md)). Indépendant du compteur de silhouettes.

---

## 2. Distribution par familles

**10 familles × 25 silhouettes = 250.** Distribution équilibrée pour garantir la diversité visuelle quel que soit le pattern d'usage du dev.

| # | Famille | Vibe | Sous-thèmes possibles |
|---|---|---|---|
| 1 | **Quadrupède** | grounded, stable, structuré | Mammifères terrestres, mythiques (chimera, manticore), reptiles à 4 pattes |
| 2 | **Bipède** | vertical, anthropomorphe | Humanoïdes, robots, ents, statues vivantes |
| 3 | **Volant** | léger, libre, observateur | Oiseaux, papillons, dragons miniatures, créatures ailées |
| 4 | **Rampant** | low-key, sinueux, persistent | Serpents, lézards, vers, anguilles |
| 5 | **Amorphe** | adaptable, fluide, mystérieux | Slimes, blobs, brumes, gelées |
| 6 | **Géométrique** | pur, abstrait, sans personnalité | Cristaux, polyèdres, runes, formes platoniciennes |
| 7 | **Marin** | profond, mystique, ancien | Poissons, méduses, créatures abyssales, calmars |
| 8 | **Insectoïde** | structuré, segmenté, technique | Insectes, arthropodes, arachnides |
| 9 | **Cornu** | imposant, fier, noble | Cervidés, taureaux, démons à cornes, capricornes |
| 10 | **Totem** | statique, vertical, sage | Champignons, plantes, statues, idoles |

Chaque famille couvre un trait de Lignée dominant (cf [docs/10 §10.4 endgame mécanique 1](10-formule-et-progression.md)) :

| Famille | Trait Lignée dominant |
|---|---|
| Quadrupède | Architecte |
| Bipède | Conductor |
| Volant | Explorer |
| Rampant | Hermit |
| Amorphe | Alchemist |
| Géométrique | Cartographer |
| Marin | Sage |
| Insectoïde | Surgeon |
| Cornu | Lighthouse |
| Totem | Gardener |

**Précision** : un dev avec un trait dominant Architecte (sessions structurées, contexte maîtrisé) verra son Clawkin tirer dans la famille Quadrupède. Quel #N exact dans la famille = fonction de son XP + sous-pattern.

---

## 3. Plan des vagues

**5 vagues de production**, validées une à une par Edouard avant la suivante.

| Vague | Volume | Cumulé | Focus | Effort de mon côté |
|---|---|---|---|---|
| **wave-01** | 30 (10 originales + 20 nouvelles) | 30 | Calibrage : 3 par famille pour valider style cohérent | ✅ Fait (15 min) |
| **wave-02** | 50 | 80 | 5 nouvelles par famille — animaux classiques bien identifiés | ~20 min |
| **wave-03** | 50 | 130 | 5 nouvelles par famille — variantes mythologiques + cryptids | ~20 min |
| **wave-04** | 60 | 190 | 6 nouvelles par famille — hybrides + chimères + abstraits | ~25 min |
| **wave-05** | 60 | 250 | 6 nouvelles par famille — finitions, cas limites, signature | ~25 min |

**Validation entre chaque vague** : Edouard regarde la galerie HTML, marque les sprites à refondre. Mon côté : itération sur les rejets avant de passer à la suivante.

**Taux de rejet acceptable** : 15-25% par vague. Au-dessus = problème de style guide à revoir.

---

## 4. Style guide visuel

Règles universelles appliquées aux 250 silhouettes pour garantir la cohérence du set.

### 4.1 Contraintes techniques

- **Format** : 12×12 pixels exacts
- **Couleurs** : 1 foreground + transparent (binaire). Pas de gris intermédiaire.
- **Densité cible** : 30-60% de pixels remplis (43-86 pixels sur 144)
  - <30% : trop éparse, illisible à 1×
  - >60% : trop chargé, perte de silhouette nette

### 4.2 Composition

- **1 px padding minimum** sur les 4 côtés (sauf antennes, cornes, queue qui peuvent toucher le bord)
- **Symétrie verticale par défaut**, sauf intention narrative (regard, mouvement, posture)
- **Masse principale dans le tiers central** (lignes 4-9 sur 12)
- **1 point focal max** : œil contrasté ou marque distinctive — pas plus
- **Silhouette d'abord, détail après** : si on ne reconnaît pas la créature à la silhouette pure, le détail ne sauvera rien

### 4.3 Stage 3 = canonique

- Le sprite **adulte (stage 3)** est ce qui est dessiné à la main
- Les **stages 1, 2, 4, 5** sont **dérivés algorithmiquement** par accrétion de pixels (cf [docs/10 §6](10-formule-et-progression.md))
- Donc : production = uniquement le stage 3 pour chaque silhouette
- Validation visuelle : Edouard valide le stage 3, puis échantillon stages 1+5 pour vérifier que la règle d'évolution tient

### 4.4 Asymétrie intentionnelle

- Asymétrie permise pour **suggérer direction** (regard, mouvement)
- Asymétrie **proscrite** pour décoration sans sens (sinon ça paraît brouillon)

### 4.5 Densité par famille

Pour différencier visuellement les familles à coup d'œil :

| Famille | Densité cible |
|---|---|
| Quadrupède, Cornu, Bipède | 45-55% (corpulent) |
| Insectoïde, Géométrique | 35-45% (ajouré) |
| Amorphe, Marin | 50-60% (rempli) |
| Volant, Rampant, Totem | 40-50% (élancé) |

---

## 5. Mapping silhouette → pattern d'usage

**Logique déterministe** : tout user avec le même pattern + même XP voit le même #N. Architecture zéro-LLM (cf [docs/05](05-architecture-technique.md)).

### 5.1 Calcul du trait dominant

Trait dominant = max parmi 10 traits, calculé sur les agrégats des 90 derniers jours :

```
trait_score(Architecte) = clean_shot_ratio × 0.5 + low_compact_rate × 0.3 + tool_diversity × 0.2
trait_score(Explorer)   = tool_diversity × 0.6 + cross_repo_count × 0.4
trait_score(Surgeon)    = clean_shot_ratio × 0.7 + edit_success_rate × 0.3
... [10 formules]

trait_dominant = argmax(trait_score(t) for t in traits)
```

### 5.2 Mapping trait → famille

`trait_dominant` → `famille` (mapping fixe, cf §2)

### 5.3 Mapping famille + XP → #N spécifique

Dans les 25 silhouettes d'une famille, l'index est fonction de l'XP cumulée modulo une logique :

```
N_within_family = f(XP_cumulee, trait_dominant_score, secondary_signals)
N_global = famille_offset + N_within_family
```

Détails de la fonction `f` : à coder en V1, paramètres ajustables. **Cachée du wiki communautaire** par design (cf Prop 4 [docs/10 §11](10-formule-et-progression.md) — règles cachées).

### 5.4 Conséquence narrative

Un dev qui change de pattern d'usage (devient plus Explorer après avoir été Architecte) verra **son sprite basculer de famille** à cohérence avec son nouveau trait dominant. Son XP reste, son numéro change. Histoire perso = "j'étais Mole #008, je suis devenu Hawk #145".

---

## 6. Système de naming

**Style** : noms courts (1-2 syllabes max), évocateurs, anglais ou universel, sans trademark.

### 6.1 Noms déjà attribués (wave-01 — 30 sprites)

| Famille | Noms |
|---|---|
| Quadrupède | Mole, Cat, Bear |
| Bipède | Imp, Sage, Knight |
| Volant | Moth, Hawk, Bat |
| Rampant | Coil, Lizard, Slug |
| Amorphe | Slime, Goo, Mist |
| Géométrique | Krys, Cube, Spire |
| Marin | Jelly, Crab, Octo |
| Insectoïde | Beetle, Spider, Mant |
| Cornu | Ram, Stag, Bull |
| Totem | Mush, Tree, Pillar |

### 6.2 Génération des 220 noms restants

À déléguer à un agent pour brainstorming. Brief :

- 22 noms par famille (les 3 actuels + 22 nouveaux = 25 par famille)
- Noms courts, évocateurs, sans trademark
- Liste validée famille par famille avant attribution aux sprites

À faire : **passe de naming en wave-02** (ou en amont, selon disponibilité).

### 6.3 Réservation handles

Le système de handle paid (`clawkin.sh/u/edouard`) **ne réserve pas** les noms de silhouettes. Un user peut s'appeler "Mole" même si la silhouette #001 s'appelle Mole. Pas de conflit.

---

## 7. Format de stockage et rendu

### 7.1 Source canonique

**JSON binaire 12×12** dans le repo, sous `sprites/canonical/`. Format actuel des fichiers `sprites.json` :

```json
{
  "version": "1.0",
  "date": "2026-04-27",
  "sprites": [
    {
      "id": 1,
      "name": "Mole",
      "family": "quadrupede",
      "trait_dominant": "Architecte",
      "stage": "adult",
      "grid": [[0,0,0,...], [...], ...]
    },
    ...
  ]
}
```

C'est la source unique de vérité. Tous les rendus dérivent de là.

### 7.2 Rendus dynamiques

**Edge function Vercel** lit le JSON et génère à la volée :

| Surface | Format | Endpoint |
|---|---|---|
| Badge GitHub README | SVG vectoriel | `clawkin.sh/c/{hash}.svg` (free) ou `/u/{handle}.svg` (paid) |
| Page profil web | SVG ou Canvas embed | `clawkin.sh/u/{handle}` |
| Cartes de partage | PNG (1200×630 px, 12× zoom + texte) | `clawkin.sh/share/{handle}/{event}.png` |

Le SVG vectoriel scale infiniment sans perte. Le PNG est généré server-side via headless rendering pour les cartes de partage.

### 7.3 Couleur

- **Free** : couleur Clawkin signature (à définir, probablement vert dev classique ou ambre)
- **Paid V2** : couleur custom paramétrable via URL `?c=#fbbf24`

### 7.4 Cache

Tous les SVG/PNG cachés au premier rendu. Coût compute négligeable (~10ms par render, cache hit ~100% après).

---

## 8. Règles d'interdiction

Bans absolus pour les 250 silhouettes :

- ❌ **Trademarks gaming** : pas de Pikachu, Mario, Sonic, Pac-Man, Among Us crewmate, Stardew junimo
- ❌ **Mascots dev existants** : pas de Tux, Beastie, Gopher, Ferris, Octocat (même stylisés)
- ❌ **Cute outrancier** : aucun cœur, ✨, smiley, kawaii. Profil dev senior, pas Hello Kitty
- ❌ **Stéréotypes** : pas de représentations genrées, ethniques, religieuses, politiques
- ❌ **Symboles offensants** : pas de croix gammée, swastika, etc. (évident mais à acter)
- ❌ **Texte ou chiffres dans le sprite** (sauf cas exceptionnel justifié)
- ❌ **Doublons visuels** : aucune silhouette ne doit ressembler à >70% à une autre déjà validée

---

## 9. QA et validation

### 9.1 Process par vague

```
Mon côté : produire vague (15-25 min)
    ↓
Preview HTML générée + serveur démarré
    ↓
Edouard regarde la galerie
    ↓
Notes : silhouettes à refondre, à valider, à itérer
    ↓
Mon côté : iterations sur les rejets
    ↓
Re-validation
    ↓
Vague verrouillée → passage à la vague suivante
```

### 9.2 Critères de validation par sprite

| Critère | Test | Verdict |
|---|---|---|
| Lisible en 1× (24 px) | Visible dans la galerie wave-XX | ✅/❌ |
| Lisible en 4× (badge GitHub réel) | Test en mock badge | ✅/❌ |
| Distincte des 50 voisines | Comparaison visuelle dans la même famille + 2 familles voisines | ✅/❌ |
| Densité 30-60% | Compte automatique sur le grid | ✅/❌ |
| Pas de doublon | Comparaison perceptuelle avec sprites déjà validés | ✅/❌ |
| Évoque clairement la famille | Test "deviner la famille" sans nom | ✅/❌ |

### 9.3 Politique de rejet

- **Rejet hard** : refonte complète du sprite
- **Rejet soft** : modification mineure (déplacer 1-2 pixels)
- **Acceptable avec réserve** : on garde mais on revient en V2 pour polish

Taux cible : 70-85% accepté, 15-25% rejeté à itérer, 5% maxi laissé en V2.

---

## 10. Estimation d'effort total

| Étape | Temps |
|---|---|
| wave-02 production | 20 min |
| wave-02 review + itérations | 10 min |
| wave-03 production | 20 min |
| wave-03 review + itérations | 10 min |
| wave-04 production | 25 min |
| wave-04 review + itérations | 12 min |
| wave-05 production | 25 min |
| wave-05 review + itérations | 12 min |
| Naming des 220 sprites restants | 30 min (agent + validation) |
| **Total** | **~2h30 (vagues) + 30 min (naming) = 3h** |

Répartissable sur plusieurs sessions si besoin. Validation rapide entre chaque vague impérative.

---

## 11. Cadence annuelle post-launch (rappel)

Décision 2 session 3 : à chaque année post-launch, ajouter une **nouvelle marque visuelle** à un nouveau palier de 1K niveaux (sur l'**arbre des stages d'évolution**, pas sur le compteur de silhouettes).

Concrètement :
- Année 1 : stages 1-5 disponibles (couvrent L1 → L1000)
- Année 2 : ajout stage 6 (= une nouvelle marque visuelle qui s'applique à L1000+)
- Année 3 : stage 7 à L2000+
- ...

**Indépendant du nombre de silhouettes**. Les 250 silhouettes restent stables (sauf vagues additionnelles éventuelles si la communauté en demande).

---

## 12. Questions ouvertes

- **Cadence de production effective** : faire les 4 vagues d'affilée ou étaler sur plusieurs sessions selon dispo Edouard ?
- **Couleur signature Clawkin** : à fixer (probablement avant wave-02 pour cohérence des previews)
- **Naming agent** : à lancer avant ou en parallèle de wave-02 ?
- **Mapping `f(XP, trait, signals)` → #N** : formule exacte à coder en V1 — paramètres à ajuster post-launch sur la vraie data
- **Variantes shiny déterministes** (cf Prop 2 [docs/10 §11](10-formule-et-progression.md)) : à intégrer dans le pipeline de rendu, ~5% de variantes cosmétiques
- **Vagues additionnelles post-launch** : si la communauté demande "plus de variantes Marin", on peut ajouter une wave-06 etc. À documenter le process.

---

**Reprise** : la prochaine action concrète est **wave-02** (50 nouvelles silhouettes, 5 par famille). Edouard valide ce doc, je lance wave-02.
