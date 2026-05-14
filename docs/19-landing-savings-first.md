# 19 — Landing pivot : savings-first (approche B)

> Décision actée le 2026-05-13 : la landing `clawkin.sh` est réécrite en positionnement **"utility savings first"** (Feature 1 — Token Routing). La créature, les niveaux, les streaks et le badge GitHub (Feature 2) sont **retirés** de la landing — pas mis en teaser. Approche B (retrait total), pas A (teaser discret).

---

## 1. Pourquoi B et pas A

- **A** = garder la créature en teaser discret à côté du message savings.
- **B** = retrait total de tout ce qui est Feature 2.

Choix **B** : la landing doit être 100% focalisée conversion sur ce qui ship réellement (Feature 1). Deux messages = dilution. La créature, les niveaux et le badge reviendront sur la landing **quand Feature 2 shippera** — pas avant. Mélanger "outil d'économies" et "Tamagotchi qui grandit" brouille la proposition de valeur au moment le plus critique (le launch).

---

## 2. État actuel de la landing (à retirer)

La landing `v0.1.0` vend intégralement Feature 2 :

| Composant | Contenu actuel (Feature 2) |
|---|---|
| `Hero.astro` | *"clawkin lives in your statusline / grows when you work cleanly"* + ASCII créature qui respire |
| `DemoWindow.astro` | session qui "feed your clawkin", créature qui level up, statusline `L12 · 3d streak` |
| `Badge.astro` | bloc badge GitHub `clawkin ▣▤ L12 · 3d` |
| `Pact.astro` | *"we don't reward volume / your clawkin hibernates, never dies"* |
| `Nav.astro` / `SiteFooter.astro` | liens `#badge`, `#pact`, `@clawkin` |

---

## 3. Cible Feature 1 (à construire)

| Bloc | Avant (F2) | Après (F1) |
|---|---|---|
| **Hero** | créature statusline | message économies — bill Claude Code qui baisse |
| **InstallBar** | `curl -sL clawkin.sh \| sh` | inchangé |
| **DemoWindow** | level up créature | bash output trimmé (head/tail) + compteur savings |
| **Badge** | badge GitHub L12 | **retiré** |
| **Pact** | pacte anti-volume | pacte **money-back** (cf pricing) |
| **Statusline mock** | `L12 · 3d streak` | `saved $X.YY today` |
| **Nav / Footer** | liens badge/pact | liens adaptés (pricing, github) |

---

## 4. Ce qui est conservé

- **Identité visuelle** : palette monochrome, JetBrains Mono, fenêtre terminal, dashes — tout le système graphique reste.
- **ASCII clawkin** : peut rester comme **élément de marque / logo discret**, pas comme "créature qui grandit". À trancher au build.
- **Nom, domaine** `clawkin.sh`.

---

## 5. Pricing — NON TRANCHÉ ⚠️

Le pricing affiché sur la landing **n'est pas décidé**. Le Hero et le Pact en dépendent directement → **ne pas builder la landing tant que le pricing n'est pas acté** dans un doc dédié.

Points ouverts identifiés le 2026-05-13 :

- Spec 17 §12 dit : **9€/mo + money-back si < 18€ économisés**.
- **Problème de fond** : les users Claude Pro (20$/mo flat) ne paient pas au token → ils n'économisent **pas de cash** → le money-back "2× ou remboursé" est incohérent pour eux.
- Le marché se scinde en **deux segments avec deux pitches différents** :
  - **API / BYOK** : économies en cash réelles → money-back cohérent.
  - **Pro / Max** : pas d'économie cash → valeur = headroom / "ne pas passer à Max".
- Question prix : 9€ (spec) tient pour les API users ; pour adresser les 20$/mo il faut soit baisser, soit reframer la valeur — mais les frais fixes Stripe posent un plancher (~5€/mo).

→ À résoudre dans `docs/20-pricing.md` avant le build landing.

---

## 6. Build

- Branche : à créer quand le pricing est tranché.
- Pré-requis bloquant : `docs/20-pricing.md` acté.
- Le refactor touche : `Hero`, `DemoWindow`, `Pact`, `Nav`, `SiteFooter`, suppression `Badge`, ajustement `landing.js` (révélations de sections) et CSS associé.
