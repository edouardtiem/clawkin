# 11 — Emblème statusline et surfaces visuelles

> Décision actée 2026-04-27 (session 4). Pivot majeur sur le placement et la nature des sprites Clawkin. Sépare clairement les surfaces de rendu et leur fonction. Supersede partiellement [docs/10 §5](10-formule-et-progression.md) sur le sprite statusline.

---

## 1. Le pivot — séparation des surfaces

Avant ce pivot, on imaginait que **le sprite Clawkin (numéroté #1-#1000, évoluant en 5 stages)** serait visible partout : statusline, badge, page profil. C'était une seule surface visuelle continue.

**Le test en condition réelle a tué cette idée** :
- Un sprite 12×12 rendu en Unicode half-blocks dans la statusline = 6 lignes de hauteur. Un dev senior ne donne jamais 6 lignes de son terminal à un pet.
- Le format compact 12×6 = 4 lignes, encore trop intrusif.
- Format ultra-compact 4×4 en Braille = 1-2 lignes, acceptable, mais alors **la résolution est trop pauvre pour différencier 1000 silhouettes en statusline**.

**Conclusion** : la statusline et le badge GitHub sont **deux surfaces distinctes avec deux fonctions distinctes**. Il faut deux assets visuels.

---

## 2. Les deux surfaces verrouillées

### 2.1 Statusline terminal — **emblème fixe unique**

| Critère | Décision |
|---|---|
| **Sprite** | Un seul, jamais changeant. Comme le 🦀 de Rust ou le 🐳 de Docker. |
| **Différenciation** | Aucune. Tout user voit le même emblème, quel que soit son level. |
| **Format** | 4×4 pixels rendus en 2 caractères Unicode Braille (`⡧⡂` pour le k lowercase) |
| **Hauteur** | 1 ligne unique (1 caractère de hauteur) |
| **Position** | À gauche du texte info |
| **Couleur** | Native du terminal user (pas d'override couleur) |
| **Fonction** | Branding, signe de présence. "J'ai Clawkin installé." |

**Format final retenu** :
```
⡧⡂ #001 Mole · L247 · 12w · 35% ctx
```

L'emblème reste constant. Seule l'info de droite change (numéro, level, streak, contexte).

### 2.2 Badge GitHub README + page profil + cartes de partage — **250 silhouettes différenciées**

| Critère | Décision |
|---|---|
| **Sprites** | 250 silhouettes 12×12 distinctes, organisées en 10 familles |
| **Évolution** | 5 stages par silhouette = 1250 états visuels au launch |
| **Différenciation** | Chaque silhouette représente un pattern d'usage / niveau de prestige |
| **Format** | SVG haute résolution (rendu libre à n'importe quelle taille) |
| **Position** | Badge embed dans README GitHub, page profil web `clawkin.sh/u/{handle}`, cartes de partage Twitter/Discord |
| **Couleur** | Palette Clawkin (à définir, non-imposée à la statusline) |
| **Fonction** | Identité publique, viralité, Pokédex partagé, asset signaling |

C'est ici que vivent les 250 silhouettes (cf [docs/10](10-formule-et-progression.md) §5 sur le mapping pattern → silhouette).

---

## 3. L'emblème statusline final — choix verrouillé

**Lettre `k` (lowercase) en Braille = `⡧⡂`**

### Pourquoi le k ?

- **Wordplay maximal** sur Claw**K**in. La lettre est littéralement dans le nom du produit.
- **Aucun outil dev majeur** n'utilise sa propre initiale stylisée comme emblème. Rust = 🦀, Go = 🐹, Java = ☕, Docker = 🐳. Tous des animaux/objets, jamais de lettre. Espace blanc à occuper.
- **Lecture instantanée** : tout dev reconnaît une lettre pixelisée plus vite qu'une silhouette abstraite.
- **Branding direct** : l'emblème = la lettre = le nom = la marque. Pas d'intermédiaire.

### Pourquoi le **lowercase** plutôt que l'uppercase ?

- Plus humble visuellement, cohérent avec un pet qui "vit modestement" dans la statusline
- Moins agressif qu'une majuscule
- Référence au culte des outils CLI dev qui privilégient toujours le lowercase (`git`, `npm`, `cargo`, `go`)
- L'uppercase K reste dispo en V2 si besoin (pour le badge richement coloré, par exemple)

### Le rendu Braille `⡧⡂`

```
4×4 pixel grid     →     2 Braille chars
                         (4 dots × 4 lines per char)

X . . .            →     dot 1 on
X . X .            →     dots 2 + dot mid-right on
X X . .            →     dots 3 + 6 on
X . X .            →     dots 7 + bot-right on
                         
                         Result: ⡧⡂
```

Le k a la pole verticale à gauche (dots 1, 2, 3, 7 du premier char) + le joint (dot 6) + les arms du k (dots 2 et 7 du second char).

### Couleur

**Native du terminal de l'user** — pas d'override couleur dans le script.

Avantages :
- Zéro décision couleur imposée (l'user a déjà choisi son thème)
- S'adapte au light theme et dark theme automatiquement
- Cohérent avec l'ambiance terminal de chaque user
- Discret par construction

Quand l'emblème devient "trop discret" pour un user, c'est que son thème terminal est très désaturé. Hypothèse : c'est un cas limite ; à régler en post-launch si feedback récurrent (option `CLAWKIN_EMBLEM_COLOR=#fbbf24` à exposer si besoin).

---

## 4. Iterations testées et rejetées (pour traçabilité)

Le pivot vers Braille + lowercase k a nécessité **8 itérations** en condition réelle. Tracées ici pour ne pas y revenir.

| # | Format testé | Hauteur | Verdict |
|---|---|---|---|
| 1 | Sprite 12×12 half-blocks | 6 lignes | ❌ Inacceptable, trop intrusif |
| 2 | Sprite 12×6 half-blocks | 3 lignes | ❌ Toujours trop |
| 3 | Sprite 4×4 half-blocks bottom-aligned | 2 lignes | ⚠️ Bug rendering half-blocks (gap entre `▄`/`█`/`▀` dans la plupart des fonts monospace) |
| 4 | Sprite 4×4 full-blocks (`██`/`█  █`) | 2 lignes | ❌ Forme trop pauvre, ne ressemble pas à une créature |
| 5 | Sprite 4×4 Braille `⡾⢷` (Mole) | 1 ligne | ✅ Format technique validé |
| 6 | Couleur ambre `#fbbf24` | — | ❌ Rejetée par l'user (vert, ambre, cyan, magenta tous rejetés) |
| 7 | Couleur native terminal | — | ✅ Validée |
| 8 | Sprite à droite du texte | — | ❌ Rejeté, sprite à gauche préféré |
| 9 | K1 uppercase classique `⡧⡊` | — | ⚠️ Plus de présence mais "presque ok" |
| 10 | **K3 lowercase `⡧⡂`** | — | ✅ **Choix final** |

---

## 5. Implications pour le scope production

### Ce qui change

- **Production de l'emblème statusline** : 1 design (le k Braille `⡧⡂`). Fait. Zéro travail supplémentaire.
- **Production des 250 silhouettes** : se concentre exclusivement sur le badge GitHub + page profil. Plus besoin de tester chaque silhouette en statusline réelle.
- **Hooks Claude Code + statusline.sh** : le script reste minimaliste. Output de 1 ligne avec emblème fixe + info dynamique.

### Ce qui ne change pas

- La formule d'évolution (cf [docs/10](10-formule-et-progression.md)) reste inchangée. Les 6 signaux Claude Code, la courbe OSRS-like, les 5 stages, les 1000 sprites, les Lignées post-L1000 — tout pareil.
- Le mapping pattern d'usage → silhouette s'applique au **badge** (la silhouette qui circule publiquement), pas à la statusline (qui montre toujours le k).
- L'Annual Report reste en URL HTML statique avec le sprite richer.
- Les Silent milestones (Dark Souls-style) s'appliquent au badge, pas à la statusline.

### Précision sur les "Silent milestones"

Avant ce pivot, on imaginait que le sprite statusline changerait à L1000, L2500, L5000, L10000. Désormais :
- **Statusline** : l'emblème k ne change jamais. C'est l'identité Clawkin.
- **Badge GitHub** : c'est *là* que les Silent milestones opèrent. Le sprite du badge évolue silencieusement aux paliers.

Le user voit son k discret en permanence (statusline). Quand il regarde son badge GitHub (action rare), il découvre des marques nouvelles à chaque palier.

---

## 6. Questions ouvertes

- **Variante future** : l'emblème statusline pourrait basculer en couleur custom à un palier (genre L5000+) sans changer la forme. À explorer en V2.
- **Animation possible** : le k pourrait clignoter une fois quand un Silent milestone est atteint sur le badge (notification discrète). À tester en V1.5.
- **Customisation paid** : un user paid pourrait optionnellement remplacer le k par une autre lettre (l'initiale de son handle ?). Dilue le branding mais offre identité. Anti-mainstream, à débattre.
- **Mode terminal sans Braille** : si certains terminaux/fonts rendent mal le Braille, prévoir un fallback ASCII ? (Probablement pas — Braille Unicode est très bien supporté en 2025.)
