# ⚡ Chinmay Gawad — Developer Portfolio

![License](https://img.shields.io/badge/License-MIT-00ff66?style=for-the-badge&logo=github)
![Status](https://img.shields.io/badge/Status-Online_//_Active-00f0ff?style=for-the-badge&logo=matrix)
![Focus](https://img.shields.io/badge/Focus-Android_&_Kotlin-38bdf8?style=for-the-badge&logo=android)
![Theme](https://img.shields.io/badge/Theme-Dark_Hacker_CLI-10b981?style=for-the-badge&logo=terminal)

A high-performance, developer-centric, **Dark Hacker / Terminal Aesthetic** personal portfolio built with pure HTML5, vanilla JavaScript, CSS custom properties, and dynamic GitHub REST API integration.

🔗 **Live Demo**: [https://chinmaygawad.github.io/Portfolio/](https://chinmaygawad.github.io/Portfolio/)

---

## 🚀 Features

- **⚡ Dark Hacker & Cyberpunk Theme**: Ultra-dark void background (`#030712`) featuring CRT scanline overlays, neon green accents (`#00ff66`), and terminal window headers with OS control dots (`● ● ● bash`).
- **🟢 Canvas Matrix Code Rain**: Lightweight canvas animation rendering falling developer glyphs (`assets/js/matrix-bg.js`) with automatic tab visibility power savings.
- **🖥️ Dynamic CLI Typing Subtitle**: Simulates real terminal execution lines (`./run_android_dev.sh --lang=Kotlin`, `cat /etc/skills/computer_engineering.txt`, `ssh root@chinmay.dev`).
- **📦 Dynamic GitHub API Integration**: Automatically queries GitHub REST API to display real-time repository metrics (size, star/fork count, language badges, update timestamps) with language filtering.
- **🌓 Dual Theme Engine**: High-contrast theme switcher supporting Dark Matrix mode (default) and crisp Cyber Light mode with complete text visibility.
- **📱 Responsive & Optimized**: High performance with zero heavy JavaScript frameworks (< 20 KB total JS bundle).
- **✉️ Working Contact Socket**: Integrated with Web3Forms for direct email transmissions.

---

## 🛠️ Tech Stack

- **Core**: HTML5, Vanilla JavaScript (ES6+), CSS3
- **Design & Typography**: Custom CSS Variables, JetBrains Mono, Fira Code, Inter
- **Icons**: Lucide Icons CDN
- **API**: GitHub REST API (`https://api.github.com/users/ChinmayGawad/repos`)
- **Forms**: Web3Forms API
- **Deployment**: GitHub Pages

---

## 📂 Project Structure

```
Portfolio/
├── index.html              # Main single-page terminal application
├── normalize.css           # Cross-browser CSS reset
├── README.md               # Repository documentation
├── assets/
│   ├── css/
│   │   └── portfolio.css   # Hacker design system & theme rules
│   └── js/
│       ├── main.js         # Application logic, API fetcher, theme toggle
│       └── matrix-bg.js    # Canvas matrix rain background animation
└── pics/                   # Profile photos, resume PDF, and static assets
```

---

## 💻 Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ChinmayGawad/Portfolio.git
   cd Portfolio
   ```

2. **Run locally**:
   - Open `index.html` directly in any web browser, or serve using VS Code Live Server / `npx serve .`.

---

## 🌐 Deployment

This project is 100% static and deploys automatically on **GitHub Pages**:

1. Go to repository **Settings** → **Pages**.
2. Set **Source** to `Deploy from a branch` and select `main / root`.
3. Save. The site will deploy at `https://chinmaygawad.github.io/Portfolio/`.

---

## 👤 Author

**Chinmay Gawad**
- **Education**: Final-Year BE Computer Engineering @ St. John College of Engineering & Management (SJCEM), Palghar
- **Academic Stats**: BE SGPA: **9.29** | Diploma: **88.00%**
- **GitHub**: [@ChinmayGawad](https://github.com/ChinmayGawad)
- **LinkedIn**: [Chinmay Gawad](https://www.linkedin.com/in/chinmay-gawad-7b3172256/)
- **Email**: chinmaygawad365@gmail.com

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
