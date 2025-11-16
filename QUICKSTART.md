# Quick Start Guide

Get your monxdigit website running in 5 minutes!

## 🚀 Fastest Setup (Vercel + Vercel Postgres)

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project" → Import your repo
4. Click "Deploy" (don't add env vars yet)

### 3. Add Database
1. In Vercel dashboard, go to "Storage" tab
2. Click "Create Database" → "Postgres"
3. Click "Create"
4. Copy connection string

### 4. Add Environment Variables
In Vercel project settings → Environment Variables:

```
DATABASE_URL=<paste from step 3>
RESEND_API_KEY=<get from resend.com>
EMAIL_FROM=hello@monxdigit.com
EMAIL_TO=your-email@example.com
ADMIN_PASSWORD=mysecretpassword
NEXT_PUBLIC_APP_URL=<your-vercel-url>
```

### 5. Redeploy
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

### 6. Initialize Database
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment
vercel env pull

# Push database schema
npm run db:push
```

### 7. Test!
- Visit your Vercel URL
- Submit the contact form
- Check `/admin` with your password

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL installed

### Steps
```bash
# 1. Clone and install
git clone <repo-url>
cd monxdigit
npm install

# 2. Create local database
createdb monxdigit

# 3. Copy environment file
cp .env.example .env

# 4. Edit .env file
nano .env
# Add your DATABASE_URL and other variables

# 5. Push database schema
npm run db:push

# 6. Start dev server
npm run dev
```

Visit `http://localhost:3000`

---

## 📧 Email Setup (5 minutes)

### Option 1: Resend (Recommended)
1. Go to [resend.com](https://resend.com)
2. Sign up (free tier: 100 emails/day)
3. Add your domain OR use `onboarding@resend.dev` for testing
4. Create API key
5. Add to `.env`:
   ```
   RESEND_API_KEY=re_...
   EMAIL_FROM=onboarding@resend.dev
   ```

### Option 2: Skip Email (Testing)
Leave `RESEND_API_KEY` empty - forms will still save to database, just no email notifications.

---

## 🗄️ Database Options

### Quick Testing: SQLite (Not recommended for production)
```bash
# In .env
DATABASE_URL="file:./dev.db"

# In prisma/schema.prisma, change:
provider = "sqlite"
```

### Free Cloud Options:

**Vercel Postgres** (Recommended)
- 256 MB storage
- Built-in with Vercel
- Setup: 2 clicks

**Supabase**
- 500 MB storage
- Free forever
- [supabase.com](https://supabase.com)

**Neon**
- 512 MB storage
- Serverless
- [neon.tech](https://neon.tech)

---

## 🎨 Quick Customization

### Change Brand Name
Find and replace `monxdigit` in:
- `src/components/navigation.tsx`
- `src/components/footer.tsx`
- `src/app/layout.tsx`
- `README.md`

### Change Colors
Edit `src/app/globals.css`:
```css
--primary: 189 100% 50%;      /* Main brand color */
--accent: 12 100% 60%;        /* CTA button color */
```

### Update Services
Edit `src/components/sections/services.tsx`

### Change Stats
Edit `src/components/sections/stats.tsx`

---

## 🐛 Common Issues

### "Database connection failed"
- Check DATABASE_URL format
- Ensure database exists
- Test connection: `psql <DATABASE_URL>`

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 in use
```bash
# Kill process
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Admin login not working
- Clear cookies
- Check ADMIN_PASSWORD in .env
- Restart dev server

---

## 📱 Test on Mobile

1. Find your local IP:
   ```bash
   # Mac/Linux
   ifconfig | grep inet

   # Windows
   ipconfig
   ```

2. Update `.env`:
   ```
   NEXT_PUBLIC_APP_URL=http://YOUR-IP:3000
   ```

3. Visit on phone: `http://YOUR-IP:3000`

---

## 🚀 Ready to Deploy?

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guides.

---

## 💡 Next Steps

- [ ] Customize content in sections
- [ ] Add your logo/branding
- [ ] Set up custom domain
- [ ] Configure Google Analytics
- [ ] Set up email automation
- [ ] Add more services
- [ ] Create case studies

---

## 📞 Need Help?

- Read [README.md](README.md) for full documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for hosting guides
- Email: hello@monxdigit.com

---

Happy building! 🎉
