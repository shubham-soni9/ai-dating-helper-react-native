# AI Dating Helper

Open Source AI-powered dating assistant built with React Native and Supabase.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📱 Overview

**AI Dating Helper** is a comprehensive mobile application designed to navigate the complexities of modern dating. Leveraging the power of Large Language Models (LLMs) via OpenRouter (e.g., Grok), it provides users with real-time, context-aware advice ranging from breaking the ice to de-escalating conflicts.

This project serves as a robust example of a **full-stack React Native application** integrating:
*   **Expo Router** for file-based routing.
*   **Supabase** for Authentication, Database, and Edge Functions.
*   **AI Integration** for processing images and text prompts.
*   **NativeWind** for styling.

## ✨ Features

*   **DM Helper:** Upload a screenshot of a dating profile or chat conversation. The AI analyzes the context (tone, interests) and suggests 5 creative opening lines or replies tailored to your selected "vibe" (e.g., Romantic, Funny, Casual).
*   **Profile Roast:** Get a humorous yet constructive critique of dating profiles to understand what vibes they give off.
*   **Ghosting Recovery:** Receive strategic advice on how to re-engage someone who has stopped responding, without sounding desperate.
*   **De-escalator:** A conflict resolution tool that helps draft calm, composed responses to heated messages.
*   **Tone Analyzer:** Paste a message draft to understand how it might be perceived (e.g., aggressive, passive-aggressive, friendly) before you send it.
*   **Community & Learning:** Access to dating resources, articles, and a community feed to share experiences.

## 📸 Screenshots

| Login & Auth | Onboarding | Dashboard & Tools | Splash Screen |
|:---:|:---:|:---:|:---:|
| <img src="public/samples/login-screen.avif" width="200" alt="Login Screen" /> | <img src="public/samples/onboarding-screen.avif" width="200" alt="Onboarding Screen" /> | <img src="public/samples/live-usage-example-screen.avif" width="200" alt="Dashboard" /> | <img src="public/samples/splash-screen.avif" width="200" alt="Splash Screen" /> |

## 🛠 Tech Stack

### Mobile App (Client)
*   **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/)
*   **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
*   **State/Data:** React Hooks, Context API
*   **UI Components:** React Native Paper, Expo Image, Expo Video

### Backend & Services
*   **BaaS:** [Supabase](https://supabase.com/)
    *   **Auth:** Email & Social Login (Google/Apple)
    *   **Database:** PostgreSQL
    *   **Edge Functions:** Deno-based serverless functions for AI logic
*   **AI Provider:** [OpenRouter](https://openrouter.ai/) (connecting to models like x-ai/grok-4.1-fast)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   npm, yarn, or pnpm
*   Expo Go app on your physical device or an Android/iOS Simulator.
*   A Supabase account.
*   An OpenRouter API Key.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/shubham-soni9/ai-dating-helper.git
    cd ai-dating-helper
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory (refer to your Supabase project settings):
    ```env
    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Supabase Setup**
    *   Create a new Supabase project.
    *   Run the migration files located in `supabase/migrations` to set up your database schema.
    *   **Deploy Edge Functions:**
        Ensure you have the Supabase CLI installed and logged in.
        ```bash
        supabase functions deploy dm-this-girl
        supabase functions deploy profile-roast
        # ... deploy other functions as needed
        ```
    *   **Set Secrets:** Set the `OPENROUTER_API_KEY` secret in your Supabase project for the Edge Functions to access the AI models.
        ```bash
        supabase secrets set OPENROUTER_API_KEY=sk-or-your-key
        ```

5.  **Run the App**
    ```bash
    npx expo start
    ```
    Scan the QR code with Expo Go or press `a` for Android Emulator / `i` for iOS Simulator.

## 📂 Project Structure

```
ai-dating-helper/
├── src/
│   ├── app/                # Expo Router pages (screens)
│   ├── auth/               # Authentication logic & context
│   ├── components/         # Reusable UI components
│   ├── constants/          # App constants (API endpoints, etc.)
│   ├── data/               # Static data files (FAQs, questions)
│   ├── lib/                # Library configurations (Supabase client)
│   ├── services/           # Business logic & API services
│   ├── theme/              # Theme configuration
│   ├── types/              # TypeScript definitions
│   └── utils/              # Helper functions (Image processing, etc.)
├── supabase/
│   ├── functions/          # Edge Functions (AI logic: dm-helper, roast, etc.)
│   └── migrations/         # Database schema
├── public/
│   └── samples/            # Screenshot assets
└── ...config files
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ for better connections.*
