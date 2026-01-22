# 💰 Finance Tracker

**A powerful, modern personal finance management tool with real-time synchronization.**

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

## 📸 Screenshots

![Dashboard Preview](https://github.com/user-attachments/assets/eed748ad-149e-45f4-8055-cb7063467f13)

---

## ✨ Key Features

* **🔒 Secure Authentication:** Fully managed user login and signup powered by **Supabase Auth**.
* **📊 Real-time Database:** Instant synchronization of financial records using **PostgreSQL**.
* **💰 Transaction Management:** Complete CRUD (Create, Read, Update, Delete) functionality for income and expenses.
* **📱 Responsive Design:** Optimized for a seamless experience across mobile, tablet, and desktop using **Tailwind CSS**.
* **🛡️ Data Security:** Implementation of **Row Level Security (RLS)** to ensure users can only access their personal data.
* **⚡ High Performance:** Blazing fast development and build times thanks to **Vite**.

---

## 🚀 Getting Started

### 📋 Prerequisites
* **Node.js** (v18 or higher)
* **pnpm** (Recommended package manager)

## 🛠️ Installation
Clone the repository and navigate to the project directory:
```
bash
git clone https://github.com/alvarezjuanign/financeTracker.git
cd financeTracker
```

Install the dependencies:
```
bash
pnpm install
```
Environment Variables
To run this project, you will need to add the following environment variables to your `.env` file in the root directory:

```
env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the project:
```
bash
pnpm run dev
```

Open your browser and navigate to:
```
http://localhost:5173/
```

<div align="center"> Developed with ❤️ by <a href="https://www.google.com/search?q=https://github.com/alvarezjuanign">Juan Ignacio Alvarez</a> </div>
