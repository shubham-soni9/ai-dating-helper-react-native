# AI Dating Helper

<div align="center">

  <img src="assets/icon.png" alt="logo" width="100" height="100" />
  <h1>AI Dating Helper</h1>
  
  <p>
    <b>Your Personal AI Wingman for the Modern Dating World.</b>
  </p>

  <p>
    <a href="https://expo.dev">
      <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    </a>
    <a href="https://reactnative.dev">
      <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
    <a href="https://supabase.com">
      <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-screenshots">Screenshots</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-contributing">Contributing</a> •
    <a href="#-license">License</a>
  </p>

  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
</div>

<br />

## � Introduction

**AI Dating Helper** is a cutting-edge mobile application designed to navigate the complexities of modern dating. Built with **React Native (Expo)** and powered by **Supabase**, it leverages advanced Large Language Models (LLMs) via **OpenRouter** to provide real-time, context-aware dating advice.

Whether you're struggling to break the ice, need a second opinion on a profile, or want to de-escalate a heated conversation, AI Dating Helper is your pocket-sized relationship coach.

---

## ✨ Features

### 🤖 AI-Powered Tools
- **💌 DM Helper**: Upload screenshots of profiles or chats. The AI analyzes context, tone, and interests to generate 5 tailored opening lines or replies (e.g., *Romantic, Funny, Casual*).
- **🔥 Profile Roast**: Get a humorous yet constructive critique of dating profiles to understand "vibes" and red flags.
- **👻 Ghosting Recovery**: Strategic advice on how to re-engage someone who has stopped responding, without sounding desperate.
- **⚖️ De-escalator**: A conflict resolution tool that drafts calm, composed responses to heated or emotional messages.
- **🎭 Tone Analyzer**: Paste your message draft to check its perceived tone (e.g., *Aggressive, Passive-Aggressive, Friendly*) before sending.

### 📱 User Experience
- **Community & Learning**: Access curated dating resources, articles, and share experiences.
- **Secure Authentication**: Seamless login via Email, Google, or Apple (powered by Supabase Auth).
- **Modern UI/UX**: A sleek, responsive interface built with NativeWind (Tailwind CSS) and React Native Paper.

---

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Login & Auth</b></td>
      <td align="center"><b>Onboarding</b></td>
      <td align="center"><b>Dashboard</b></td>
      <td align="center"><b>Splash Screen</b></td>
    </tr>
    <tr>
      <td><img src="public/samples/login-screen.avif" width="200" alt="Login Screen" /></td>
      <td><img src="public/samples/onboarding-screen.avif" width="200" alt="Onboarding Screen" /></td>
      <td><img src="public/samples/live-usage-example-screen.avif" width="200" alt="Dashboard" /></td>
      <td><img src="public/samples/splash-screen.avif" width="200" alt="Splash Screen" /></td>
    </tr>
  </table>
</div>

---

## 🏗 System Architecture

The app follows a modern serverless architecture:

1. **User (📱 Mobile App)** connects to **Supabase (⚡ Auth/DB)** for authentication and data.
2. **User** sends an AI Request to **Supabase Edge Functions (☁️)**.
3. **Edge Functions** forward the Prompt + Image to **OpenRouter API (🧠)**.
4. **OpenRouter API** returns the LLM Response to **Edge Functions**.
5. **Edge Functions** process the response and return JSON to the **User**.

---

## 🛠 Tech Stack

### Client Side
- **Core**: [React Native](https://reactnative.dev/) (0.81) + [Expo SDK 54](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **State Management**: React Context API
- **UI Components**: React Native Paper, Expo Image, Lucide Icons

### Backend & Services
- **BaaS Provider**: [Supabase](https://supabase.com/)
  - **Database**: PostgreSQL
  - **Authentication**: Row Level Security (RLS) enabled
  - **Storage**: For user media
  - **Edge Functions**: Deno (TypeScript) for secure AI processing
- **AI Integration**: [OpenRouter](https://openrouter.ai/)
  - **Models**: x-ai/grok-4.1-fast (and others)

---

## 🚀 Getting Started

Follow this guide to set up the project locally.

### Prerequisites
- **Node.js** (v18 or newer)
- **Package Manager**: npm, yarn, or pnpm
- **Expo Go**: Installed on your physical device (iOS/Android)
- **Supabase Account**: For backend services
- **OpenRouter API Key**: For AI features

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/shubham-soni9/ai-dating-helper.git
    cd ai-dating-helper
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    EXPO_PUBLIC_SUPABASE_URL=your_project_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    ```

4.  **Backend Setup (Supabase)**
    - Create a new project on Supabase.
    - Go to the SQL Editor and run the migrations from `supabase/migrations`.
    - **Deploy Edge Functions**:
      ```bash
      # Login to Supabase CLI
      npx supabase login

      # Deploy functions
      npx supabase functions deploy dm-this-girl
      npx supabase functions deploy profile-roast
      npx supabase functions deploy tone-analyzer
      npx supabase functions deploy ghosting-recovery
      npx supabase functions deploy deescalator-help
      ```
    - **Set API Secrets**:
      ```bash
      npx supabase secrets set OPENROUTER_API_KEY=sk-or-your-key
      ```

5.  **Run the Application**
    ```bash
    npx expo start
    ```
    - Press `a` for Android Emulator.
    - Press `i` for iOS Simulator.
    - Scan the QR code with Expo Go on your phone.

---

## 📂 Project Structure

```bash
ai-dating-helper/
├── src/
│   ├── app/                # 📱 Screens & Navigation (Expo Router)
│   ├── components/         # 🧩 Reusable UI Components
│   │   ├── auth/           # Auth flow components
│   │   ├── dm-helper/      # Tool-specific components
│   │   └── ...
│   ├── services/           # 📡 API Services & Session Managers
│   ├── lib/                # ⚙️ Supabase Client Config
│   ├── theme/              # 🎨 Design Tokens & Theme Provider
│   ├── utils/              # 🛠 Helpers (Image processing, Validation)
│   └── types/              # 📝 TypeScript Definitions
├── supabase/
│   ├── functions/          # ☁️ Edge Functions (Deno)
│   └── migrations/         # 🐘 Database Schema
├── assets/                 # 🖼 Static Assets (Icons, Splash)
└── public/                 # 📂 Public Assets for README
```

---

## 🤝 Contributing

We welcome contributions from the community!

1.  **Fork** the project.
2.  Create your **Feature Branch** (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

Please ensure your code follows the existing style (Prettier/ESLint) and includes appropriate type definitions.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by the Open Source Community</p>
  <p>
    <a href="https://github.com/shubham-soni9/ai-dating-helper/issues">Report Bug</a> •
    <a href="https://github.com/shubham-soni9/ai-dating-helper/issues">Request Feature</a>
  </p>
</div>
