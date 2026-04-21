# landing — 3 variantes d'exploration

Trois directions visuelles pour la landing de `clawkin.sh`. Chaque variante est un `index.html` autonome (HTML + CSS + JS inline, pas de build, pas de dépendances à installer). Ouvre chacune séparément et juge.

## Les 3 variantes

| # | Dossier | Direction | Feel |
|---|---|---|---|
| 1 | `v1-pure-terminal/` | **Pure terminal** — style page man | Austère, Unix, craftsman. Lit comme `man clawkin`. |
| 2 | `v2-amber-crt/` | **Amber CRT** — boot sequence animé | Nostalgique, VT220, scan lines. Le système démarre sous tes yeux. |
| 3 | `v3-modern-dev/` | **Modern dev** — aesthetic Vercel / Linear | Polish, hiérarchie visuelle, accent couleur. Dark mais commercial. |

## Comment les ouvrir

### Option A — double-clic (le plus simple)
Ouvre le Finder, descends dans `landing/v1-pure-terminal/`, double-clique sur `index.html`. Safari/Chrome ouvre la page en `file://`.

### Option B — ligne de commande
```sh
open landing/v1-pure-terminal/index.html
open landing/v2-amber-crt/index.html
open landing/v3-modern-dev/index.html
```

### Option C — petit serveur local (si une animation bug en `file://`)
```sh
cd landing
npx serve .
# puis ouvrir http://localhost:3000/v1-pure-terminal/
```

## Contenu commun aux 3 variantes

- Nom : **clawkin**
- Tagline / promesse : un Clawkin qui vit dans la statusline Claude Code et grandit quand tu travailles bien
- Mockup statusline : `▣▤ L250 · 47d streak` (ou variante)
- Le pacte (3 promesses) :
  - *On ne récompense pas le volume.*
  - *Un nouveau peut atteindre le top de sa ville en un mois.*
  - *Ton Clawkin ne meurt jamais. L'absence n'est pas punie.*
- Install : `curl -sL clawkin.sh | sh`
- Typo monospace + fond noir + écrit blanc

## Prochaine étape une fois que tu as choisi

Quand une direction est verrouillée, migration vers le vrai projet :
- **Astro** si on veut rester 100% statique, léger, rapide à déployer sur Vercel
- **Next.js** si on anticipe de la composition React / des features dynamiques plus tard (leaderboard, auth, etc.)

Mon instinct : Astro pour la landing, Next.js seulement si le leaderboard public vit sur le même domaine.
