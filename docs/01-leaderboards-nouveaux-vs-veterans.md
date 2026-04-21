# 01 — Problème : le nouveau vs le vétéran dans le leaderboard

> **Note de priorisation (2026-04-21)** : ce brainstorm reste valide mais **son activation est différée à V2 post-launch**. Décision actée dans [docs/03-plg-levers.md](03-plg-levers.md). Raison : ship V1 en 2-3 semaines sans backend/auth/payment, via un badge README GitHub comme levier PLG principal. Le sujet "nouveau vs vétéran" redevient pertinent dès qu'on rallume le chantier leaderboard (signal : 500+ installs + rétention J30 > 30%).

> Brainstorm en cours, rien n'est figé. On consigne le problème et les premières pistes pour y revenir.

---

## Le problème

Un utilisateur avec 3 ans d'exécution a accumulé streak, niveau, et rareté de créatures. Un nouvel arrivant qui exécute parfaitement dès son premier mois n'a aucune chance de remonter un leaderboard "absolu" basé sur l'ancienneté cumulée.

Conséquences si on ne règle pas ça :
- Le nouveau n'a rien à gagner visiblement avant des années → il décroche.
- Chaque pic viral d'acquisition (où arrivent massivement des nouveaux) meurt en quelques semaines faute de reconnaissance pour eux.
- Le positionnement "miroir de la qualité dev, pas du volume" perd de sa force si, de fait, c'est l'ancienneté qui gagne.

Ce n'est pas qu'un sujet de pondération dans la formule de progression (Q1). C'est un sujet de **design du leaderboard lui-même** : qu'est-ce qu'on choisit de mettre en lumière, et à quelles échelles.

---

## Contrainte parallèle déjà identifiée

La courbe de progression doit **tenir 10 ans**. Un vétéran doit toujours avoir une raison d'évoluer en année 10. Donc on ne peut pas non plus résoudre le problème du nouveau en aplatissant la progression du vétéran. Les deux contraintes doivent cohabiter.

---

## Ce que le brief base effleure déjà (section 7)

Le brief mentionne "plusieurs leaderboards en parallèle — top efficacité semaine, top streak, top évolution la plus rare, classement par pays. Chacun trouve une catégorie où il peut gagner. Modèle Strava et ses segments locaux."

Donc l'idée d'axes multiples est déjà posée. Ce qui n'est pas traité explicitement : **comment un nouveau peut gagner contre un vétéran sur un axe qui compte, dès son premier mois.**

---

## Piste évoquée — leaderboards géographiques imbriqués

Classements par quartier / ville / pays / monde. Un nouveau dev à Lyon peut être #1 Lyon en 3 semaines, même s'il est #50 000 mondial.

**Pourquoi c'est une bonne piste intuitive :**
- Modèle Strava des segments locaux, éprouvé psychologiquement.
- Fait émerger des identités locales, source de récits communautaires ("le #1 Tokyo vient de passer L500").
- Compatible avec l'architecture "plusieurs leaderboards" déjà prévue dans le brief.

**Risques à traiter :**
- Segments géographiques à faible densité = podiums vides ou grotesques (#1 d'un quartier à 2 utilisateurs).
- Nécessite une info de localisation → friction d'onboarding ou IP geo imparfaite.
- Possible maille minimale (ville seulement ? pays seulement ?) à déterminer en fonction de la densité réelle des utilisateurs.

---

## À brainstormer plus tard — autres angles possibles

Pas retenus, pas écartés, juste notés pour ne pas les perdre :
- Leaderboards temporels courts (top semaine / mois) qui remettent à zéro.
- Leaderboards par cohorte d'arrivée ("top des devs arrivés en 2026").
- Classements "rising star" — pente d'évolution plutôt que valeur absolue.
- Segments par stack / langage ("top dev Python cette semaine").
- Événements saisonniers ou challenges limités qui neutralisent ponctuellement l'avantage du vétéran.

---

## Questions ouvertes qui découlent de ce brainstorm

- Maille géographique minimale viable (ville ? région ? pays ?) pour éviter les segments vides.
- Y a-t-il un leaderboard "principal" ou la fragmentation EST l'UX par défaut ?
- Comment articuler ça avec la formule de progression (Q1) — le cap journalier protège déjà un peu les nouveaux, mais pas assez seul.
- Comment un nouveau sait, en arrivant, où il peut gagner ? (sinon l'axe multiple devient illisible)
