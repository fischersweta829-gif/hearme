# Kenyan Youth Distress-Pattern Platform: Architecture & Requirements

Capstone: *A Behavioral Clustering and BERT-Based NLP Model for Identifying Emotional Distress Patterns in Anonymous Online Interactions Among Kenyan Youth*

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

## 3. Folder structure

```
distress-platform/
├── app/                                  ← Next.js app directory (frontend)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx             ← pseudonym, age band, consent, guardian consent if <18
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── home/page.tsx                     ← youth home: today's check-in, mood streak, resources
│   ├── checkin/page.tsx                  ← quick mood + free-text check-in
│   ├── journal/
│   │   ├── page.tsx                      ← private entries list
│   │   └── [id]/page.tsx                 ← entry + sentiment/emotion feedback
│   ├── community/
│   │   ├── page.tsx                      ← anonymous feed
│   │   └── [id]/page.tsx                 ← thread view
│   ├── support/page.tsx                  ← predefined AI-support responses (controlled, not free-generation)
│   ├── resources/page.tsx                ← Kenya hotlines, articles, offline-cached content
│   ├── crisis/page.tsx                   ← always-reachable help page
│   ├── messages/
│   │   ├── page.tsx                      ← peer / counsellor chat list
│   │   └── [id]/page.tsx
│   ├── saved/page.tsx
│   ├── profile/page.tsx
│   ├── settings/page.tsx                 ← privacy, data export/delete, language (EN / Kiswahili), dark mode
│   │
│   ├── dashboard/                        ← staff / researcher area
│   │   ├── page.tsx                      ← overview KPIs, sentiment trend, cluster sizes, alerts
│   │   ├── sentiment/page.tsx            ← sentiment/emotion distribution, language breakdown
│   │   ├── clusters/
│   │   │   ├── page.tsx                  ← PCA/UMAP scatter, k selection (elbow, silhouette)
│   │   │   └── [id]/page.tsx             ← centroid, representative posts, feature distributions
│   │   ├── posts/
│   │   │   ├── page.tsx                  ← filterable table (language, cluster, score)
│   │   │   └── [id]/page.tsx             ← post + prediction + explanation (LIME/attention)
│   │   ├── models/
│   │   │   ├── page.tsx                  ← text-only vs behaviour-only vs combined comparison
│   │   │   ├── [id]/page.tsx             ← precision, recall, F1, confusion matrix, bootstrap/McNemar
│   │   │   └── train/page.tsx            ← trigger fine-tune / re-cluster jobs, view logs
│   │   ├── datasets/page.tsx             ← upload, dedupe, anonymise, split status
│   │   ├── annotation/
│   │   │   ├── page.tsx                  ← annotation queue
│   │   │   └── agreement/page.tsx        ← Cohen's kappa
│   │   ├── lexicon/page.tsx              ← Sheng / distress-expression lexicon editor
│   │   ├── alerts/
│   │   │   ├── page.tsx                  ← flagged items needing human review
│   │   │   └── [id]/page.tsx             ← review + crisis protocol actions
│   │   ├── error-analysis/page.tsx       ← misclassified: sarcasm, slang, code-switching
│   │   └── reports/page.tsx              ← export figures/tables for your thesis
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── users/page.tsx                ← roles, suspensions
│   │   ├── reports/page.tsx              ← community moderation queue
│   │   └── audit/page.tsx                ← who viewed what (access log)
│   │
│   ├── components/
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx                   ← dashboard nav
│   │   ├── notification_bell.tsx
│   │   ├── spinner.tsx
│   │   ├── crisis_banner.tsx             ← persistent "need help now?" link
│   │   ├── consent_modal.tsx
│   │   ├── disclaimer_banner.tsx         ← "research tool, not a diagnosis"
│   │   ├── mood_picker.tsx
│   │   ├── post_card.tsx
│   │   ├── language_badge.tsx            ← EN / SW / Sheng / mixed
│   │   ├── sentiment_chip.tsx
│   │   ├── block_button.tsx
│   │   ├── report_modal.tsx
│   │   ├── follow_button.tsx             ← optional, drop if community stays anonymous
│   │   └── charts/
│   │       ├── cluster_scatter.tsx
│   │       ├── elbow_silhouette.tsx
│   │       ├── sentiment_trend.tsx
│   │       ├── confusion_matrix.tsx
│   │       ├── model_compare_bar.tsx
│   │       └── active_hours_heatmap.tsx  ← late-night activity pattern
│   │
│   ├── lib/
│   │   ├── api.ts                        ← all API calls (backend + ML service)
│   │   ├── auth.ts                       ← session helpers, role checks
│   │   ├── anonymise.ts                  ← client-side pseudonym helpers
│   │   ├── offline.ts                    ← IndexedDB queue + sync
│   │   ├── push.ts                       ← Web Push subscription
│   │   ├── i18n.ts                       ← English / Kiswahili strings
│   │   └── theme.ts                      ← dark mode helper
│   │
│   ├── layout.tsx
│   ├── page.tsx                          ← landing page
│   ├── globals.css
│   └── middleware.ts                     ← route protection by role (youth / counsellor / researcher / admin)
│
├── public/
│   ├── manifest.json                     ← PWA
│   └── sw.js                             ← service worker (offline-first)
│
├── ml-service/                           ← Python (FastAPI)
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── sentiment.py              ← POST /sentiment  (BERT emotion/sentiment probs)
│   │   │   ├── cluster.py                ← POST /cluster/assign, GET /cluster/summary
│   │   │   ├── predict.py                ← POST /predict    (fusion classifier)
│   │   │   ├── train.py                  ← POST /train/{bert|kmeans|fusion}
│   │   │   └── evaluate.py               ← GET /evaluate/{model_id}
│   │   ├── services/
│   │   │   ├── preprocess.py             ← clean, dedupe, normalise, lang-ID
│   │   │   ├── features_text.py          ← embeddings, lexicon flags, code-switch ratio
│   │   │   ├── features_behaviour.py     ← posting freq, active hours, frequency drift, interaction ratio
│   │   │   ├── bert_model.py             ← load/fine-tune mBERT, AfroXLMR, etc.
│   │   │   ├── kmeans_model.py           ← z-score, k selection, labels + distance-to-centroid
│   │   │   ├── fusion.py                 ← PCA(BERT) + behaviour + cluster feats → classifier
│   │   │   └── explain.py                ← LIME / token attributions
│   │   ├── schemas.py                    ← Pydantic request/response models
│   │   └── config.py
│   ├── training/
│   │   ├── 01_eda.ipynb
│   │   ├── 02_finetune_bert.ipynb
│   │   ├── 03_kmeans.ipynb
│   │   ├── 04_fusion_and_ablation.ipynb
│   │   └── 05_error_analysis.ipynb
│   ├── data/
│   │   ├── raw/                          ← git-ignored
│   │   ├── processed/                    ← git-ignored
│   │   └── lexicon/sheng_distress.csv
│   ├── artifacts/                        ← saved models, scalers, PCA, k-means (git-ignored)
│   ├── requirements.txt
│   └── Dockerfile
│
├── prisma/schema.prisma                  ← DB schema
├── .env.example
└── README.md
```

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

### Infra
- [ ] GitHub repo, `.env.example`, seeds/random-seed logging for reproducibility
- [ ] Dockerfile for `ml-service`
- [ ] GPU for fine-tuning (Colab / Kaggle is fine for a capstone)
- [ ] CI: lint + type-check + a few ML unit tests

---

## 8. Build order (suggested)

1. **Week 1–2:** Repo, auth + roles, DB schema, landing page, layout/navbar/theme
2. **Week 3–4:** Data pipeline notebooks, preprocessing, lexicon v1, baselines
3. **Week 5–6:** Fine-tune BERT variants → `/sentiment` endpoint → journal/check-in showing sentiment
4. **Week 7:** K-Means + behaviour features → `/cluster/*` → dashboard cluster pages
5. **Week 8:** Fusion + ablation → `/dashboard/models`, confusion matrix, significance tests
6. **Week 9:** Alerts, crisis flow, audit log, annotation UI
7. **Week 10:** Offline/PWA, i18n, error analysis, polish
8. **Week 11–12:** Evaluation write-up, export figures, demo data, documentation

---

## 9. Mapping to your objectives

| Objective | App pieces |
|---|---|
| 1. Identify linguistic & behavioural features | `lexicon`, `features_*.py`, `dashboard/sentiment`, `active_hours_heatmap` |
| 2. BERT-based NLP model | `bert_model.py`, `/sentiment`, `dashboard/models` |
| 3. K-Means behavioural clustering | `kmeans_model.py`, `dashboard/clusters/*` |
| 4. Combined model + evaluation | `fusion.py`, `/predict`, `dashboard/models/[id]`, `error-analysis` |