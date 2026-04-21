# 02 — Nom et identité

> Décision verrouillée. Ne pas revisiter sans raison forte.

---

## Nom

**Clawkin**

- "Claw" (griffe, nom commun anglais) + "-kin" (parenté, clan, famille)
- Encode deux dimensions produit d'un coup : la créature (la griffe, le visuel) et la communauté (la parenté, les leaderboards, le premier découvreur)
- Aucune résonance phonétique ni structurelle avec "Claude" → risque trademark Anthropic quasi nul
- Novel coinage : pas de collision SEO significative
- Fonctionne en singulier (la créature) et en pluriel (la communauté)

## Domaine principal

**`clawkin.sh`**

- Le TLD `.sh` signe "shell" et matche l'habitat du produit (terminal/shell)
- Précédents légitimes dans l'écosystème : `brew.sh`, `atuin.sh`, `charm.sh`, `ngrok.sh`
- Triple signal : dev + shell + poésie de l'install
- Commande d'install : `curl -sL clawkin.sh | sh` — le domaine et le pipe riment, le dev comprend tout en 2 secondes

## Domaine défensif (optionnel, ~12€/an)

`clawkin.dev` — à grabber en redirect vers `.sh` avant le premier post public, pour éviter un squat. Pas bloquant jour 1.

## Handles à réserver

- Twitter / X : **@clawkin** (libre confirmé par Edouard)
- Bluesky : **@clawkin** (à vérifier)
- GitHub : **organisation `clawkin`** (pas user account — permet plusieurs repos sous la marque : `clawkin/cli`, `clawkin/www`, `clawkin/docs`, etc.)

## Vocabulaire produit — comment on nomme la créature

**Décision** : le nom `Clawkin` désigne à la fois l'app ET chaque créature individuelle. Pas de second vocabulaire ("pet", "monster", "daemon", "familiar") à maintenir.

**Convention** :
- **FR** — usage naturel de "créature" dans les discussions / docs internes ("la créature qui respire dans la statusline"). En copy produit : "ton Clawkin".
- **EN** — partout : `your clawkin`, `a clawkin`, `raise your clawkin`. Pluriel : `clawkins`.

**Pourquoi pas "pet"** : le mot est enfantin, connote Tamagotchi kid-friendly, et s'aligne mal avec l'audience dev senior. "Pet" reste acceptable en discussion orale rapide entre nous, mais proscrit dans tous les écrits — LP, badge, docs internes ET publiques. Les docs ont été audités dans ce sens le 2026-04-21 ; les seules occurrences restantes dans `docs/` sont des citations méta (cette section incluse) qui expliquent justement le rejet du terme.

**Pourquoi pas "monster" / "creature" en EN** : "creature" sonne générique/horror en anglais, "monster" ferme inutilement l'univers visuel. "Clawkin" porte déjà la charge sémantique (Claw + -kin = griffe + clan) — l'utiliser des deux côtés simplifie la marque.

**Pourquoi pas "daemon" / "familiar"** : jolis clins d'œil dev mais créent un vocabulaire parallèle à apprendre. Modèle Tamagotchi gagnant : le nom du produit EST le nom de l'espèce.

**Règles d'écriture** :
- En copy : `clawkin` minuscule par défaut (cohérent avec le wordmark monospace).
- En début de phrase ou titre : `Clawkin` accepté.
- Éviter les articles lourds : préférer "your clawkin" à "your Clawkin pet" (tautologique).

## Positionnement typographique

Le nom seul reste "clawkin" (lisible, prononçable, partageable). Le signal dev vit dans la **typographie de la marque** plutôt que dans le nom lui-même :

- Wordmark en monospace, casse basse : `clawkin`
- Variantes signatures : `$ clawkin`, `~/clawkin`, `clawkin.sh`
- Ne JAMAIS écrire `claw_kin`, `claw-kin`, `CLAW_KIN` ou avec symboles intégrés (`</>`) — ces formes cassent la lisibilité et sentent le nom de variable, pas la marque

## Pourquoi pas Clawde / Clawdia / CLAW

Shortlist initiale explorée :

- **Clawde / Clawdia** → rejetés. Résonance trop directe avec "Claude", risque trademark Anthropic réel. Précédent : Codeium (racheté par OpenAI) s'est fait taper par Anthropic sur son ancien nom "Clawd Code". Priorité : éviter les avocats, pas provoquer.
- **CLAW** (seul) → possible mais ambigu (claw machine, claw arcade game, griffe générique), SEO noisy dans les verticals gaming/horreur.
- **Pet Claw / Monster Claw** → descriptif mais pas brandable, pas ownable en trademark, et "Monster" ferme inutilement l'univers des créatures du brief.
- **Pixclaw** → bonne alternative mais fige le nom sur le pixel art (technique) alors que le produit est surtout une communauté (profondeur stratégique). Pixclaw optimise le court-terme, Clawkin le long-terme.
- **Clawsh** (famille bash/zsh/fish) → possible mais sur-fit l'axe shell et sous-fit la créature + la communauté.

## Séquence de réservation à exécuter

1. Créer l'org GitHub `clawkin` (privé par défaut)
2. Acheter le domaine `clawkin.sh`
3. Réserver le handle Bluesky `@clawkin`
4. (Optionnel) Acheter `clawkin.dev` en défensif, redirect vers `.sh`
5. Repo dev initial en privé sous `clawkin/`
6. Flip public = jour du premier Clawkin visible dans la statusline = premier post build-in-public
