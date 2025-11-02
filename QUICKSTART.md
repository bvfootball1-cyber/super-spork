# ⚡ Quick Start Guide

## Copy-Paste to Get Running in 30 Seconds

### If you haven't cloned yet:

```bash
git clone https://github.com/bvfootball1-cyber/super-spork.git && cd super-spork && npm install && npm start
```

### If you already cloned:

```bash
cd super-spork && npm install && npm start
```

### That's it! 🎉

Open your browser to: **http://localhost:3000**

---

## Alternative: Run with Auto-Reload (Development Mode)

```bash
npm run dev
```

---

## Troubleshooting

### Port already in use?
```bash
PORT=8080 npm start
```
Then open: **http://localhost:8080**

### Need to install Node.js?
Visit: https://nodejs.org/ (Download LTS version)

### Check if Node.js is installed:
```bash
node --version
npm --version
```

---

## What This App Does

This is a simple Express.js web application that displays a collection of haikus. It's perfect for:
- Testing GitHub Codespaces
- Learning Node.js/Express basics
- Quick deployment demos

---

## Quick Deploy Commands

### Deploy to Heroku (if you have Heroku CLI):
```bash
heroku create
git push heroku main
heroku open
```

### Deploy to Azure (if you have Azure CLI):
```bash
az webapp up --name your-app-name --runtime "NODE|18-lts"
```

---

## Project Files

- `index.js` - Main server file
- `haikus.json` - Haiku data
- `views/index.ejs` - HTML template
- `public/` - Static assets (CSS, images)

---

**Happy coding! 🚀**
