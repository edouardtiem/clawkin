# 17 — Feature 1 (Token Routing) — Spec implementation détaillée

> Spec de build pour la première feature de Clawkin : économies de tokens par délégation Haiku. À déclencher **seulement après validation J+8** (cf [docs/15](15-validation-plan-1-week.md)). Estimation : 6-10 semaines solo. Stack 100% locale côté user, backend minimal (Stripe + Supabase + Resend).

---

## 1. Objectif et scope V1

### Ce que Feature 1 fait

- Économise 20-40% sur la facture Claude Code de l'user via délégation invisible
- Mesure les économies en temps réel et les expose dans un dashboard local
- Garantit la valeur via money-back automatique mensuel
- Zéro daemon, zéro upload côté user (sauf Stripe events + pings de health)

### Ce que Feature 1 ne fait PAS

- Pas de créature visible (Feature 2)
- Pas de levels, pas de gamification (Feature 2)
- Pas de team, pas de dashboard partagé (Feature 3)
- Pas de cross-IDE (Feature 3)
- Pas de ML, pas de classifier neural (V1 = rules-based)

---

## 2. User journey complet

### Install (J0)

```
$ curl -sL clawkin.sh/install | sh
```

Le script :
1. Détecte le shell (zsh/bash/fish) et OS
2. Crée `~/.config/clawkin/` (state.json + cache.json + key.enc)
3. Ajoute hooks dans `~/.claude/settings.json` :
   - `PreToolUse` → `~/.config/clawkin/hooks/pre-tool-use.mjs`
   - `PostToolUse` → `~/.config/clawkin/hooks/post-tool-use.mjs`
4. Ajoute statusLine dans `~/.claude/settings.json`
5. Demande la clé API Anthropic (BYOK) : prompt interactif, stockée encryptée dans `~/.config/clawkin/key.enc` (libsodium ou OS keychain selon plateforme)
6. Affiche : *"Clawkin installed. Run Claude Code as usual — we'll start tracking."*

### Baseline week (J0-J7)

**Mode passif** : hooks logguent les patterns mais **n'interceptent pas**. Objectif : établir le burn rate de référence de l'user.

Dashboard affiche : *"Calibrating your baseline. Active interception starts on day 7."*

### Active mode (J7+)

À partir du jour 7, les hooks interceptent selon les rules. Le dashboard montre les savings en temps réel.

### Première semaine active (J7-J14)

- L'user voit son dashboard se remplir : *"Saved 2.4k tokens today ($0.07)"*
- Statusline affiche : *`⡧⡂ saved $X.YY today`*
- Email J+10 : *"Your first week with Clawkin — X tokens saved, $Y estimated."*

### Upgrade prompt (quand savings cumulées > $18)

Un user en trial (14 jours gratuits) qui a déjà accumulé $18+ de savings reçoit :
- Banner dashboard : *"You've already saved $18.40. Subscribe for $9 to keep going (money-back if you save less than $18 next month)."*
- Email transactionnel avec lien Stripe Checkout

### Steady state

User paye 9€/mo. Dashboard refreshé en continu. Money-back auto déclenché en fin de mois si savings cumulées du mois < 18€. Stripe refund automatique, email de confirmation.

---

## 3. Architecture technique détaillée

### 3.1 Composants

```
[Claude Code session]
  ↓ tool calls
[Hooks: pre/post-tool-use.mjs]                  ← Node, exécuté par Claude Code
  ↓ si intercepted
[Worker: haiku-dispatch.mjs]                    ← Node, appel API Anthropic Haiku
  ↑                                               BYOK lu depuis ~/.config/clawkin/key.enc
  ↓ résumé condensé
[Hooks retourne résumé à Claude Code]
  ↓
[State: ~/.config/clawkin/state.json]           ← updated atomically (write+rename)

[Statusline: ~/.config/clawkin/statusline.sh]   ← lit state, imprime indicator
[Dashboard: ~/.config/clawkin/dashboard.html]   ← single-file HTML, lit state via fetch local

[Backend: Vercel edge functions]
  - api/health-ping       ← daily ping, KV store de savings cumulées (anti-fraude refund)
  - api/checkout          ← Stripe Checkout session
  - api/webhook           ← Stripe webhook → Supabase
  - api/refund-check      ← cron mensuel, vérifie savings vs subscription, trigger refund
```

### 3.2 Schema state local (`~/.config/clawkin/state.json`)

```json
{
  "version": "1.0",
  "user_id": "uuid-anonyme-local",
  "install_date": "2026-05-19T10:00:00Z",
  "baseline_complete_at": "2026-05-26T10:00:00Z",
  "subscription_status": "trial" | "active" | "cancelled",
  "subscription_email": "user@example.com",
  "current_month_savings_cents": 4523,
  "current_month_start": "2026-06-01T00:00:00Z",
  "lifetime_savings_cents": 184320,
  "dispatches": [
    {
      "ts": "2026-05-27T14:32:01Z",
      "pattern": "bash_truncate",
      "tokens_intercepted": 2400,
      "tokens_delivered": 380,
      "tokens_haiku_used": 1200,
      "savings_cents": 7
    }
  ],
  "patterns_calibration": {
    "bash_threshold_lines": 200,
    "read_threshold_lines": 500,
    "grep_threshold_matches": 10
  }
}
```

**Atomic writes** : tous les updates passent par `write-temp + rename` pour éviter la corruption. `dispatches` est tronqué aux 30 derniers jours (rolling window).

### 3.3 Schema backend Supabase

Une seule table V1 :

```sql
CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  status text NOT NULL,           -- 'trial', 'active', 'cancelled'
  current_month_savings_cents int DEFAULT 0,
  current_month_start timestamptz,
  refund_triggered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

`current_month_savings_cents` est pushé chaque jour par le ping (`api/health-ping`) depuis le state local. C'est ce chiffre qui sert au money-back automatique (anti-fraude : on ne fait pas confiance au state local seul, mais on ne stocke pas non plus le détail de chaque dispatch côté serveur).

---

## 4. Patterns d'interception V1 (rules-based)

### 4.1 Pattern 1 — Bash output truncation

**Trigger** : `PostToolUse` avec `tool_name === "Bash"` ET `output.length > 200 lines`.

**Action** :
- Spawn worker Haiku avec prompt : *"Summarize this bash output in 5-10 lines. Preserve errors, warnings, and final result. Drop verbose progress logs."*
- Worker retourne un résumé compact
- Hook remplace le `tool_result` injecté dans la session par le résumé + *"[Clawkin: truncated 387 lines → summary]"*

**Économie** : (output_lines × avg_tokens_per_line - summary_tokens) × $tokens_input_sonnet_price - $haiku_call_cost.

**Garde-fou** : si le bash output contient un pattern *"error"*, *"fail"*, *"exception"* dans les 20 dernières lignes, **ne pas intercepter** — on laisse Claude voir le détail brut. Better miss savings than miss errors.

### 4.2 Pattern 2 — File read dedup

**Trigger** : `PreToolUse` avec `tool_name === "Read"` ET le hash du fichier == hash de la dernière lecture du même fichier dans la session courante.

**Action** :
- Court-circuite la lecture
- Injecte dans le contexte : *"[Clawkin: file unchanged since first read at T+12:08 — refer to lines X-Y above]"*

**Économie** : tokens du fichier complet économisés.

**Garde-fou** : invalidation immédiate du hash dès qu'un `Edit`/`Write` touche le fichier.

### 4.3 Pattern 3 — Grep results delegation

**Trigger** : `PreToolUse` avec `tool_name === "Grep"` ET pattern attendu à `> 10 matches` (pre-flight estimation simple ou laisser passer + observer).

**Action** :
- Laisse passer le Grep (output = liste de matches)
- Si liste > 10 lignes : spawn worker Haiku avec *"Group these matches by file. List the most relevant 5 files with 1-line context each. Drop noise."*
- Hook remplace le `tool_result` par le résumé

**Économie** : grep brut peut injecter 500-2000 lignes, résumé ~30 lignes.

### 4.4 Pattern 4 — Audit task pre-detection

**Trigger** : `UserPromptSubmit` hook qui détecte des patterns dans le prompt user :
- *"audit all X"*, *"find all uses of"*, *"list everything that"*, *"check every file"*, etc.

**Action** :
- **Ne pas intercepter directement** (trop intrusif)
- Au lieu : injecte un system reminder à Claude : *"[Clawkin tip: this task looks like a multi-file audit. Consider using a single bash command with grep -l or find, rather than multiple Read calls. Clawkin can dispatch the result to a Haiku worker if you do so.]"*
- Si Claude lance un grep/find comme suggéré → Pattern 3 prend le relais

**Économie** : indirecte mais souvent énorme (évite 20-50 Read individuels).

### 4.5 Patterns explicitement EXCLUS V1

- ❌ Edit / Write content interception (trop risqué, qualité Haiku insuffisante pour code production)
- ❌ Plan task delegation (Plan reste 100% sur Sonnet/Opus, c'est le cœur du raisonnement)
- ❌ Web fetch (output souvent imprévisible, garde-fou trop fragile)
- ❌ Tout pattern où Haiku peut introduire une erreur silencieuse

---

## 5. Worker Haiku — spec d'appel

### 5.1 Endpoint

Appel direct à l'API Anthropic Messages :
- Model : `claude-haiku-4-5-20251001` (Haiku 4.5)
- Max tokens output : 1024 (largement suffisant pour résumés)
- Temperature : 0.2 (déterministe pour cache hit)

### 5.2 Prompt template (par pattern)

Chaque pattern a son propre system prompt + user prompt template. Stocké dans `~/.config/clawkin/prompts/`.

Exemple — `bash_truncate.prompt.md` :

```
SYSTEM: You are a build log summarizer. Given a bash command output, produce a 5-10 line summary that preserves: (1) the final exit status, (2) any errors or warnings, (3) the key result. Drop progress bars, repeated lines, and verbose logs. Output plain text only, no markdown.

USER: Command: {{command}}
Output ({{n_lines}} lines):
{{output}}
```

### 5.3 Latency budget

- **Cible** : < 1s total (du trigger hook au retour du résumé)
- Si Haiku > 800ms : afficher dans statusline *"⡧⡂ ◐ working"* pour signal visible
- Si timeout > 5s : abort, laisser passer le tool call original, ne pas comptabiliser comme dispatch

### 5.4 Fallback / failures

| Cas | Comportement |
|---|---|
| Pas de clé API | Pas d'interception, dashboard affiche *"Add API key to enable savings"* |
| Clé API invalide | Disable temporarily, daily retry, notif user |
| Anthropic API 5xx | Skip ce dispatch, laisse passer le tool call original |
| Haiku timeout | Skip + log |
| Worker JSON parse fail | Skip + log + sample-keep pour debug |

---

## 6. Classifier V1 — rules concrètes

Le classifier décide : intercepter ou non ? Pas de ML V1.

```js
// pseudo-code, à implémenter en ~150 lignes Node
function shouldIntercept(tool_call, context) {
  // Pattern 1: Bash truncation
  if (tool_call.name === 'Bash' && tool_call.result.split('\n').length > 200) {
    if (!hasErrorPattern(tool_call.result, ['error', 'fail', 'exception'])) {
      return { pattern: 'bash_truncate', confidence: 'high' };
    }
  }

  // Pattern 2: File re-read
  if (tool_call.name === 'Read') {
    const cached = context.session.reads.get(tool_call.input.file_path);
    if (cached && cached.hash === hashFile(tool_call.input.file_path)) {
      return { pattern: 'file_dedup', confidence: 'high' };
    }
  }

  // Pattern 3: Grep heavy
  if (tool_call.name === 'Grep' && tool_call.result.split('\n').length > 10) {
    return { pattern: 'grep_summarize', confidence: 'medium' };
  }

  // Skip ambiguous cases
  return null;
}
```

**Règle d'or** : `confidence: 'high'` = intercept, `confidence: 'medium'` = intercept with extra logging for calibration, `null` = skip.

---

## 7. Mesure des économies

### 7.1 Formule par dispatch

```
saving_cents = (tokens_would_inject - tokens_actually_injected) × sonnet_input_price_cents_per_token
             - tokens_haiku_used × haiku_price_cents_per_token
```

Prix au 2026-05 (à mettre à jour dynamiquement via config) :
- Sonnet input : $3 / 1M tokens = $0.003 / 1k tokens
- Haiku input : $0.25 / 1M tokens (1/12 de Sonnet)
- Haiku output : $1.25 / 1M tokens

### 7.2 Compteur transparent

Le dashboard montre :
- Total savings du mois en cours
- Total savings cumulées lifetime
- Top 5 patterns par contribution
- Histogram des dispatches dans le temps (timeline scrub)

Chaque dispatch est cliquable → expand : *"Bash output truncated. 387 lines → 8 lines. Saved $0.07."*

### 7.3 Quality auto-verification (V1 simple, V2 full)

V1 : 1 dispatch sur 50 (échantillon aléatoire) est re-checké par Sonnet avec le prompt *"Did the Haiku worker capture the key information from this output? Yes/No + brief reason."* Si miss → flag dans le log, à reviewer manuellement.

V2 (post-PMF) : dry-run parallèle plus rigoureux, calibration continue.

---

## 8. Statusline indicator (minimal V1)

Format :
```
⡧⡂ saved $X.YY today · $Y.YY week
```

Cas spéciaux :
- Trial week : `⡧⡂ calibrating · day 3/7`
- Working : `⡧⡂ ◐ dispatching · today $X.YY`
- Error : `⡧⡂ ⚠ check dashboard`

Reste discret, monochrome, intégré au shell de l'user. **Pas de créature en V1.**

---

## 9. Dashboard local

### 9.1 Format

Single HTML file généré par le hook à chaque update, servi en local :
```
$ open ~/.config/clawkin/dashboard.html
```

Ou via commande CLI :
```
$ clawkin dashboard
# (ouvre le navigateur par défaut)
```

### 9.2 Contenu (sections)

```
┌────────────────────────────────────────────┐
│  ⡧⡂ Clawkin Dashboard                       │
├────────────────────────────────────────────┤
│  This month: $42.30 saved (4,230 tokens)   │
│  Subscription: $9 · Refund threshold: $18  │
│  Status: ✅ on track to keep your $9       │
├────────────────────────────────────────────┤
│  [Timeline scrub of dispatches]            │
│  Today  ▁▂▅█▇▆▃▂▁                          │
├────────────────────────────────────────────┤
│  Patterns this month:                      │
│  bash_truncate    62% · $26.20             │
│  grep_summarize   24% · $10.14             │
│  file_dedup       14% · $5.96              │
├────────────────────────────────────────────┤
│  Last 5 dispatches: [list, click to expand]│
└────────────────────────────────────────────┘
```

### 9.3 Tech

Pure HTML + Vanilla JS + une fonction `fetch('file:///~/.config/clawkin/state.json')`. Pas de framework, pas de bundler. ~300 lignes au total. Auto-refresh toutes les 5s en lisant le state.

---

## 10. Money-back automatique

### 10.1 Règle

- L'user paye 9€/mo (Stripe subscription)
- Threshold : savings cumulées du mois doivent être ≥ 2× subscription, donc **≥ 18€/mo**
- Si à la fin du mois, savings < 18€ → **refund automatique du mois** via Stripe API
- Email transactionnel : *"You saved €X this month, less than 2× your subscription. We refunded €9. Your subscription continues — cancel anytime if you'd rather opt out."*

### 10.2 Implementation

Vercel cron (`api/refund-check`) tourne le 1er de chaque mois :
1. Liste tous les `subscribers` actifs
2. Pour chaque : lit `current_month_savings_cents` (synchronisé via `api/health-ping` quotidien)
3. Si < 1800 cents → Stripe API call : `refunds.create({ charge: last_invoice_charge_id })`
4. Update `refund_triggered_at` dans Supabase
5. Send email via Resend
6. Reset `current_month_savings_cents = 0` et `current_month_start = first_of_new_month`

### 10.3 Anti-fraude (V1 light)

- `current_month_savings_cents` est pushé chaque jour par l'app. Si pas de ping pendant 5 jours → suspect, log mais ne pas bloquer (V1 ne flag pas).
- V2 (post-PMF) : auditer un échantillon de users avec re-calcul côté serveur depuis un push de logs partiels.

---

## 11. BYOK — sécurité de la clé API

### 11.1 Stockage

- **macOS** : Keychain (via `security` CLI) — `clawkin/anthropic-api-key`
- **Linux** : libsodium-encrypted file `~/.config/clawkin/key.enc`, passphrase dérivée du `user_id` (UUID install) + salt local
- **Windows** : Credential Manager via `cmdkey` ou similar

### 11.2 Accès

- Le worker `haiku-dispatch.mjs` lit la clé au démarrage
- Stockée en mémoire pendant la durée du process hook (durée d'une tool call)
- Jamais loggée, jamais uploadée

### 11.3 Rotation

CLI `clawkin set-key` permet à l'user de changer sa clé. Pas de UI pour V1.

---

## 12. Pricing flow

### 12.1 Trial → paid

1. Install → trial 14 jours automatique (pas de carte demandée)
2. Trial day 10 : email *"You've saved $X so far. Subscribe to keep going."*
3. Trial day 14 : dashboard banner *"Trial ends today. Subscribe for $9/mo."*
4. Si pas d'action : interception **désactivée** (dashboard reste accessible read-only)
5. CTA → Stripe Checkout (mode subscription, monthly, $9)
6. Webhook → Supabase insert/update → re-active interception

### 12.2 Stripe Checkout config

- Product : "Clawkin — Token Routing"
- Price : $9 / mo recurring
- Trial : non (déjà 14 jours offerts en local)
- Metadata : `clawkin_user_id` (uuid local)
- Success URL : `clawkin.sh/subscribed?session_id={CHECKOUT_SESSION_ID}`
- Cancel URL : `clawkin.sh/`

### 12.3 Cancellation

- Self-service via portail Stripe (1 lien dans dashboard)
- Au moment de la cancel : Stripe webhook → update Supabase `status = 'cancelled'`
- Local : interception désactivée à la fin de la période payée

---

## 13. Onboarding détaillé

### 13.1 Premier install

```sh
$ curl -sL clawkin.sh/install | sh

Clawkin installer (v1.0)
────────────────────────
✓ Detected: macOS, zsh, Claude Code v2.4.x
✓ Creating ~/.config/clawkin/
✓ Adding hooks to ~/.claude/settings.json
✓ Adding statusLine to ~/.claude/settings.json

Paste your Anthropic API key (sk-ant-...):
> sk-ant-***

✓ Key stored in Keychain
✓ Sending test ping to Anthropic... OK

Clawkin is installed.
- Trial: 14 days
- Subscription: $9/mo, money-back if savings < $18/mo
- Dashboard: clawkin dashboard

Run Claude Code as usual. We start calibrating now.
```

### 13.2 Uninstall

```sh
$ clawkin uninstall

This will:
- Remove hooks from ~/.claude/settings.json
- Remove statusLine from ~/.claude/settings.json
- Delete ~/.config/clawkin/
- Remove key from Keychain
- Cancel any active subscription (refund prorated)

Continue? [y/N]
```

---

## 14. Edge cases

| Cas | Comportement |
|---|---|
| User offline (pas d'API Anthropic) | Skip interception, laisse passer, log "offline" |
| Claude Code version trop ancienne | Détection à l'install, message *"Please upgrade Claude Code to v2.3+"* |
| Hook crash (Node error) | Try/catch global, fail silently, laisse passer le tool call, log |
| Concurrent sessions multiples | Lock-free : state utilise atomic rename + fcntl advisory lock optionnel |
| Disk full | Logs tronqués, state préservé, ne casse pas Claude Code |
| User révoque la clé Anthropic | Detected au prochain dispatch (401), disable + email user |
| Anthropic change le format JSONL | Hook detect version, ne casse pas, log "unsupported format", user notif |

---

## 15. Stack technique V1 — résumé

| Composant | Tech | Coût |
|---|---|---|
| Hooks Claude Code | Node.js (ESM, zéro dépendance) | 0€ |
| Worker Haiku | Node.js + fetch native | API Anthropic via BYOK (côté user) |
| State local | JSON + atomic rename | 0€ |
| Dashboard | HTML + Vanilla JS | 0€ |
| Statusline | Bash script lit JSON | 0€ |
| Backend Stripe webhook | Vercel edge function | 0€ free tier suffisant |
| Backend Stripe refund cron | Vercel cron mensuel | 0€ |
| Database | Supabase free tier | 0€ jusqu'à 500MB |
| Emails | Resend | 20€/mo (3000 emails) |
| Landing | Astro (existant) | 0€ Vercel free |
| Domaine | clawkin.sh (existant) | 12€/an |

**Coût total mensuel à 1000 users payants** : ~275€/mo (Stripe fees + Resend + domaine), marge ~96%.

---

## 16. Plan de build par sprints (post-validation GO)

### Sprint 1 (sem 1-2) — Foundation
- [ ] Installer script multi-plateforme (macOS / Linux)
- [ ] Hooks `pre-tool-use.mjs` + `post-tool-use.mjs` qui logguent (sans intercepter)
- [ ] State schema + atomic writes
- [ ] BYOK keychain integration (macOS focus, Linux fallback)

### Sprint 2 (sem 3-4) — Worker + interception
- [ ] Worker Haiku call + prompt templates pour Pattern 1 & 2
- [ ] Classifier rules V1 (Pattern 1 bash + Pattern 2 dedup)
- [ ] Savings calculation
- [ ] Mode passif (baseline) avec switch automatique J+7

### Sprint 3 (sem 5-6) — Dashboard + statusline
- [ ] Dashboard HTML local + auto-refresh
- [ ] Statusline indicator
- [ ] CLI commands : `clawkin dashboard`, `clawkin set-key`, `clawkin uninstall`
- [ ] Pattern 3 (Grep delegation) + Pattern 4 (audit pre-detection)

### Sprint 4 (sem 7-8) — Billing + landing
- [ ] Stripe Checkout integration
- [ ] Supabase setup + webhook handler
- [ ] Refund cron (mensuel)
- [ ] Emails Resend (trial, upgrade, refund)
- [ ] Landing Feature 1 sur `clawkin.sh` (rewrite ou route `/`)

### Sprint 5 (sem 9-10) — Beta privée + launch
- [ ] Beta privée 20 users issus des pre-orders H2 validation
- [ ] Fix bugs critiques (1 sem buffer)
- [ ] Public launch HN + r/ClaudeAI
- [ ] Monitoring : Stripe + Supabase + Vercel Analytics

---

## 17. Métriques à surveiller dès le ship

| Métrique | Comment | Seuil rouge |
|---|---|---|
| **Install → trial start** | Vercel Analytics + ping J0 | < 60% |
| **Trial → paid conversion** | Supabase | < 10% à J30 |
| **Median savings/user/mo** | Health ping aggrégé | < $15 (proche threshold refund) |
| **Refund rate** | Supabase `refund_triggered_at` | > 20% |
| **Churn monthly** | Stripe | > 8%/mo |
| **Quality auto-verify miss rate** | Sample dispatch checks | > 5% |

Si une métrique passe au rouge → review hebdo, ajustement, pas de panic-feature.

---

## 18. Hors scope V1 (à dater)

- Free tier (Feature 2 ou tier intermédiaire)
- Team tier (Feature 3)
- Cross-IDE (Feature 3)
- Multi-machine sync (Feature 3 prerequisite)
- Predictive billing (post Feature 3)
- Réinjection créature visuelle (Feature 2 stricto)
- Annual Report basé savings (Feature 2)

---

## 19. Dépendances externes

- **API Anthropic** : Haiku stable, pricing stable. Risque : Anthropic change de modèle / API. Mitigation : config dynamique du model name + price.
- **Stripe** : standard, faible risque.
- **Supabase / Vercel / Resend** : free tiers larges. Migration possible si besoin.
- **Format JSONL Claude Code** : risque de breaking change. Mitigation : version-check au boot du hook + fallback "désactivé proprement" si incompat.

---

## 20. Ce qui doit être vrai avant le sprint 1

- ✅ Validation J+8 passée à 3/3 (ou 2/3 avec ajustement validé)
- ✅ Décision marketing : nom de produit = "Clawkin" (acté), positioning landing = utility savings first
- ✅ Compte Stripe vérifié et live
- ✅ Pre-order list (~50 users issus de H2) prête à recevoir la beta
- ✅ Cette spec relue à froid 24h après écriture
