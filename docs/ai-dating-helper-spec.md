# AI Dating Helper — Product & Technical Spec

## Overview

AI Dating Helper is an Expo React Native app that provides AI-powered hints for dating and DM scenarios. Users sign up, purchase a subscription, and then use tools such as DM Helper to generate tailored DM suggestions based on uploaded screenshots and selected parameters (category, tone, intention). The app integrates Supabase for auth and a REST API, and will integrate RevenueCat for subscriptions.

## Common Points to Remember

- Support dark and light themes throughout. Use `src/theme/ThemeProvider.tsx` and NativeWind.
- Replace boilerplate code where needed; follow the structure defined in this spec.
- Use NativeWind classes and `StyleSheet`-backed styles, no hardcoded inline styles.
- Define all TypeScript types in independent files under `src/types/` to avoid TS errors.

## Dependencies (planned)

- `expo-router`, `react-native`, `expo-secure-store`, `nativewind`
- `@supabase/supabase-js`, `expo-auth-session`
- RevenueCat SDK (to be integrated in the future; placeholder flow now)

## Navigation & Routing

- Use Expo Router with screens under `src/app/`.
- Bottom tab layout for Home Dashboard lives under `src/app/dashboard/_layout.tsx`.
- Top-level screens:
  - `src/app/splash.tsx`
  - `src/app/welcome.tsx`
  - `src/app/onboarding.tsx`
  - `src/app/result.tsx`
  - `src/app/reviews.tsx`
  - `src/app/payment.tsx`
  - `src/app/dashboard/_layout.tsx` (tabs)
  - `src/app/dashboard/home.tsx`
  - `src/app/dashboard/history.tsx`
  - `src/app/dashboard/tools.tsx`
  - `src/app/dashboard/resources.tsx`
  - `src/app/dashboard/profile.tsx`

## Theming & Styling

- Wrap the app in `ThemeProvider` and use NativeWind for classes.
- Keep a centralized style strategy: reusable components and styles under `components/`.
- Avoid inline hardcoded values; prefer design tokens via NativeWind and shared StyleSheets.

## Authentication

- Supabase handles all authentication.
- Methods:
  - Email Magic Token: user enters email; app triggers Supabase magic link. Show success dialog instructing user to check email. Provide manual token entry fallback; verify token with Supabase; route to Onboarding for new users.
  - Google: Supabase OAuth via `signInWithOAuth` (Google provider).
  - Facebook: Supabase OAuth via `signInWithOAuth` (Facebook provider).
- Persist auth session with Supabase client; guard routes accordingly.

## Splash Screen

### Purpose

- Primary marketing entry with concise explanation of the app’s value.
- Entry point for Sign In options: Email Magic Token, Google, Facebook.

### Implementation Notes

- Use Expo Splash Screen for production builds.
- In debug builds, bypass splash to avoid dev-build errors; display a lightweight welcome screen instead.
- CTA sections showcasing mini proof/use cases the app solves.

### Success & Navigation

- On successful auth, route new users to Onboarding; existing users to Home Dashboard.

## Welcome Screen (Sign Up)

### Purpose

- Alternative entry when splash is bypassed in debug.
- Contains the same auth options and marketing copy.

### Implementation Notes

- Email input for magic token request.
- Success dialog after request with guidance and manual token entry.

## Onboarding Screen

### Purpose

- First-time user survey: 7 static questions related to dating challenges and online hesitation.
- Designed to increase perceived need and relevance.

### Implementation Notes

- Questions sourced from a static data `.ts` file under `src/data/onboardingQuestions.ts`.
- Use `expo-secure-store` to track whether onboarding has been shown (`secure store key: onboarding_seen`), ensuring it displays only for new users.
- After completion, navigate to Result Screen.

## Result Screen

### Purpose

- Immediately follows onboarding completion.
- Displays a brief fake processing state, then shows results and improvement suggestions.

### Implementation Notes

- Emphasize positive reinforcement with targeted areas to improve.
- Provide CTA to People Review Screen.

## People Review Screen

### Purpose

- Social proof hub: testimonials, ratings, success stories.
- Psychological tactics to build trust and encourage conversion.

### Implementation Notes

- Rich content blocks with quotes, star ratings, and before/after summaries.
- CTA button leads to Payment Screen.

## Payment Screen (RevenueCat)

### Purpose

- Placeholder paywall prior to RevenueCat integration.
- Trial option proceeds to Home Dashboard.

### Implementation Notes

- Maintain a fake payment context for now to mark subscription status.
- Replace with RevenueCat paywall in future.

## Home Dashboard Screen (Tabs)

### Layout

- Bottom tab navigation via `_layout.tsx` under `src/app/dashboard/`.
- Tabs:
  - Home
  - History
  - Tools (2×2 grid)
  - Resources
  - Profile

### Home Tab

- Personalized vertical list:
  - Recently Used Tools (horizontal list)
  - Daily Tip / Daily Icebreaker

### History Tab

- Shows user’s query history with:
  - Short two-line title (with ellipsis)
  - Small thumbnail
  - Highlighted tool name

### Tools Tab

- 2×2 grid of tools:
  - DM Girl By Screenshot
  - Get Out of Angry Chatting

### Resources Tab

- Fetch and display resources, book references, and suggestions from API.

### Profile Tab

- Show name and profile details.
- Theme option toggle.
- Sign out and Settings.

## DM Helper Flow (Core Use Case)

### Steps

1. User uploads a screenshot (from camera roll or capture).
2. User selects DM parameters:
   - Category
   - Tone
   - Intention
3. App builds a single combined prompt using the parameters and the uploaded image URL(s).
4. App calls a Supabase-hosted REST API with the prompt and image URLs, including Supabase Auth Session.
5. Receive JSON list of DM suggestions and hints.
6. Display suggestions with copy and edit options on the final screen.

### API Contract (example)

Request:

```json
{
  "imageUrls": ["https://.../image1.jpg"],
  "category": "compliment",
  "tone": "playful",
  "intention": "start-conversation",
  "prompt": "<constructed full prompt>",
  "userId": "uuid"
}
```

Response:

```json
{
  "suggestions": [
    { "text": "Hey, noticed your trip photos — what was the highlight?" },
    { "text": "Your energy in that post is contagious. Mind sharing the story?" }
  ],
  "hints": [
    "Keep it specific to the image",
    "Invite a reply without pressure"
  ]
}
```

## Data & Types

- Place all types under `src/types/`:
  - `src/types/auth.ts`: `AuthSession`, `UserProfile`
  - `src/types/onboarding.ts`: `OnboardingQuestion`, `OnboardingAnswer`
  - `src/types/dm.ts`: `DMParams`, `DMRequest`, `DMSuggestion`, `DMResult`
  - `src/types/history.ts`: `HistoryItem`
  - `src/types/tools.ts`: `Tool`
  - `src/types/resources.ts`: `ResourceItem`
  - `src/types/subscription.ts`: `SubscriptionState`

## Storage Keys

- `onboarding_seen`: boolean in SecureStore to gate onboarding.
- `recent_tools`: local list used for Home tab.

## Error & Empty States

- Auth failures: show contextual error messages and retry options.
- DM API failures: show graceful fallback with retry and edit prompt.
- Empty history/resources: show friendly placeholders and guidance.

## Implementation Notes Summary

- Use NativeWind for styles and themes consistently.
- Keep screens modular with clear responsibilities.
- Persist auth and subscription state; gate routes accordingly.
- Build prompts deterministically from selected parameters.
- Ensure copy and edit actions are fast and accessible.

