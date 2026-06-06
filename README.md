This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 🍽️ Restaurant Management System (POS + SaaS Level)
A full-stack restaurant POS & management system built with Next.js, Prisma, and Supabase, featuring role-based access control, menu customization system, real-time order tracking, and admin dashboard analytics.
# 🚀 Live Demo
https://restaurant-management-system-kon4dewwd-amesthysts-projects.vercel.app/

# 🔑 Demo Access
- username: admin@gmail.com
- password : admin123
## This account is intended for demonstration purposes only and may be reset or modified at any time.

# 🧠 Key Highlights
- 👥 Role-Based Access Control (ADMIN / CUSTOMER)
- 🍔 Advanced menu system with option templates
- 🧾 POS-style order system (order + order items separation)
- 🔥 Item-level customization (ice, sugar, spicy, notes)
- 📊 Admin dashboard with analytics (Recharts)
- ⚡ Real-time updates (Socket.io)
- 🗄️ Prisma + PostgreSQL (Supabase)

# ⚙️ Tech Stack
- ⚛️ Next.js 16
- 🟦 TypeScript
- 🗄️ Prisma ORM
- 🐘 PostgreSQL (Supabase)
- 🔐 Supabase Auth
- ⚡ Socket.io (real-time communication)
- 🧠 Zustand (state management)
- 🎨 Tailwind CSS
- 🎯 Lucide React (icons)
- 📊 Recharts (analytics)
- 🔔 React Hot Toast (notifications)
- 📁 XLSX + File Saver (export data)
- 🎬 Framer Motion (UI animation)

# 👥 Role System
- ADMIN     → Manage menu, orders, dashboard   
- CUSTOMER  → Create orders

# 🍔 Menu System
Each menu item supports:

- 🍽️ Name, price, category
- 🖼️ Image support
- 💰 Cost price (profit tracking)
- 🧩 Option template system (customization engine)
## 🧩 OptionTemplate System
Used for defining customizable options such as:

- 🧊 Ice level
- 🍬 Sugar level
- 🌶️ Spicy level
- 🧾 Additional modifiers

👉 This makes the menu dynamic instead of static

# 🧾 Order System
This system uses real POS structure:

- 📦 Order (Header)
- table number
- total price
- status (pending → cooking → done)
- soft delete support
- 🍽️ OrderItem (Detail)

Each item includes:

- quantity
- menu snapshot (name, price)
- 🧊 ice level
- 🍬 sugar level
- 🌶️ spicy level
- item status (per-item tracking)

👉 Allows kitchen to process items individually like real restaurant POS

# ⚙️ Installation & Setup
## 1. Clone repository
- git clone https://github.com/yourusername/restaurant-system.git
- cd restaurant-system
## 2. Install dependencies
- npm install
## 3. Setup environment variables
 Create .env file:
- DATABASE_URL="your_postgresql_database_url"
- DIRECT_URL="your_direct_database_url"

- NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
- NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

- NEXTAUTH_SECRET="your_secret_key"
- NEXTAUTH_URL="http://localhost:3000"
## 4. Setup database
- npx prisma generate
- npx prisma migrate dev
## 5. Run development server
- npm run dev

# ⚡ Real-Time Architecture
 Order Created
      ->
 Database (Prisma + Supabase)
    ->
Socket.io Event Triggered
     ->
Admin Dashboard Updates Instantly
     ->
Zustand State Sync UI

# 🔐 Security
- Role-based access control (ADMIN / CUSTOMER)
- Supabase environment variables secured
- No sensitive keys exposed to frontend
- Auth separation (Supabase + NextAuth)

# 📊 CI/CD
- ⚡ Vercel auto deployment
- 🔗 GitHub integration
- 🚀 Auto build on every push
- 🧪 Prisma included in build pipeline

# 🚧 Future Improvements
- 💳 Payment gateway integration (Midtrans / Stripe)
- 📱 Mobile cashier version
- 📡 Kitchen Display System (KDS)
- 📈 Advanced analytics dashboard
- 🧾 Receipt & invoice printing system
- 🔔 Push notification system

# 👨‍💻 Author
Built by Ricky Pratama Liang
