# 🌉 DemoNuxtBridge

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://demo-nuxt-bridge.vercel.app/)

A minimal Nuxt project showcasing how to bridge a **Nuxt app** with **native WebView** containers on Android and iOS using JavaScript bridge libraries.

---

## 🧭 Purpose

This project demonstrates:

* Embedding a Nuxt app inside native mobile WebViews
* Bridging communication between native code and frontend using JavaScript

👉 Companion repo for Android native integration:
**🔗 [DemoAndroidBridgeKotlin](https://github.com/SethyRung/DemoAndroidBridgeKotlin)**

---

## 🚀 Live Demo

Access the hosted Nuxt app here:
🌐 [https://demo-nuxt-bridge.vercel.app/](https://demo-nuxt-bridge.vercel.app/)

---

## 📱 Native WebView Integration

This frontend is designed for communication with native mobile apps via JavaScript bridge libraries.

### ✅ Android

* Uses Kotlin with [`WebViewJavascriptBridge`](https://github.com/RDSunhy/WebViewJavascriptBridge)
* Demo Kotlin project ([DemoAndroidBridgeKotlin](https://github.com/SethyRung/DemoAndroidBridgeKotlin))

### 🍏 iOS (Planned)

* Uses Swift with [`WKWebViewJavascriptBridge`](https://github.com/Lision/WKWebViewJavascriptBridge)

---

## 🛠 Tech Stack

* **Nuxt 3**
* **Vue 3** + Composition API
* **TypeScript** and ESLint setup
* Deployed via **Vercel**

---

## 📦 Setup

```bash
git clone https://github.com/SethyRung/DemoNuxtBridge.git
cd DemoNuxtBridge
npm install
```

---

## 🧪 Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Preview production build
```

---

## 🧩 Project Structure

```
.
├── components/          # Vue components
├── pages/               # Nuxt auto-routed views
├── nuxt.config.ts       # Nuxt Bridge configuration
└── app.vue              # Root app file with script setup
```

---

## 🔐 Security Tips

* Always use `https://` URLs when embedding web content in native apps
* Validate all incoming messages from WebView
* Sanitize `postMessage` and callback usage to prevent injection

---

## 📄 License

MIT © [Sethy Rung](https://github.com/SethyRung)
