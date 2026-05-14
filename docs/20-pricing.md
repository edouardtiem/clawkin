# 20 — Pricing et modèle freemium V1

> Décision actée le 2026-05-14. Résout la question ouverte de [doc 19 §5](19-landing-savings-first.md) et débloque le build de la landing.
> Ferme définitivement [doc 14](14-smart-routing.md) (Smart Routing).
> Supersede [doc 18 §7](18-pivot-v1-deterministe.md) (upgrade Haiku V2) et [doc 06 §5](06-freemium-et-plg.md) (modèle payant « identité ») pour la définition du payant V1.

---

## 1. Ce que ce doc tranche

doc 19 §5 a bloqué le build de la landing tant que le pricing n'était pas acté. Ce doc tranche, dans l'ordre :

1. Le principe non négociable qui gouverne tout le reste : **zéro LLM**.
2. Le segment cible : **Pro / Max**.
3. Le modèle freemium : **free = trimming complet**, **payant = Recall**.
4. Les prix : **5 €/mo · 39 €/an · 89 € lifetime**.
5. Le « Pact » de la landing : **transparence**, pas money-back.
6. Les directions explicitement écartées et pourquoi.
7. Les conséquences sur la landing (doc 19).

---

## 2. Principe non négociable : zéro LLM

**Clawkin n'appelle jamais de LLM.** Aucun worker, aucun modèle secondaire, aucune compression IA, aucun agent de routing. Tout ce que fait Clawkin est déterministe.

Ce principe n'est pas une contrainte technique subie — c'est le socle qui rend le reste sain :

| Conséquence | Pourquoi ça compte |
|---|---|
| **Marge pure** | Zéro coût token. Ce qui rend le lifetime 89 € viable : aucun coût récurrent à servir. |
| **Zéro friction install** | Pas de BYOK, pas de clé API à coller. `curl \| sh` et ça marche. |
| **Zéro risque ToS** | Pas de question sur l'usage des abonnements Pro/Max pour appeler une API. |
| **Latence < 5 ms** | Le trimming est instantané, invisible. |

Tout ce qui suit découle de ce principe. Une feature qui exige un LLM est hors périmètre, point — peu importe sa valeur.

---

## 3. Segment cible : Pro / Max

Le marché se scinde en deux (doc 19 §5) : les users **API / BYOK** (qui paient au token, économisent du cash) et les users **Pro / Max** (forfait fixe, ne paient pas au token).

**Cible retenue : Pro / Max.**

Conséquence directe sur le pitch : la valeur n'est **pas** « ta facture baisse ». Les Pro/Max n'ont pas de facture variable. La valeur est le **headroom** :

> Ton contexte tient plus longtemps, ton quota va plus loin, tu ne touches pas tes limites — et tu n'as pas besoin de passer au palier au-dessus.

Tout claim de type « cash savings » ou « 40 % moins cher » est abandonné (c'était le pitch segment API de doc 14, et le segment API n'est pas la cible).

---

## 4. Le modèle freemium

Règle fondamentale, héritée de [doc 06 §3](06-freemium-et-plg.md) : **le gratuit reste entier, jamais bridé. Le payant ajoute une autre dimension — il ne débridé pas le gratuit.**

### 4.1 Free (permanent)

L'utilitaire complet de trimming déterministe :

- Les 4 patterns de trimming (bash truncate, file read dedup, grep summarize, audit hint — cf. doc 18 §6).
- L'allowlist curée, les seuils head/tail par défaut.
- Pleine agressivité. Le trimming d'un user gratuit n'est **jamais** moins bon que celui d'un user payant.

Le free est un produit fini, satisfaisant seul. C'est aussi le moteur d'acquisition (PLG).

### 4.2 Payant — Recall

Le trimming jette le milieu coupé. **Recall le garde**, en local, et le rend récupérable sans re-run. Détail fonctionnel en §5.

### 4.3 Tableau récap

| | Free (permanent) | Payant |
|---|---|---|
| Trimming déterministe (4 patterns) | ✓ complet, pleine agressivité | ✓ identique |
| Sort du milieu coupé | jeté | **parqué en local, récupérable** |
| Récupérer un bout coupé | relancer la commande | `clawkin show` / `clawkin grep`, sans re-run |
| Custom rules (allowlist, config par projet) | défaut curé | *candidat secondaire — cf. §10* |

---

## 5. Recall — définition fonctionnelle

### 5.1 Le mécanisme

Au moment où Clawkin trime un output, il a déjà le contenu complet en main (il le faut pour trimmer). En free, le milieu est jeté. En payant, il est **écrit dans un cache local** (`~/.cache/clawkin/<id>.txt`), plafonné et en rolling (taille max ou rétention en jours — à calibrer).

Rien n'est uploadé. Rien ne quitte la machine de l'user.

### 5.2 « Claude cherche dans la corbeille »

Le marqueur de trim n'est pas du texte mort — il est **actionnable** :

```
[Clawkin: 1940 lignes coupées — clawkin grep a8f2 "<terme>"]
```

- **Claude Code décide** quand et quoi aller chercher. Il est déjà dans la boucle → **aucun LLM supplémentaire**, aucun coût.
- **Clawkin exécute un grep déterministe** sur le fichier local parqué.
- **Seules les lignes qui matchent reviennent** dans le contexte — pas les 1940. Donc pas de re-pollution du contexte qu'on vient de nettoyer.

Commandes exposées :
- `clawkin show <id>` — le contenu coupé complet.
- `clawkin grep <id> "<terme>"` — recherche déterministe dedans.

« L'agent qui va chercher dans la corbeille », c'est **Claude lui-même**, et la corbeille est cherchable en local — sans LLM, sans re-run.

### 5.3 Pourquoi Recall et pas autre chose

Recall est la **seule** valeur payante qui coche les quatre contraintes en même temps :

- **Déterministe** — cache local + grep. Zéro LLM.
- **Marge pure** — vit sur le disque de l'user. Zéro coût token, zéro coût serveur.
- **Ne bride pas le free** — le trimming est rigoureusement identique des deux côtés. Recall ajoute une dimension *récupération*, il n'améliore pas le trimming.
- **Valeur récurrente durable** — passe le test « je l'ai vu 10 fois, je n'y vais plus » : ce n'est pas une info qu'on internalise (comme un dashboard), c'est une capacité qui se déclenche sur un événement récurrent et imprévisible (un trim qu'on voulait finalement). Chaque session = nouveaux trims = nouveaux rappels possibles.

Et c'est aligné segment Pro/Max : un re-run de `docker build` brûle du quota. Recall l'évite → headroom direct. Et Recall rend le trim agressif *sûr* : on laisse Clawkin couper franc parce que rien n'est jamais vraiment perdu.

---

## 6. Pricing

### 6.1 Les trois options

| Formule | Prix | Note |
|---|---|---|
| Mensuel | **5 €/mo** | Plancher Stripe (~5 € de frais fixes). |
| Annuel | **39 €/an** | ~35 % de remise vs mensuel. |
| Lifetime | **89 €** | Permanent, pas une offre limitée (cf. §6.3). |

Une seule chose achetée dans les trois cas : **Recall**.

### 6.2 Rationale lifetime 89 €

Le lifetime est sain ici, pour deux raisons :

1. **Marge pure** (§2) — un user lifetime ne crée aucun coût récurrent à servir. Pas de token, pas de worker, pas de serveur. Le risque classique du lifetime (servir à perte pendant 10 ans) n'existe pas.
2. **Incertitude produit assumée** — la pérennité de l'outil à un an n'est pas garantie. Encaisser maintenant un lifetime est cohérent avec ce niveau d'incertitude, des deux côtés : l'user paie un prix fini pour un risque fini, le projet sécurise du cash tôt.

89 € ≈ 1,5 an de mensuel ou ~2,3 ans d'annuel.

### 6.3 Pas d'offre de lancement

Pas de framing « founding offer » ou « -X % au lancement ». Raison : peu de comms prévues sur l'outil → un mécanisme d'offre limitée dans le temps n'a pas de canal pour exister, et créerait une fausse urgence incohérente. **Le lifetime 89 € est simplement une des trois options, disponible en permanence.**

---

## 7. Le « Pact » : transparence, pas money-back

doc 19 §3 prévoyait un « pacte money-back » sur la landing. **Abandonné** : le money-back « 2× ou remboursé » suppose des économies en cash mesurables — incohérent pour le segment Pro/Max qui n'économise pas de cash (doc 19 §5 le signalait déjà). Ferme aussi le money-back de doc 14 §4 et doc 17 §12.

Le « Pact » devient un **pacte de transparence / privacy**, et il renforce directement Recall :

- Tout reste **en local**. Rien n'est uploadé, jamais.
- **Zéro daemon** (cf. doc 18, doc 06 §5).
- Clawkin ne touche **que les outputs de commandes bash**. Jamais ton code, jamais tes prompts, jamais les réponses de Claude, jamais la conversation.
- Recall ne garde **que les bouts que Clawkin a lui-même coupés** — la « corbeille » du trimming, rien d'autre. Cache local plafonné, en rolling.

C'est une promesse honnête et vérifiable, et c'est un argument de vente : « ta mémoire de commandes ne quitte jamais ta machine ».

---

## 8. Directions écartées (et pourquoi)

| Direction | Pourquoi écartée |
|---|---|
| **Dashboard comme produit payant** | Valeur qui décroît : vu 10 fois, on connaît sa moyenne, on n'y retourne plus. doc 06 §5 l'excluait déjà (« Clawkin n'est pas un dashboard »). Le dashboard peut exister côté free comme surface, jamais comme produit payant. |
| **Compression IA / worker Haiku** | Exige un LLM. Viole §2. Supersede doc 18 §7 : il n'y aura pas d'upgrade Haiku V2. |
| **Smart Routing / agents secondaires** (doc 14) | (a) On ne peut pas changer le modèle d'une session Claude Code en cours (`/model` fixé par session). (b) Le contournement « Foreman » exige un LLM → viole §2. (c) Même la version « Clawkin pousse Claude Code à utiliser ses sous-agents natifs » ne tient pas : un hook ne peut que *suggérer*, pas forcer → économies non fiables, invendable. Clawkin est le mauvais véhicule pour le routing. **doc 14 est fermé.** |
| **Brider l'utilitaire** (free = Pattern 1 seul, payant = Patterns 2-4 ; ou free = trimming conservateur) | Viole « le gratuit reste entier » (doc 06 §3). C'est du free volontairement cassé pour extorquer l'upgrade, pas une autre dimension. |
| **Identité / Feature 2 comme payant V1** | WTP molle (doc 14 §2 : « tip jar à 9 €/an »). Et Feature 2 est retirée de la V1 par doc 19. Peut revenir plus tard comme couche additionnelle — mais ce n'est pas le payant V1. Supersede doc 06 §5 pour la V1. |

---

## 9. Conséquences sur la landing (doc 19)

Ce doc débloque le build de la landing, avec ces ajustements vs le plan doc 19 :

- **Hero** : le message n'est pas « ta facture baisse » mais **headroom** — contexte qui tient, quota qui va plus loin, limites qu'on ne touche pas (§3).
- **Pricing** : afficher les 3 formules du §6. Une seule chose vendue : Recall.
- **Pact** : pacte de **transparence / privacy** (§7), pas money-back.
- **Retirer** tout claim de cash savings / « X % moins cher » (pitch segment API, hors cible).
- Le reste du plan doc 19 (InstallBar, DemoWindow montrant un output trimmé, identité visuelle) reste valide.

---

## 10. Questions ouvertes

- **Custom rules en payant secondaire** — éditer l'allowlist, config par projet, « ne jamais trimmer cette commande ». Déterministe, marge pure, roadmappé par doc 18 §4. À confirmer comme second item du payant ou à laisser en free. Non tranché.
- **Plafond du cache Recall** — taille max vs rétention en jours, et la valeur exacte. À calibrer au build.
- **Forme exacte de l'exposition `clawkin grep`** — commande bash simple vs outil MCP. À trancher au build (n'impacte pas le pricing).
- **Feature 2 (identité)** — si elle ship un jour, est-elle incluse dans le payant Recall, un tier séparé, ou du free ? Hors scope V1.
