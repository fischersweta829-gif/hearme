# Kenyan Youth Distress-Pattern Platform: Architecture & Requirements

* A Behavioral Clustering and BERT-Based NLP Model for Identifying Emotional Distress Patterns in Anonymous Online Interactions Among Kenyan Youth*

---

## 1. What the app is

Two faces on one platform:

| Side | Users | Purpose |
|---|---|---|
| **Youth space** | Anonymous / pseudonymous young people | Check-ins, journaling, anonymous community, resources, predefined supportive responses, crisis help |
| **Insight dashboard** | Counsellors, researchers, admin | Sentiment results, K-Means clusters, model comparison (text-only vs behaviour-only vs combined), annotation, lexicon management |

**Design rules taken from your proposal (Sections 1.6, 3.7):**
- Outputs are *potential distress-related patterns*, never clinical diagnoses. Say this in the UI.
- Dashboards are **aggregate-first**. Individual-level views are restricted to staff roles and logged.
- Pseudonymous accounts, hashed identifiers, no re-identification, consent screen, guardian consent flow for minors.
- A crisis protocol (hotline links, escalation to a human) must exist before any real user data is used.

---

## 2. High-level architecture

```
┌────────────────────┐      HTTPS/JSON       ┌─────────────────────────┐
│  Next.js frontend  │ ───────────────────▶  │  Next.js API routes /   │
│  (app/ directory)  │                       │  Node backend (auth,    │
└────────────────────┘                       │  CRUD, roles)           │
                                             └───────────┬─────────────┘
                                                         │
                                  ┌──────────────────────┼──────────────────────┐
                                  ▼                                             ▼
                        ┌──────────────────┐                        ┌────────────────────┐
                        │ PostgreSQL       │                        │ FastAPI ML service │
                        │ (users, posts,   │                        │ BERT + K-Means +   │
                        │ features, labels)│                        │ fusion classifier  │
                        └──────────────────┘                        └────────────────────┘
```

**Why a separate Python service:** your model stack (PyTorch, Hugging Face Transformers, scikit-learn) is Python. Next.js talks to it over REST. Keep it as its own folder/deployable.

**Suggested stack**

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind, shadcn/ui |
| Charts | Recharts (cluster scatter, sentiment trends, confusion matrix) |
| Auth | NextAuth/Auth.js or Supabase Auth (role claims in JWT) |
| DB | PostgreSQL (Supabase/Neon) + Prisma or Drizzle |
| ML service | FastAPI, PyTorch, Hugging Face Transformers, scikit-learn, pandas |
| Offline (your contribution #5) | PWA + service worker, IndexedDB queue, background sync |
| Hosting | Vercel (frontend), Render/Railway/HF Spaces (ML service) |

---


---

## 4. Roles & route access (`middleware.ts`)

| Role | Access |
|---|---|
| `youth` | `/home`, `/checkin`, `/journal`, `/community`, `/support`, `/resources`, `/crisis`, `/messages`, `/settings` |
| `counsellor` | Above + `/dashboard/alerts`, `/dashboard/posts` (limited), `/messages` |
| `researcher` | `/dashboard/*` except admin and alerts detail; aggregate and pseudonymised data only |
| `admin` | Everything + `/admin/*` |

---

## 5. Core data model (tables)

- `users` (id, pseudonym, role, age_band, consent_at, guardian_consent, language_pref)
- `posts` (id, user_id, source: `app|reddit|x|dataset`, text_clean, lang, created_at)
- `post_features` (post_id, bert_embedding_ref, pca_vec, sent_probs, distress_flag, sheng_flag, code_switch_ratio)
- `user_behaviour` (user_id, window, post_freq, active_hours_hist, freq_drift, interaction_ratio)
- `cluster_assignments` (post_or_user_id, model_version, cluster_id, dist_to_centroid)
- `predictions` (id, post_id, model_id, label, probs, created_at)
- `labels` (post_id, label, source: `public|weak|manual`, annotator_id)
- `models` (id, type, version, metrics_json, trained_at, config_json)
- `alerts` (id, prediction_id, status, reviewed_by, action_taken)
- `audit_log` (actor_id, action, target, ts)
- `lexicon` (term, lang, category, added_by)

---

## 6. API contract (backend ⇄ ML service)

| Endpoint | Input | Output |
|---|---|---|
| `POST /sentiment` | `{text}` | `{lang, emotion_probs, sentiment, distress_flag}` |
| `POST /cluster/assign` | `{text_feats, behaviour_feats}` | `{cluster_id, dist_to_centroid}` |
| `POST /predict` | `{post_id}` | `{label, probs, cluster_id, explanation}` |
| `GET /cluster/summary` | `?model_version` | centroids, sizes, silhouette, DB index |
| `POST /train/{bert\|kmeans\|fusion}` | config | job id |
| `GET /evaluate/{model_id}` | n/a | P/R/F1, confusion matrix, CI, significance tests |

---

## 7. What you need, checklist

### Data
- [ ] Ethics clearance (university) + Kenya Data Protection Act (2019) compliance notes
- [ ] Public datasets: AfriSenti (Swahili), RideKE (code-switched), Reddit mental-health sets, others from your lit review
- [ ] Reddit/X access within platform terms (API keys, rate limits)
- [ ] Sheng + distress lexicon (start with 200–500 terms, grow with annotators)
- [ ] Annotation guide + 2–3 trained annotators; Cohen's kappa target
- [ ] 70/15/15 stratified split, **user-level** where IDs exist

### Models
- [ ] Baselines: TF-IDF + LR/SVM, lexicon sentiment
- [ ] Encoders to compare: mBERT, XLM-R, AfroXLMR/serengeti-style African models, one social-media model
- [ ] K-Means: z-score, elbow + silhouette + Davies–Bouldin, multi-seed stability
- [ ] Fusion: PCA(BERT) + probs + behaviour + cluster label + distance → LR / RF / gradient boosting
- [ ] Ablation: text-only vs behaviour-only vs combined; McNemar / paired bootstrap

### Frontend
- [ ] Design system (Tailwind + shadcn), dark mode, mobile-first (youth are on phones)
- [ ] English + Kiswahili UI strings
- [ ] PWA / offline-first (service worker, IndexedDB queue)
- [ ] Accessibility pass (contrast, screen readers, low-bandwidth mode)

### Safety & ethics (build these early, not last)
- [ ] Crisis page + persistent banner with Kenyan hotlines (verify numbers before launch)
- [ ] Human-in-the-loop alert review; the model never contacts or labels a user automatically
- [ ] Disclaimer on every insight view: research tool, not diagnosis
- [ ] Audit log for every staff view of individual content
- [ ] Data deletion/export in `/settings`
- [ ] Predefined (non-generative) support responses, reviewed by a mental-health professional

### Infrastructure
- [ ] GitHub repo, `.env.example`, seeds/random-seed logging for reproducibility
- [ ] Dockerfile for `ml-service` ---redis localhost
- [ ] GPU for fine-tuning (Colab / Kaggle is fine for a capstone)
- [ ] CI: lint + type-check + a few ML unit tests

---


## 9. Mapping to your objectives

| Objective | App pieces |
|---|---|
| 1. Identify linguistic & behavioural features | `lexicon`, `features_*.py`, `dashboard/sentiment`, `active_hours_heatmap` |
| 2. BERT-based NLP model | `bert_model.py`, `/sentiment`, `dashboard/models` |
| 3. K-Means behavioural clustering | `kmeans_model.py`, `dashboard/clusters/*` |
| 4. Combined model + evaluation | `fusion.py`, `/predict`, `dashboard/models/[id]`, `error-analysis` |