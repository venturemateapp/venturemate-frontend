# Backend-Frontend Integration Report

## Summary
Comparing backend handlers (`../bcknd/src/handlers/`) with frontend API client (`src/lib/api/client.ts`)

---

## ✅ FULLY INTEGRATED MODULES

### 1. Auth Handler (`/auth`)
| Backend Endpoint | Frontend Method | Status |
|-----------------|-----------------|--------|
| POST `/auth/register` | `authApi.signUp()` | ✅ Correct |
| POST `/auth/login` | `authApi.signIn()` | ✅ Correct |
| POST `/auth/oauth/google` | `authApi.googleOAuth()` | ✅ Correct |
| POST `/auth/refresh` | Used internally | ✅ Correct |
| POST `/auth/logout` | `authApi.signOut()` | ✅ Correct |
| POST `/auth/password-reset-request` | `authApi.forgotPassword()` | ⚠️ **WRONG PATH** - Frontend uses `/auth/forgot-password` |
| POST `/auth/password-reset` | `authApi.resetPassword()` | ⚠️ **WRONG PATH** - Frontend uses `/auth/reset-password` |
| POST `/auth/change-password` | `authApi.changePassword()` | ✅ Correct |
| GET `/auth/verify-email` | NOT IMPLEMENTED | ❌ Missing |
| POST `/auth/resend-verification` | `authApi.resendVerification()` | ✅ Correct |
| GET `/auth/status` | NOT IMPLEMENTED | ❌ Missing |

### 2. Users Handler (`/users`)
| Backend Endpoint | Frontend Method | Status |
|-----------------|-----------------|--------|
| GET `/users/me` | NOT IMPLEMENTED | ❌ Missing - Frontend uses `/auth/me` (doesn't exist) |
| PUT `/users/me` | NOT IMPLEMENTED | ❌ Missing |
| POST `/users/me/avatar` | NOT IMPLEMENTED | ❌ Missing |
| DELETE `/users/me` | NOT IMPLEMENTED | ❌ Missing |
| GET `/users` | NOT IMPLEMENTED | ❌ Admin only |

### 3. Businesses Handler (`/businesses`)
| Backend Endpoint | Frontend Method | Status |
|-----------------|-----------------|--------|
| GET `/businesses` | `businessApi.getAll()` | ✅ Correct |
| POST `/businesses` | `businessApi.create()` | ✅ Correct |
| GET `/businesses/{id}` | `businessApi.getById()` | ✅ Correct |
| PUT `/businesses/{id}` | `businessApi.update()` | ✅ Correct |
| DELETE `/businesses/{id}` | `businessApi.delete()` | ✅ Correct |
| GET `/businesses/{id}/checklist` | `businessApi.getChecklist()` | ✅ Correct |
| PUT `/businesses/{id}/checklist/{item_id}` | `businessApi.updateChecklistItem()` | ⚠️ **WRONG PATH** - Frontend uses `/businesses/${id}/checklist/items/${itemId}` |
| GET `/businesses/industries` | NOT IMPLEMENTED | ❌ Missing |

**Note:** Backend missing `getBySlug` - Frontend has it but backend doesn't implement it

### 4. Onboarding Handler (`/onboarding`)
| Backend Endpoint | Frontend Method | Status |
|-----------------|-----------------|--------|
| POST `/onboarding/start` | `onboardingApi.start()` | ✅ Correct |
| POST `/onboarding/idea-intake` | `onboardingApi.submitIdeaIntake()` | ✅ Correct |
| POST `/onboarding/founder-profile` | `onboardingApi.submitFounderProfile()` | ✅ Correct |
| POST `/onboarding/business-details` | `onboardingApi.submitBusinessDetails()` | ✅ Correct |
| POST `/onboarding/review` | NOT IMPLEMENTED | ❌ Missing |
| GET `/onboarding/status` | `onboardingApi.getStatus()` | ✅ Correct |

### 5. AI Generation Handler (`/businesses/{id}/generate`, `/businesses/{id}/branding`, `/generation-jobs`)
| Backend Endpoint | Frontend Method | Status |
|-----------------|-----------------|--------|
| POST `/businesses/{id}/generate/business-plan` | `aiApi.generateBusinessPlan()` | ✅ Correct |
| POST `/businesses/{id}/generate/pitch-deck` | `aiApi.generatePitchDeck()` | ✅ Correct |
| POST `/businesses/{id}/generate/one-pager` | `aiApi.generateOnePager()` | ✅ Correct |
| POST `/businesses/{id}/generate/regenerate` | NOT IMPLEMENTED | ❌ Missing |
| POST `/businesses/{id}/branding/generate-logos` | `aiApi.generateBranding()` | ⚠️ **WRONG PATH** - Frontend uses `/ai/businesses/${id}/generate/branding` |
| POST `/businesses/{id}/branding/select-logo` | NOT IMPLEMENTED | ❌ Missing |
| POST `/businesses/{id}/branding/generate-colors` | NOT IMPLEMENTED | ❌ Missing |
| PUT `/businesses/{id}/branding/colors` | NOT IMPLEMENTED | ❌ Missing |
| GET `/businesses/{id}/branding/guidelines` | NOT IMPLEMENTED | ❌ Missing |
| GET `/generation-jobs/{job_id}` | `aiApi.getJobStatus()` | ⚠️ **WRONG PATH** - Frontend uses `/ai/jobs/${jobId}` |

**Note:** AI Chat endpoints don't exist in backend - Frontend has `sendChatMessage` and `getChatHistory` but backend doesn't implement them

### 6. Documents Handler (`/businesses/{id}/documents`)
| Backend Endpoint | Frontend Method | Status |
|-----------------|-----------------|--------|
| GET `/businesses/{id}/documents` | `documentsApi.getAll()` | ⚠️ **WRONG PATH** - Frontend uses `/documents?business_id=` |
| POST `/businesses/{id}/documents` | `documentsApi.uploadFile()` | ⚠️ **WRONG PATH** - Frontend uses `/documents/upload` |
| GET `/businesses/{id}/documents/{doc_id}` | `documentsApi.getById()` | ⚠️ **WRONG PATH** - Frontend uses `/documents/${id}` |
| PATCH `/businesses/{id}/documents/{doc_id}` | `documentsApi.update()` | ⚠️ **WRONG PATH** - Frontend uses `/documents/${id}` with PUT |
| DELETE `/businesses/{id}/documents/{doc_id}` | `documentsApi.delete()` | ⚠️ **WRONG PATH** - Frontend uses `/documents/${id}` |
| GET `/businesses/{id}/documents/{doc_id}/download` | `documentsApi.getDownloadUrl()` | ⚠️ **WRONG PATH** - Frontend uses `/documents/${id}/download` |
| GET `/businesses/{id}/documents/folders` | `documentsApi.getFolders()` | ⚠️ **WRONG PATH** - Frontend uses `/documents/folders` |
| POST `/businesses/{id}/documents/folders` | `documentsApi.createFolder()` | ⚠️ **WRONG PATH** - Frontend uses `/documents/folders` |
| DELETE `/businesses/{id}/documents/folders/{folder_id}` | NOT IMPLEMENTED | ❌ Missing |
| GET `/businesses/{id}/documents/tags` | NOT IMPLEMENTED | ❌ Missing |
| POST `/businesses/{id}/documents/tags` | NOT IMPLEMENTED | ❌ Missing |
| POST `/businesses/{id}/documents/{doc_id}/share` | NOT IMPLEMENTED | ❌ Missing |
| GET `/share/{token}` | NOT IMPLEMENTED | ❌ Missing |
| GET `/businesses/{id}/documents/templates` | NOT IMPLEMENTED | ❌ Missing |

**CRITICAL:** Document routes are completely misaligned between frontend and backend!

### 7. Websites Handler (`/businesses/{id}/website`, `/website`)
| Backend Endpoint | Frontend Method | Status |
|-----------------|-----------------|--------|
| GET `/businesses/{id}/website` | `websiteApi.getById()` | ⚠️ **WRONG PATH** - Frontend uses `/websites/${id}` |
| POST `/businesses/{id}/website` | `websiteApi.create()` | ⚠️ **WRONG PATH** - Frontend uses `/websites` |
| PATCH `/businesses/{id}/website` | `websiteApi.update()` | ⚠️ **WRONG PATH** - Frontend uses `/websites/${id}` |
| DELETE `/businesses/{id}/website` | `websiteApi.delete()` | ⚠️ **WRONG PATH** - Frontend uses `/websites/${id}` |
| POST `/businesses/{id}/website/publish` | `websiteApi.publish()` | ⚠️ **WRONG PATH** - Frontend uses `/websites/${id}/publish` |
| POST `/businesses/{id}/website/unpublish` | `websiteApi.unpublish()` | ⚠️ **WRONG PATH** - Frontend uses `/websites/${id}/unpublish` |
| POST `/businesses/{id}/website/domain` | NOT IMPLEMENTED | ❌ Missing |
| GET `/businesses/{id}/website/domain/status` | NOT IMPLEMENTED | ❌ Missing |
| GET `/businesses/{id}/website/pages/{page_id}` | NOT IMPLEMENTED | ❌ Missing |
| PATCH `/businesses/{id}/website/pages/{page_id}` | `websiteApi.updatePage()` | ⚠️ **WRONG PATH** - Frontend uses `/websites/${id}/pages/${pageKey}` |
| POST `/businesses/{id}/website/assets` | NOT IMPLEMENTED | ❌ Missing |
| GET `/website/templates` | `websiteApi.getTemplates()` | ✅ Correct |
| GET `/website/templates/{code}` | NOT IMPLEMENTED | ❌ Missing |
| GET `/preview/{subdomain}` | NOT IMPLEMENTED | ❌ Missing |

**CRITICAL:** Website routes have major path misalignments!

### 8. Subscriptions Handler (`/subscriptions`)
| Backend Endpoint | Frontend Method | Status |
|-----------------|-----------------|--------|
| GET `/subscriptions/plans` | `subscriptionApi.getPlans()` | ✅ Correct |
| GET `/subscriptions/me` | `subscriptionApi.getCurrent()` | ⚠️ **WRONG PATH** - Frontend uses `/subscriptions/current` |
| POST `/subscriptions` | `subscriptionApi.createCheckout()` | ⚠️ **WRONG PATH** - Frontend uses `/subscriptions/checkout` |
| DELETE `/subscriptions` | NOT IMPLEMENTED | ❌ Missing |
| GET `/subscriptions/invoices` | `subscriptionApi.getInvoices()` | ✅ Correct |
| GET `/subscriptions/payment-methods` | NOT IMPLEMENTED | ❌ Missing |

---

## 🔴 CRITICAL ISSUES TO FIX

### 1. Document API Routes (HIGH PRIORITY)
**Frontend expects:** `/documents`, `/documents/${id}`, `/documents/upload`
**Backend provides:** `/businesses/{id}/documents`, `/businesses/{id}/documents/{doc_id}`

**Solution:** Either:
- Add wrapper routes in backend at `/documents` that proxy to `/businesses/{id}/documents`
- OR update frontend to use business-scoped paths

### 2. Website API Routes (HIGH PRIORITY)
**Frontend expects:** `/websites`, `/websites/${id}`, `/websites/${id}/publish`
**Backend provides:** `/businesses/{id}/website`, `/businesses/{id}/website/publish`

**Solution:** Similar to documents - need alignment

### 3. Missing AI Chat Endpoints (MEDIUM PRIORITY)
**Frontend has:** `aiApi.sendChatMessage()` and `aiApi.getChatHistory()`
**Backend:** No chat endpoints exist

**Solution:** Add chat handler to backend or remove from frontend

### 4. User Profile Endpoints (MEDIUM PRIORITY)
**Frontend uses:** `/auth/me` (doesn't exist)
**Backend provides:** `/users/me`

**Solution:** Update frontend to use `/users/me`

---

## 📊 INTEGRATION COMPLETION STATUS

| Module | Completion | Notes |
|--------|-----------|-------|
| Auth | 85% | Path mismatches for password reset |
| Users | 20% | Most endpoints missing in frontend |
| Businesses | 90% | Minor checklist path mismatch |
| Onboarding | 95% | One endpoint missing |
| AI Generation | 60% | Chat missing, path mismatches |
| Documents | 40% | Major route misalignment |
| Websites | 50% | Major route misalignment |
| Subscriptions | 70% | Path mismatches, some missing |

**Overall Integration: ~65%**

---

## 📝 REQUIRED ACTIONS

### Frontend Changes Needed:
1. Fix auth password reset paths
2. Add users API module
3. Fix document routes to use business-scoped paths
4. Fix website routes to use business-scoped paths
5. Fix subscription paths
6. Remove or stub AI chat until backend implements it

### Backend Changes Needed:
1. Add slug-based business lookup endpoint
2. Consider adding top-level `/documents` routes that proxy to business-scoped
3. Consider adding top-level `/websites` routes that proxy to business-scoped
4. Add AI chat endpoints

### OR Alternative Approach:
Update frontend API client to use backend's business-scoped paths consistently.
