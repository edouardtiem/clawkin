# 03 — PLG levers et stratégie de viralité V1

> Décision stratégique actée (2026-04-21). Définit ce qui porte la viralité au launch et ce qui est différé.

---

## Contexte de la décision

Après itération sur la landing page, décision de **shipper V1 sans leaderboard** pour raccourcir la fenêtre de launch de 2-3 mois → 2-3 semaines. Le brief §10 (monétisation) s'appuyait intégralement sur le leaderboard → la monétisation suit le même décalage.

Le brief §12 rappelle qu'Anthropic pourrait shipper un concurrent officiel à tout moment — "3 mois pour démarrer, pas 6". Shipper lean est plus sûr que shipper complet en retard.

---

## Ce qui est dans V1

### 1. CLI Clawkin local
- Vit dans la statusline Claude Code + prompt shell
- Fed automatiquement par les hooks lifecycle
- État persisté dans `~/.config/clawkin/state.json`
- Évolution visuelle à chaque palier (10, 50, 100, etc.)

### 2. Badge GitHub README — levier PLG principal V1
- Endpoint : `GET clawkin.sh/u/:handle.svg`
- Rend un SVG live avec clawkin + level + streak
- Snippet d'install : `![Clawkin](https://clawkin.sh/u/you.svg)`
- Chaque profile README devient un panneau publicitaire permanent, indexé Google
- Effort dev : ~2 semaines (endpoint + génération SVG + protocole de push d'état depuis le CLI)

### 3. Screenshot statusline
- Levier viral inhérent : chaque screenshot terminal partagé par un dev = impression gratuite
- Zero effort dev additionnel (c'est l'effet secondaire naturel de la statusline)

### 4. Évolution visuelle du Clawkin aux paliers
- Chaque palier 10/50/100 = nouveau sprite
- Produit des moments screenshotables récurrents et passifs
- Effort dev : dépend du générateur de formes (voir docs/00 question ouverte Q2)

---

## Ce qui est différé à V2 (post-launch)

### Leaderboard mondial + local
- Apporte : hook "premier découvreur" (viral explosif), classements locaux Strava-like
- **Coût caché** :
  - Backend pour tracker l'activité server-side
  - Auth (GitHub OAuth ou Twitter OAuth)
  - Base de données utilisateurs + levels + streaks + géolocalisation
  - Opt-in privacy + modération anti-gaming
  - Stripe intégration pour le paid tier
- Estimation : 2-3 mois de dev solo → incompatible avec "ship en 3 semaines"

### Monétisation Solo Dev (9$/yr)
- Intrinsèquement liée au leaderboard public
- Sans leaderboard, rien à vendre à 9$/yr
- Activée en même temps que le leaderboard V2

### Tier Équipe (5-7$/dev/mois)
- Phase 2 du brief §10
- Post-leaderboard + post-traction Solo Dev (~10k installs cumulés)

---

## Signaux de bascule V1 → V2

Déclencher la construction du leaderboard quand **au moins deux** de ces signaux sont présents :

- 500+ installs cumulés réels
- Rétention J30 > 30% (proxy de stickyness du Clawkin)
- Demande récurrente dans la communauté (Discord / Twitter) pour un leaderboard
- Capacité à investir 2-3 semaines solo sur l'infra backend

Avant ces signaux, investir sur le leaderboard = construire un amplificateur pour une réalité encore vide.

---

## Risques acceptés

**Perte du hook "premier découvreur" au launch.** C'était le mécanisme le plus explosivement viral identifié dans le brief §8. Sans leaderboard, personne n'est "premier à atteindre L847" publiquement. Compensé par :
- Évolution visuelle du Clawkin → screenshots réguliers tout au long du parcours utilisateur
- Badge README → exposition organique linéaire et cumulative
- Screenshot statusline → levier inhérent à l'usage

**Croissance linéaire au lieu d'explosive.** Le profil de courbe attendue en V1 : adoption stable et régulière, sans pic viral. Acceptable tant qu'on atteint 500+ installs en 8-10 semaines pour débloquer V2.

**Pas de monétisation avant V2.** Le brief §10 acte déjà que les 6 premiers mois sont "focus viralité absolue" — cohérent avec le décalage.

---

## Leviers à explorer plus tard (post-V2)

- Spread en équipe (un dev installe → collègues voient en pair prog → install cluster)
- Weekly recap email "your clawkin this week"
- API / open data pour que la communauté build des visualisations
- Partenariat co-marketing Anthropic si l'opportunité se présente
- Marketplace officiel Claude Code (si/quand il sort)
