# 🌍 ExploreEase

**ExploreEase** is a smart location discovery and navigation platform built using **Bolt AI** and **Supabase**. Designed to enhance travel, tourism, and city exploration, it helps users discover points of interest, routes, and utilities using real-time and AI-enhanced recommendations.

---

## 🚀 Features

- 🔍 Location-based discovery with intelligent suggestions  
- 🧠 AI-enhanced route and place recommendations using Bolt  
- 🗺️ Map integration for real-time navigation  
- 💬 Authenticated user sessions via Supabase  
- 📱 Mobile and Web-friendly responsive design  

---

## 🛠️ Tech Stack

| Tech              | Purpose                                |
|-------------------|-----------------------------------------|
| **Bolt AI**       | Frontend app generation and UI flow     |
| **Supabase**      | Backend authentication and database     |
| **Expo Router**   | Navigation and route handling           |
| **React Native / Expo** | Mobile-first development          |
| **TypeScript**    | Strongly-typed development              |
| **Vercel**        | Hosting the web version of the app      |

---

## ⚙️ Project Structure

```
ExploreEase/
├── app/              # App routes and pages
├── components/       # UI components
├── constants/        # Static constants
├── contexts/         # React Context API
├── hooks/            # Custom React hooks
├── supabase/         # Supabase integration
├── utils/            # Helper utilities
├── .bolt/            # Bolt config and data
├── public/           # Static assets for Vercel
├── package.json      # NPM configuration
└── README.md         # Project documentation
```

---

## 🧱 How to Create This Project

1. Generate the base project using [**Bolt**](https://bolt.new/)  
2. Choose a template and customize using Bolt AI’s chat interface  
3. Integrate **Supabase** for backend authentication:  
   - Create a project at [supabase.io](https://supabase.io)  
   - Configure your project keys in `supabase.ts`  
4. Use `expo-router` for navigation  
5. Deploy frontend to **Vercel**

---

## 🧪 Running the Project Locally

> Make sure you have **Node.js**, **Expo CLI**, and **Git** installed.

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ExploreEase.git
cd ExploreEase
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Expo CLI (if not installed)

```bash
npm install -g expo-cli
```

### 4. Start the development server

```bash
npx expo start
```

Choose `w` for web or scan QR code for mobile.

---

## 🌐 Deploying to Vercel

1. Export your project for web:

```bash
npx expo export:web
```

2. Go to [vercel.com](https://vercel.com), import your GitHub repo, and configure:

- **Build Command**: `npx expo export:web`
- **Output Directory**: `web-build`

That’s it — your ExploreEase app is live!

---

## 🙌 Contributing

PRs, issues, and suggestions are welcome! Open an issue or start a discussion.

---

## 📄 License

MIT License © 2025 [Your Name]
