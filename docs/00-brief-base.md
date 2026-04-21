# Brief — Clawkin (Claude Code companion)

> Document de synthèse pour poursuivre le projet dans Claude Code.
> Reprend l'intégralité du brainstorm initial et toutes les décisions validées.

---

## 1. Contexte et motivation

Edouard explore un side project léger qui coche ses critères habituels : zéro support, solo-buildable, distribution PLG/virale, monétisation automatisable, pas d'appels commerciaux. Le brief initial de la session était :

> "Un jeu très simple et addictif, design minimaliste (2 couleurs, 3 interactions), avec une boucle de retour et une insertion dans un moment mort de la journée."

La réflexion a convergé sur **une créature ASCII qui vit dans le terminal et se nourrit de l'activité Claude Code**. Le slot d'insertion n'est pas le dino Chrome (hors d'accès) mais **la statusline de Claude Code** — une fonctionnalité officielle qui permet d'afficher du contenu custom au bas de l'interface, avec accès en temps réel aux données de session (modèle, % de contexte utilisé, coût, durée, etc.).

---

## 2. Le concept en une phrase

Une créature pixelisée (12×12 px, 2 couleurs) — un **Clawkin** — qui vit dans la statusline de Claude Code et dans le prompt shell, grandit en fonction de l'hygiène d'utilisation de Claude Code, et affiche publiquement un niveau allant de 1 à 10 000 — chaque niveau correspondant à un Clawkin unique partagé mondialement par tous les devs à ce niveau.

**Le produit est screenshottable.** En 3 secondes, un autre dev comprend le niveau et la discipline de celui qui poste. C'est le moteur viral principal.

---

## 3. Architecture technique

**Zéro daemon. Aucun processus ne tourne en arrière-plan.** L'installation se résume à l'édition de deux fichiers texte :

1. **`~/.zshrc` (ou bash/fish équivalent)** : ajout d'un hook qui s'exécute à chaque fois que le shell dessine son prompt. Modèle connu (Starship, oh-my-zsh, powerline). Coût CPU négligeable, zéro overhead quand inactif.

2. **`~/.claude/settings.json`** : déclaration de deux choses :
   - Des **hooks** sur les événements lifecycle de Claude Code : `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `PreCompact`, `SessionEnd`.
   - Une **statusLine** : un script shell que Claude Code appelle à chaque tick de rafraîchissement. Il reçoit un JSON sur stdin avec modèle, `context_window.used_percentage`, `cost.total_cost_usd`, durée de session, etc. Ce que le script imprime devient la barre du bas.

**État persisté** dans `~/.config/clawkin/state.json`. Un seul fichier JSON local. Sync cloud éventuelle plus tard.

**Installation IT-proof.** Édite deux fichiers texte, zéro admin, zéro daemon, zéro GUI. Désinstallation = retirer deux lignes. Contournement validé pour environnements corporate restrictifs (critère explicite d'Edouard qui ne peut pas installer Notion sur sa machine OC, mais peut éditer ses dotfiles).

---

## 4. Les trois piliers non négociables

Toute feature future doit passer ces trois filtres. Si l'un tombe, le produit meurt.

1. **Zéro friction active.** Le dev ne "joue" jamais. Pas de `clawkin feed`, pas de micro-interactions obligatoires. Le Clawkin grandit seul, nourri par l'activité réelle. Toute action requise tue l'adoption chez une cible qui n'a pas le temps.

2. **Toujours visible.** Le Clawkin vit dans la statusline Claude Code (permanent pendant les sessions) et dans le prompt shell (entre les sessions). Jamais caché derrière une commande. S'il faut taper pour le voir, il n'existe pas.

3. **Screenshot instantanément lisible.** Un autre dev comprend le niveau et l'histoire en 3 secondes max. C'est le moteur viral. Toute complexité visuelle qui demande une légende = mort virale.

---

## 5. Les moments d'interaction

Trois couches, et rien d'autre.

**Passive en direct.** Le Clawkin dans la statusline Claude Code pendant les sessions — c'est LE slot équivalent dino Chrome : il bouge pendant que Claude réfléchit, réagit au % de contexte, à la durée de la task. Et dans le prompt shell entre les sessions.

**Événementielle automatique.** Les hooks Claude Code (`SessionStart`, `Stop`, `PreCompact`, etc.) mettent à jour l'état du Clawkin sans action utilisateur. Il grandit ou stagne selon la qualité de la session.

**Manuelle optionnelle.** Dans un autre terminal, pour ceux qui veulent : `clawkin`, `clawkin status`, `clawkin rank`, `clawkin evolve`. Jamais obligatoire, jamais indispensable.

**Note importante sur "pendant que Claude réfléchit"** : l'utilisateur ne peut pas taper une commande parallèle pendant que Claude Code tient le stdin. Mais il n'en a pas besoin — **regarder le Clawkin évoluer en direct dans la statusline EST l'interaction**. Passif mais hypnotique. C'est l'équivalent fonctionnel du dino, mais piloté par l'activité réelle au lieu d'être random.

---

## 6. Le mécanisme de nourriture

**Automatique, jamais manuel.** Chaque événement Claude Code génère un "pellet" :

- Task terminée avec succès → 1 pellet standard
- Task one-shot (pas de re-prompt dans les 60s suivantes) → pellet bonus
- Session fermée sous un seuil bas de contexte utilisé → pellet "propre"
- `PreCompact` déclenché pendant la session → 0 pellet ou malus (contexte saturé = mauvaise hygiène)
- Jour actif → ration journalière (1×/jour, une seule fois)

Le dev ne choisit jamais de nourrir. Il fait son travail, le Clawkin mange automatiquement.

**Définition de "bonne hygiène"** — trois métriques observables dès le départ via les données que Claude Code envoie déjà nativement :
1. % de contexte restant en fin de session
2. Taux de prompts one-shot (pas de re-prompt rapide)
3. Streak de jours actifs

Ces trois métriques se calibreront par A/B et observation du gaming behavior post-lancement. Démarrer simple et itérer bat théoriser pendant trois mois.

---

## 7. Le problème du volume — décisions architecturales

**Le piège à éviter absolument** : un dev qui fait 250 tâches/jour ne doit PAS écraser celui qui en fait 20 efficaces. Sinon on pousse au gaspillage et on exclut les utilisateurs légers.

Quatre mécaniques combinées :

1. **Cap journalier mou.** Plafond autour de 8-10 pellets/jour quelle que soit l'activité. Le dev à 250 tâches plafonne comme celui à 15.

2. **Multiplicateur qualité.** Score final = pellets × efficacité moyenne. Un dev propre à 20 tâches bat un dev brouillon à 250.

3. **Streak bat volume.** 30 jours d'affilée à 5 tâches/jour domine 300 tâches en 3 jours puis silence 3 semaines. Modèle Duolingo / GitHub contributions.

4. **Pas de mort, juste hibernation.** Le dev qui revient après 2 semaines d'absence retrouve son Clawkin endormi, un peu rapetissé, qui se réveille content. Punir l'absent est le meilleur moyen de ne jamais le revoir.

**Plusieurs leaderboards en parallèle** — top efficacité semaine, top streak, top évolution la plus rare, classement par pays. Chacun trouve une catégorie où il peut gagner. Modèle Strava et ses segments locaux.

**Conséquence narrative** : le "top 50 France" n'est pas dominé par les gros consommateurs d'API, mais par les devs disciplinés et réguliers. Positionnement commercial plus noble : **"le miroir de la qualité dev, pas du volume"**.

---

## 8. Le système d'évolution — créatures

**Level = créature partagée mondialement.** Tous les devs au même niveau ont la même créature. Ça crée :
- Un vocabulaire commun dans la communauté ("t'as passé le Level 250 ?")
- Un instinct Pokédex (je veux voir à quoi ressemble le L500)
- Des screenshots immédiatement comparables entre devs

**Architecture visuelle cible : 1000 formes majeures × 10 variantes = 10 000 looks uniques.**
- 1000 silhouettes distinctes en 12×12 pixels, 2 couleurs
- 10 variantes par silhouette (couleur différente, marque, posture légèrement variée)
- Saut visuel clair tous les 10 niveaux, logique d'évolution façon Pokémon

**12×12 plutôt que 10×10.** 10×10 étouffe et limite la lisibilité des silhouettes. 12×12 laisse la place à des formes distinctes et à des variantes reconnaissables.

**Mécanique "premier découvreur"** (moteur viral gratuit) : quand le premier dev au monde atteint un nouveau palier, son nom reste associé à vie à cette forme. Leaderboard public affiche : `Level 847 — découvert par @sarah_dev, 15 mars 2026`. Les gens courent pour tweeter leurs découvertes. Crée des identités de communauté : "le Level 500 a été découvert par un Français, le Level 1000 par un Japonais".

**Courbe de progression cible** (à calibrer mathématiquement) :
- L50 = dev actif sérieux après ~1 mois
- L250 = power user à ~6 mois
- L1000 = vétéran absolu à ~18-24 mois

Progression lente = protection du statut. C'est ce qui fait que les streaks Duolingo et les contribution graphs GitHub marchent encore.

---

## 9. Affichage concret dans la statusline

Format cible approximatif :

```
▣▤ L250 · 47d streak
```

Sprite 12×12 + numéro de level + streak en jours. Trois signaux lisibles, ~20 caractères. Screenshotable, compréhensible en 3 secondes.

---

## 10. Monétisation — pricing final validé

**Positionnement :** gratuit fonctionnel, payant pour la gloire. Aligné avec ce que les devs achètent vraiment — du statut, pas des features.

### Free (tout le monde)
- Clawkin local installé
- Progression personnelle illimitée
- Accès en **lecture seule** au leaderboard mondial (on peut scroller, admirer, partager des screenshots)
- Accès aux micro-commandes locales (`clawkin status`, etc.)

### Solo Dev — 9€/an
- Tout le gratuit, plus :
- **Ton Clawkin apparaît dans le leaderboard mondial public** avec ton pseudo et ton pays
- Éligibilité à la reconnaissance "premier découvreur" quand tu débloques un nouveau palier
- Badge vérifié sur tes screenshots

*Pourquoi pas 5€ ?* En dessous de ~7€, les frais Stripe (0,30€ + 2,9%) bouffent ~10% du prix. À 9€ la marge reste saine et ça reste dans la zone d'achat impulsif pour un dev.

*Pourquoi annuel et non lifetime ?* Lifetime engage à héberger un leaderboard à perpétuité pour un paiement unique, avec risque de support à long terme. Annuel ramène l'utilisateur 1×/an, permet d'ajuster le prix sur le renouvellement, et le 9€/an passe mieux qu'un 30€ lifetime pour la décision d'achat.

### Équipe — 5 à 7€/dev/mois (minimum 5 sièges)
- Tout le Solo Dev, plus :
- **Leaderboard interne à la boîte** sur la même URL (classements dev vs. dev, équipe vs. équipe au sein de la société)
- Stats agrégées d'hygiène Claude Code au niveau équipe
- Notifications Slack quand un dev de la team level-up
- Dashboard admin pour le CTO / lead

**Argumentaire CTO** : encourage les bonnes pratiques sans flicage individuel (on regarde les patterns d'équipe). **Argumentaire dev** : c'est fun et ça rend leur travail visible.

### Cible économique
5-10k€/mois atteignable majoritairement via le tier Équipe en 12-18 mois. Estimation : 70-130 équipes actives de 10-15 devs. Le tier Solo Dev contribue de manière plus volatile (dépend des pics viraux) mais cumulable.

### Séquencement de lancement
1. **Mois 0-6** : focus viralité absolue. Tier Solo Dev activé dès le départ à 9€/an (simple à opérer), mais communication centrée sur la communauté et la gratuité du cœur du produit.
2. **Mois 6-12** : lancement tier Équipe une fois que le produit Solo Dev a atteint ~10k installs et une communauté visible. Le B2B bénéficie alors du "déjà-connu-par-les-devs".

---

## 11. Stratégie vs Anthropic et concurrents

**Rester Claude-Code-exclusif.** Zéro support Cursor, Copilot, Cody, Windsurf. Contre-intuitif parce que ça limite le marché, mais ça fait du produit un asset stratégique pour Anthropic (qui n'achète jamais de produit multi-plateformes) et un non-sujet pour leurs concurrents (qui n'ont aucun intérêt à copier un outil taggé "Claude"). Un produit multi-IDE devient clonable par n'importe qui. Un produit mono-Claude-Code devient soit rachetable, soit protégeable, jamais ignorable.

**Construire la communauté, pas le code.** Le code est reconstructible en une semaine par un ingé Anthropic. Ce qui ne se reconstruit pas : 50k devs engagés, une Discord active, un hashtag qui tourne. Les utilisateurs et la marque sont le vrai asset défendable.

**Build-in-public dès jour 1.** Publier sur Twitter/Bluesky dès la première ligne de code. Nom d'Edouard associé au produit dès l'origine.

**Ne pas construire POUR Anthropic, construire pour les devs.** Piège classique à éviter : optimiser pour un acquéreur imaginaire au lieu de plaire aux users. Les deux divergent vite.

**L'acquisition comme assurance, pas comme objectif.** Ne pas viser un exit : viser à ne pas être rayé de la carte si Anthropic ship un concurrent officiel. Scénarios viables : (a) partenariat dans le plugin marketplace officiel, (b) co-marketing DevRel, (c) rachat éventuel à 1-5M€ si le produit devient la référence communautaire, (d) candidats alternatifs (Warp, Raycast, JetBrains) si Anthropic ne bouge pas.

---

## 12. Risques identifiés

1. **Anthropic ship son propre concurrent officiel.** Parade : vitesse d'exécution, marque reconnaissable, Discord active avant qu'ils y pensent. Le produit n'a pas 6 mois pour démarrer — il a 3 mois.

2. **Calibration volume ratée.** Parade : cap journalier + multiplicateur qualité + streak, testés sur simulation 30-90 jours avant lancement public.

3. **Cible 5-10k€/mois trop ambitieuse.** Parade : séquencement en deux phases, priorité B2B en Phase 2 qui est le vrai moteur économique.

4. **Distribution insuffisante.** Parade : Claude-Code-natif (cible >100k utilisateurs), présence sur GitHub / plugin marketplace / build-in-public, hook viral "premier découvreur" par palier.

---

## 13. Critères de validation avant de scaler la monétisation

Avant de pousser le tier Équipe (Phase 2) :
- 10 000 installs cumulés
- Rétention J30 > 40%
- Taux de partage mesurable (hashtag, mentions)
- Au moins 3 paliers de level découverts publiquement avec impact social

---

## 14. Trois questions ouvertes à traiter en priorité dans Claude Code

Les décisions ci-dessus sont actées sauf contre-ordre. Les questions suivantes restent à trancher et sont les prochaines étapes logiques.

### Question 1 — Formule mathématique de progression

Combien de pellets par level, quelle courbe pour que L50 prenne ~1 mois, L250 ~6 mois, L1000 ~18-24 mois, avec les caps de volume intégrés ?

Livrable attendu :
- Formule mathématique (probablement exponentielle ou racine, à déterminer)
- Simulation sur 30, 90, 180, 365 jours pour trois profils de dev : "efficace faible volume", "moyen régulier", "gros volume brouillon"
- Vérification que le bon profil gagne à chaque horizon
- Ajustement des coefficients du cap journalier et du multiplicateur qualité

### Question 2 — Générateur algorithmique de formes

Comment produire 1000 silhouettes distinctes et reconnaissables en 12×12 pixels, 2 couleurs, organisées en familles visuelles qui évoluent par niveau ?

Livrable attendu :
- Liste des familles (mammifère, reptile, oiseau, alien, objet, abstrait, mythologique, etc.)
- Règles de combinaison de primitives (silhouette de base + tête + membres + marques + accessoires)
- Système de variantes par palier (10 variantes par silhouette majeure)
- Prototype d'un générateur qui produit les 100 premières créatures de manière déterministe (même seed = même résultat, pour la cohérence cross-devs au même level)

### Question 3 — Nom du produit et landing page

Trouver le nom et le positionnement marketing initial.

Livrable attendu :
- Nom (court, brandable, mémorable, domaine `.com` ou `.dev` disponible)
- Tagline (une phrase qui explique le Clawkin en termes de statut dev, pas en termes de fonctionnalité)
- Pitch de 30 secondes pour le premier thread build-in-public sur Twitter/Bluesky
- Structure de la landing page v0 (3 sections max : hero, demo GIF, install en une ligne)
