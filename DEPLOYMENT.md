# Deployment Guide for monxdigit

This guide provides detailed instructions for deploying your monxdigit website to various hosting platforms.

---

## Table of Contents
1. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
2. [GoDaddy Shared Hosting](#godaddy-shared-hosting)
3. [GoDaddy VPS / Dedicated Server](#godaddy-vps--dedicated-server)
4. [Other Hosting Providers](#other-hosting-providers)

---

## Vercel Deployment (Recommended)

Vercel offers the easiest deployment experience for Next.js applications with automatic deployments, SSL certificates, and global CDN.

### Step 1: Prepare Your Repository
```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 3: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

### Step 4: Configure Environment Variables
Add these in the Vercel dashboard:

```
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
EMAIL_FROM=hello@monxdigit.com
EMAIL_TO=your-email@example.com
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Step 5: Set Up Database
**Option A: Vercel Postgres**
1. Go to Storage tab in Vercel
2. Create Postgres database
3. Copy connection string to `DATABASE_URL`

**Option B: External Database (Supabase/Neon)**
1. Create account at [supabase.com](https://supabase.com) or [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

### Step 6: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your live site!

### Step 7: Run Database Migrations
After first deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull

# Run migrations
npm run db:push
```

### Step 8: Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

---

## GoDaddy Shared Hosting

⚠️ **Important:** GoDaddy shared hosting typically doesn't support Node.js applications. You'll need VPS or dedicated hosting for this app.

If you have Node.js enabled:

### Requirements
- Node.js 18+ support
- SSH access
- PostgreSQL database

### Deployment Steps

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload via FTP:**
   - Upload all files except `node_modules`
   - Upload `.next` folder
   - Upload `public` folder
   - Upload `package.json` and `package-lock.json`

3. **SSH into server:**
   ```bash
   ssh username@yourdomain.com
   ```

4. **Install dependencies:**
   ```bash
   cd public_html/your-app
   npm install --production
   ```

5. **Set up environment:**
   ```bash
   nano .env
   # Add your environment variables
   ```

6. **Start application:**
   ```bash
   npm start
   ```

---

## GoDaddy VPS / Dedicated Server

This is the recommended approach for GoDaddy hosting.

### Step 1: Server Setup

1. **Connect via SSH:**
   ```bash
   ssh root@your-server-ip
   ```

2. **Update system:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Install Node.js 18+:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PostgreSQL:**
   ```bash
   sudo apt install postgresql postgresql-contrib -y
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

5. **Create database:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE monxdigit;
   CREATE USER monxdigit_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE monxdigit TO monxdigit_user;
   \q
   ```

### Step 2: Deploy Application

1. **Clone repository:**
   ```bash
   cd /var/www
   git clone <your-repo-url> monxdigit
   cd monxdigit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   nano .env
   ```

   Add:
   ```env
   DATABASE_URL="postgresql://monxdigit_user:your_password@localhost:5432/monxdigit"
   RESEND_API_KEY="re_..."
   EMAIL_FROM="hello@monxdigit.com"
   EMAIL_TO="your-email@example.com"
   ADMIN_PASSWORD="your-secure-password"
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   ```

4. **Run database migrations:**
   ```bash
   npm run db:push
   ```

5. **Build application:**
   ```bash
   npm run build
   ```

### Step 3: Set Up PM2 Process Manager

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Start application:**
   ```bash
   pm2 start npm --name "monxdigit" -- start
   ```

3. **Set up auto-restart:**
   ```bash
   pm2 startup systemd
   pm2 save
   ```

4. **Check status:**
   ```bash
   pm2 status
   pm2 logs monxdigit
   ```

### Step 4: Set Up Nginx Reverse Proxy

1. **Install Nginx:**
   ```bash
   sudo apt install nginx -y
   ```

2. **Create site configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/monxdigit
   ```

3. **Add configuration:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/monxdigit /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step 5: Set Up SSL Certificate (Let's Encrypt)

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Get certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Auto-renewal:**
   ```bash
   sudo certbot renew --dry-run
   ```

### Step 6: Set Up Firewall

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## Other Hosting Providers

### DigitalOcean
Follow the VPS deployment guide above. DigitalOcean offers great $5/month droplets perfect for this application.

### AWS EC2
1. Launch Ubuntu instance
2. Follow VPS deployment guide
3. Configure security groups (ports 80, 443, 22)

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Railway auto-deploys Next.js apps
4. Add PostgreSQL plugin

### Netlify
⚠️ Not recommended - Netlify is primarily for static sites. Vercel is better for Next.js.

---

## Post-Deployment Checklist

- [ ] Website loads at your domain
- [ ] Contact form works and saves to database
- [ ] Email notifications are received
- [ ] Admin panel accessible at `/admin`
- [ ] All environment variables are set
- [ ] SSL certificate is active (HTTPS)
- [ ] Database backups are configured
- [ ] PM2 is set to auto-restart on reboot
- [ ] Monitoring is set up (optional)

---

## Updating Your Website

### Vercel
```bash
git add .
git commit -m "Update"
git push origin main
# Vercel auto-deploys!
```

### VPS/Dedicated Server
```bash
# SSH into server
ssh username@your-server

# Navigate to app directory
cd /var/www/monxdigit

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run migrations if needed
npm run db:push

# Build
npm run build

# Restart PM2
pm2 restart monxdigit
```

---

## Troubleshooting

### Port 3000 already in use
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### Database connection error
- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Check firewall allows database connections

### PM2 not restarting on reboot
```bash
pm2 startup systemd
pm2 save
```

### Nginx errors
```bash
# Check configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

---

## Monitoring & Maintenance

### View Application Logs
```bash
pm2 logs monxdigit
```

### Monitor Performance
```bash
pm2 monit
```

### Database Backups
```bash
# Backup
pg_dump monxdigit > backup_$(date +%Y%m%d).sql

# Restore
psql monxdigit < backup_20240101.sql
```

---

## Support

Need help? Contact: hello@monxdigit.com
