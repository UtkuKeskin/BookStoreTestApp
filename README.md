
---

# 📚 Book Store Test Data Generator

A realistic, deterministic, and parameterized book dataset generator built for **Itransition Intern Developer Program – Task #5**.

## 🌟 Features

- 🌍 **Multi-Language Support**: English 🇺🇸, German 🇩🇪, Japanese 🇯🇵
- 🎲 **Seed-Based Generation**: Same seed and page = same data forever (deterministic). Stateless server, no DB used.
- 📊 **Likes & Reviews Control**: Fractional values supported (e.g., 3.5 likes/book)
- 🖼️ **Two Views**:  
  - Table View (expandable rows)  
  - Gallery View (card-based layout)
- 🔁 **Infinite Scroll**: Loads more books on demand
- 🧠 **Probabilistic Distribution**: Likes and reviews are randomized yet seeded
- 📥 **CSV Export**: Download the loaded data (includes metadata in filename)

---

## 🛠️ Tech Stack

| Layer     | Tech Stack                             |
|-----------|----------------------------------------|
| Frontend  | React, TypeScript, Vite, Tailwind CSS  |
| Backend   | ASP.NET Core Web API (.NET 8), Bogus   |
| Hosting   | Render (Frontend + Backend deployed)   |
| Export    | Blob + RFC-4180-compliant CSV Utility  |

---

## 🚀 Run Locally

### 1️⃣ Backend (.NET 8)

```bash
cd BookStoreTestApp/BookStoreTestApp.Backend
dotnet run
# Runs at: http://localhost:5007
```

### 2️⃣ Frontend (React + Vite)

```bash
cd bookstore-frontend
npm install
npm run dev
# Runs at: http://localhost:3000
```

---

## 👤 Developer

- **Name**: Tayyar Utku Keskin  
- **Program**: Itransition Intern Developer (.NET)  
- **Email**: tayyarutkukeskin@gmail.com  
- **GitHub**: [UtkuKeskin](https://github.com/UtkuKeskin)

---