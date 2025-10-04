# PostHaven - Modern Blog Platform

A beautiful, modern blog platform built with React, TypeScript, and Material UI. Create, share, and discover engaging content with a seamless user experience.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Material UI](https://img.shields.io/badge/Material%20UI-latest-blue)

## ✨ Features

- **Rich Text Editor**: Create stunning posts with TipTap's powerful WYSIWYG editor
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Beautiful UI that works perfectly on all devices
- **Real-time Interactions**: Subscribe to blogs and engage with comments
- **Modern Tech Stack**: Built with the latest React and TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- [Symfony Blog Backend](https://github.com/ashilkov/symfony-blog) running locally

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   echo "VITE_API_ENDPOINT=http://localhost:8000/" > .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` to see the application.

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material UI (MUI)
- **Routing**: React Router
- **Forms**: React Hook Form with Yup validation
- **Rich Text**: TipTap Editor
- **API**: GraphQL with automatic token refresh

## 📦 Scripts

```bash
npm run dev        # Start development server
npm run build      # Create production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🌐 Deployment

Build and deploy to any static hosting service:

```bash
npm run build
```

Deploy the `dist/` folder to platforms like Netlify, Vercel, or GitHub Pages.

## 🔗 Backend Integration

This frontend connects to a [Symfony-based backend API](https://github.com/ashilkov/symfony-blog). Make sure your backend is running and CORS is properly configured.

## 📄 License

MIT License
