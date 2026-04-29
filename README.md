# 🌐 OSTracker

A full-stack web application to track open-source contributions — built with **React (Vite)** on the frontend, **Node.js + Express** on the backend, and deployed seamlessly on **Netlify** using serverless functions.

---

## 📁 Project Structure

```
FullStack_Project/
├── frontend/               # React + Vite frontend application
│   └── dist/               # Production build output
├── backend/                # Node.js + Express backend
│   └── functions/
│       └── api.js          # Netlify serverless API function
├── netlify.toml            # Netlify build & redirect configuration
├── package.json            # Root-level scripts (build, dev, start)
└── package-lock.json
```

---

## 🚀 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React, Vite, JavaScript, CSS      |
| Backend    | Node.js, Express.js               |
| Deployment | Netlify (Serverless Functions)    |
| Dev Tools  | Concurrently, npm                 |

---

## ✨ Features

- Track open-source contributions across projects
- Full-stack architecture with a REST API backend
- Serverless deployment via Netlify Functions
- Client-side routing with SPA fallback support
- Fast development workflow with concurrent frontend and backend servers

---

## 🛠️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Pradyun-Nimaje/FullStack_Project.git
cd FullStack_Project
```

2. **Install root dependencies**

```bash
npm install
```

3. **Install frontend and backend dependencies**

```bash
cd frontend && npm install
cd ../backend && npm install
```

---

## 💻 Running the Project

### Development Mode

Run both frontend and backend simultaneously using:

```bash
npm run dev
```

This uses `concurrently` to spin up:
- The **Vite dev server** for the frontend
- The **Express dev server** for the backend

### Production Build

```bash
npm run build
```

This installs all dependencies and builds the frontend into `frontend/dist/`.

### Start Production Server

```bash
npm start
```

Starts the backend Express server from the `backend/` directory.

---

## ☁️ Deployment (Netlify)

This project is configured for one-click deployment on **Netlify**.

The `netlify.toml` handles:

- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`
- **Serverless functions:** `backend/functions`
- **API routing:** All `/api/*` requests are redirected to `/.netlify/functions/api/:splat`
- **SPA routing:** All unmatched routes fall back to `index.html`

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Pradyun-Nimaje/FullStack_Project)

---

## 📡 API Routes

All API requests are served under `/api/*` and routed through the Netlify serverless function at `backend/functions/api.js`.

| Method | Endpoint     | Description                  |
|--------|--------------|------------------------------|
| GET    | `/api/...`   | Fetch contribution data      |
| POST   | `/api/...`   | Submit new contributions     |

> Refer to `backend/functions/api.js` for the full list of available endpoints.

---

## 📜 Available Scripts

From the root directory:

| Script        | Description                                      |
|---------------|--------------------------------------------------|
| `npm run dev` | Runs frontend and backend concurrently in dev mode |
| `npm run build` | Builds the frontend and installs backend deps  |
| `npm start`   | Starts the backend production server            |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 👤 Author

**Pradyun Nimaje**
- GitHub: [@Pradyun-Nimaje](https://github.com/Pradyun-Nimaje)

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute it.
