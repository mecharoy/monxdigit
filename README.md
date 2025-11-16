# monxdigit - Premium Marketing Website

A modern, full-stack marketing website built with Next.js 14, TypeScript, Prisma, and PostgreSQL. Features a stunning premium design with smooth animations, working contact form, lead management system, and admin dashboard.

## 🚀 Features

### Frontend
- ✅ **Premium Design** - Modern, minimalist aesthetic with unique color scheme
- ✅ **Smooth Animations** - Framer Motion powered scroll animations and micro-interactions
- ✅ **Fully Responsive** - Mobile-first design that works on all devices
- ✅ **Fast Performance** - Optimized with Next.js 14 App Router
- ✅ **SEO Optimized** - Proper meta tags and semantic HTML

### Backend
- ✅ **Database** - PostgreSQL with Prisma ORM
- ✅ **Lead Management** - Store and manage contact form submissions
- ✅ **Email Notifications** - Get notified when someone submits the form (Resend)
- ✅ **Admin Dashboard** - Secure admin panel to view and manage leads
- ✅ **Status Tracking** - Track lead progress (New → Contacted → Qualified → Converted)

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Email:** Resend
- **Deployment:** Vercel (recommended) or any Node.js host

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd monxdigit
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database - Get from your PostgreSQL provider
DATABASE_URL="postgresql://user:password@localhost:5432/monxdigit?schema=public"

# Email (Resend) - Sign up at https://resend.com
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="hello@monxdigit.com"
EMAIL_TO="your-email@example.com"

# Admin Access
ADMIN_PASSWORD="your-secure-password-here"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set Up Database
```bash
# Push schema to database
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your website!

---

## 🗄️ Database Setup

### Option 1: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a database: `createdb monxdigit`
3. Update `DATABASE_URL` in `.env`

### Option 2: Cloud Database (Recommended)

**Vercel Postgres (Free Tier)**
1. Go to [Vercel](https://vercel.com)
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL`

**Supabase (Free Tier)**
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection String
4. Copy the connection string to `DATABASE_URL`

**Neon (Free Tier)**
1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

---

## 📧 Email Setup (Resend)

1. Sign up at [Resend](https://resend.com)
2. Verify your domain (or use their test domain)
3. Create an API key
4. Add to `.env`:
   ```env
   RESEND_API_KEY="re_your_api_key_here"
   EMAIL_FROM="hello@monxdigit.com"
   EMAIL_TO="your-email@example.com"
   ```

---

## 🔐 Admin Dashboard

Access the admin dashboard at `/admin`:
- **URL:** `http://localhost:3000/admin`
- **Password:** Set in `.env` as `ADMIN_PASSWORD`

### Admin Features:
- View all leads in a table
- See lead statistics (New, Contacted, Qualified, Converted)
- Update lead status with dropdown
- Delete leads
- Export lead data

---

## 🌐 Deployment

### Deploy to Vercel (Recommended - 1-Click)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Add environment variables:
   - `DATABASE_URL`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `EMAIL_TO`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
6. Click "Deploy"

### Deploy to GoDaddy or VPS

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload files to server:**
   - Upload all files via FTP/SSH
   - Make sure Node.js 18+ is installed

3. **Install dependencies on server:**
   ```bash
   npm install --production
   ```

4. **Set up environment variables:**
   - Create `.env` file on server
   - Add all required variables

5. **Run database migrations:**
   ```bash
   npm run db:push
   ```

6. **Start the application:**
   ```bash
   npm start
   ```

7. **Set up process manager (PM2):**
   ```bash
   npm install -g pm2
   pm2 start npm --name "monxdigit" -- start
   pm2 save
   pm2 startup
   ```

8. **Configure reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 📁 Project Structure

```
monxdigit/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── actions/           # Server actions
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── admin/             # Admin components
│   │   ├── sections/          # Page sections
│   │   ├── ui/                # UI components
│   │   └── *.tsx              # Shared components
│   ├── hooks/                 # Custom React hooks
│   └── lib/
│       ├── prisma.ts          # Prisma client
│       ├── email.ts           # Email utilities
│       ├── utils.ts           # Utility functions
│       └── validations.ts     # Zod schemas
├── .env.example               # Environment template
├── package.json
├── README.md
└── ...
```

---

## 🎨 Customization

### Change Colors
Edit `src/app/globals.css`:
```css
:root {
  --primary: 189 100% 50%;      /* Cyan */
  --secondary: 217.2 91.2% 59.8%; /* Blue */
  --accent: 12 100% 60%;         /* Orange */
}
```

### Change Fonts
Edit `src/app/layout.tsx`:
```typescript
const syne = Syne({ ... })        // Display font
const manrope = Manrope({ ... })  // Body font
```

### Update Content
- **Services:** `src/components/sections/services.tsx`
- **About:** `src/components/sections/about.tsx`
- **Portfolio:** `src/components/sections/portfolio.tsx`
- **Stats:** `src/components/sections/stats.tsx`

---

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Create migration
```

---

## 📊 Database Schema

### Lead Model
```prisma
model Lead {
  id        String     @id @default(cuid())
  name      String
  email     String
  business  String?
  message   String
  status    LeadStatus @default(NEW)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  CONVERTED
  ARCHIVED
}
```

---

## 🐛 Troubleshooting

### Database Connection Error
- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Verify database exists

### Email Not Sending
- Check `RESEND_API_KEY` is valid
- Verify email domain in Resend dashboard
- Check email quota limits

### Admin Login Not Working
- Verify `ADMIN_PASSWORD` is set in `.env`
- Clear browser cookies and try again

---

## 📝 License

This project is private and proprietary to monxdigit.

---

## 🤝 Support

For questions or issues, contact: hello@monxdigit.com

---

Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS
