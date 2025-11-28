# 📰 Conference CMS

...

---

## 🚀 Features

- 📝 **Conference System**
  - Conference, topic, category
  - Rich-text editor with media upload
  - Automatic slug generation and published date
  - SEO fields (title, description, Open Graph image)

- 👥 **User Management**
  - Authentication via Payload built-in auth
  - Role-based access control (Admin, User)

- � **User Abstract Management**
  - User abstract

- 🗂️ **Media Library**
  - Upload, optimize, and reuse images or videos

- 🌐 **API Ready**
  - Access your content via REST or GraphQL
  - Perfect for Next.js / React frontend integration

---

## 🧱 Tech Stack

- **Backend:** [Payload CMS](https://payloadcms.com)
- **Database:** PostgreSQL
- **Frontend:** Next.js
- **Auth:** Built-in Payload Auth
- **Storage:** Uploadthing

---

## 📦 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/payload-blog.git
cd payload-blog
```

### 2️⃣ Install dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Configure environment variables

Create a .env file at the root with:

```bash
# Database connection string
DATABASE_URI=postgresql://127.0.0.1:5432/your-database-name

# Used to encrypt JWT tokens
PAYLOAD_SECRET=YOUR_SECRET_HERE

# Used to configure CORS, format links and more. No trailing slash
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Secret used to authenticate cron jobs
CRON_SECRET=YOUR_CRON_SECRET_HERE

# Used to validate preview requests
PREVIEW_SECRET=YOUR_SECRET_HERE
```

### 4️⃣ Run the development server

```bash
npm run dev
# or
yarn dev
```

## 📦 Deployment

Production URL: https://medconf.up.railway.app

Hosting: [Railway](https://railway.com/project/f0b5f24d-ae75-40cf-b349-232e51245e99/service/5ecf6060-0d4f-410a-8ad5-19ea3017f956?environmentId=bd0d9ab5-c951-4b15-9545-770492e43b4d)

Database: [Neon](https://console.neon.tech/app/projects/mute-base-22100622/branches/br-orange-mouse-a11lhl19)

Grafana: TBD
