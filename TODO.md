# VentureMate Frontend - Implementation TODO

## 🎯 Overview
Build a modern, sleek, dark-mode first frontend for VentureMate with full API integration.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (no sidebar)
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (dashboard)/              # Dashboard group (with sidebar)
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── page.tsx              # Dashboard home
│   │   ├── onboarding/
│   │   │   ├── page.tsx          # Onboarding flow
│   │   │   └── layout.tsx
│   │   ├── businesses/
│   │   │   ├── page.tsx          # Business list
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx      # Business detail
│   │   │   │   ├── edit/page.tsx
│   │   │   │   ├── documents/
│   │   │   │   ├── website/
│   │   │   │   └── ai-chat/
│   │   │   └── new/page.tsx
│   │   ├── documents/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── ai-assistant/
│   │   │   └── page.tsx
│   │   ├── website-builder/
│   │   │   └── page.tsx
│   │   ├── subscription/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                      # API routes (if needed)
│   ├── layout.tsx
│   ├── page.tsx                  # Landing page
│   └── globals.css
├── components/
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   └── index.ts
│   ├── layout/                   # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── forms/                    # Form components
│   │   ├── SignInForm.tsx
│   │   ├── SignUpForm.tsx
│   │   ├── BusinessForm.tsx
│   │   └── OnboardingForms.tsx
│   ├── business/                 # Business-specific
│   │   ├── BusinessCard.tsx
│   │   ├── BusinessList.tsx
│   │   ├── Checklist.tsx
│   │   └── HealthScore.tsx
│   ├── ai/                       # AI components
│   │   ├── ChatInterface.tsx
│   │   ├── AIResponse.tsx
│   │   ├── PromptSuggestions.tsx
│   │   └── TypingIndicator.tsx
│   ├── documents/                # Document components
│   │   ├── FileUploader.tsx
│   │   ├── FileList.tsx
│   │   ├── FolderTree.tsx
│   │   └── ShareDialog.tsx
│   ├── website/                  # Website builder
│   │   ├── TemplateSelector.tsx
│   │   ├── PageEditor.tsx
│   │   ├── SectionBuilder.tsx
│   │   └── PreviewFrame.tsx
│   └── onboarding/               # Onboarding
│       ├── IdeaIntake.tsx
│       ├── FounderProfile.tsx
│       ├── BusinessDetails.tsx
│       └── ProgressBar.tsx
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useBusiness.ts
│   ├── useDocuments.ts
│   ├── useWebsite.ts
│   └── useToast.ts
├── lib/                          # Utilities
│   ├── api/
│   │   ├── client.ts             # Axios/fetch client
│   │   ├── auth.ts
│   │   ├── businesses.ts
│   │   ├── documents.ts
│   │   ├── ai.ts
│   │   ├── website.ts
│   │   └── subscription.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── storage.ts
│   └── constants.ts
├── types/                        # TypeScript types
│   ├── auth.ts
│   ├── business.ts
│   ├── document.ts
│   ├── ai.ts
│   └── api.ts
└── styles/
    └── theme.ts
```

## ✅ Implementation Checklist

### Phase 1: Foundation & Auth
- [ ] 1.1 Create API client with interceptors
- [ ] 1.2 Set up AuthContext with JWT handling
- [ ] 1.3 Create signin page
- [ ] 1.4 Create signup page
- [ ] 1.5 Create forgot password page
- [ ] 1.6 Create reset password page
- [ ] 1.7 Add email verification flow
- [ ] 1.8 Add Google OAuth button

### Phase 2: Dashboard Layout
- [ ] 2.1 Create DashboardLayout with sidebar
- [ ] 2.2 Build navigation menu component
- [ ] 2.3 Create user profile dropdown
- [ ] 2.4 Add theme toggle (dark/light)
- [ ] 2.5 Build notification center
- [ ] 2.6 Create breadcrumb navigation

### Phase 3: Onboarding Flow
- [ ] 3.1 Create onboarding layout
- [ ] 3.2 Build IdeaIntake form
- [ ] 3.3 Build FounderProfile form
- [ ] 3.4 Build BusinessDetails form
- [ ] 3.5 Add progress indicator
- [ ] 3.6 Connect to onboarding API
- [ ] 3.7 Add AI analysis display

### Phase 4: Business Management
- [ ] 4.1 Create business list page
- [ ] 4.2 Build business card component
- [ ] 4.3 Create business detail page
- [ ] 4.4 Build business form
- [ ] 4.5 Add checklist component
- [ ] 4.6 Add health score widget
- [ ] 4.7 Connect to business API

### Phase 5: AI Assistant
- [ ] 5.1 Build chat interface
- [ ] 5.2 Create message bubble component
- [ ] 5.3 Add typing indicator
- [ ] 5.4 Create prompt suggestions
- [ ] 5.5 Add AI generation history
- [ ] 5.6 Connect to AI API
- [ ] 5.7 Add streaming responses

### Phase 6: Document Vault
- [ ] 6.1 Create file uploader component
- [ ] 6.2 Build file list with grid/list view
- [ ] 6.3 Create folder tree navigation
- [ ] 6.4 Add file preview component
- [ ] 6.5 Build share dialog
- [ ] 6.6 Add drag-and-drop upload
- [ ] 6.7 Connect to document API

### Phase 7: Website Builder
- [ ] 7.1 Create template selector
- [ ] 7.2 Build page editor
- [ ] 7.3 Add section builder
- [ ] 7.4 Create preview frame
- [ ] 7.5 Add domain configuration
- [ ] 7.6 Build publish controls
- [ ] 7.7 Connect to website API

### Phase 8: Subscription & Settings
- [ ] 8.1 Create pricing page
- [ ] 8.2 Build subscription management
- [ ] 8.3 Add payment method form
- [ ] 8.4 Create invoice history
- [ ] 8.5 Build user settings page
- [ ] 8.6 Add change password form
- [ ] 8.7 Connect to subscription API

### Phase 9: Polish & Optimization
- [ ] 9.1 Add loading skeletons
- [ ] 9.2 Create error boundaries
- [ ] 9.3 Add toast notifications
- [ ] 9.4 Implement optimistic updates
- [ ] 9.5 Add animations/transitions
- [ ] 9.6 Ensure responsive design
- [ ] 9.7 Add PWA support

## 🎨 Design System

### Colors
- Primary: #4CAF50 (Green)
- Secondary: #2196F3 (Blue)
- Background: #0a0a0f (Dark)
- Surface: #12121a (Card bg)
- Text Primary: #ffffff
- Text Secondary: #94a3b8
- Error: #ef4444
- Warning: #f59e0b
- Success: #4CAF50

### Typography
- Font Family: Geist, system-ui
- Headings: 800 weight
- Body: 400 weight
- Small: 0.875rem

### Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Border Radius
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- full: 9999px

## 🔌 API Integration

### Auth Endpoints
```typescript
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/oauth/google
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/password-reset-request
POST /api/v1/auth/password-reset
POST /api/v1/auth/change-password
GET  /api/v1/auth/verify-email
```

### Business Endpoints
```typescript
GET    /api/v1/businesses
POST   /api/v1/businesses
GET    /api/v1/businesses/:id
PUT    /api/v1/businesses/:id
DELETE /api/v1/businesses/:id
GET    /api/v1/businesses/:id/checklist
PUT    /api/v1/businesses/:id/checklist/:item
```

### AI Endpoints
```typescript
POST /api/v1/ai/business-plan
POST /api/v1/ai/pitch-deck
POST /api/v1/ai/name-ideas
POST /api/v1/ai/tagline
POST /api/v1/ai/logo
GET  /api/v1/ai/:job_id
```

### Document Endpoints
```typescript
GET    /api/v1/businesses/:id/documents
POST   /api/v1/businesses/:id/documents
GET    /api/v1/businesses/:id/documents/:doc_id
PATCH  /api/v1/businesses/:id/documents/:doc_id
DELETE /api/v1/businesses/:id/documents/:doc_id
GET    /api/v1/share/:token
```

## 📦 Dependencies to Add

```bash
npm install @tanstack/react-query axios zustand react-hook-form zod @hookform/responders date-fns react-dropzone framer-motion lucide-react recharts
```

## 🚀 Getting Started

1. Install dependencies
2. Set up environment variables
3. Run dev server
4. Test API connectivity
5. Build components

## 📝 Notes

- Use React Query for server state
- Use Zustand for client state
- Use React Hook Form for forms
- Use Framer Motion for animations
- Ensure accessibility (ARIA labels)
- Support mobile-first responsive
- Dark mode by default
