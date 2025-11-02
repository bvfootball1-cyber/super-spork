# 🖥️ Copy-Paste Terminal Commands

All commands below are ready to copy and paste directly into your terminal.

---

## 🚀 First Time Setup

### Clone and Run (One Command)
```bash
git clone https://github.com/bvfootball1-cyber/super-spork.git && cd super-spork && npm install && npm start
```

### Clone and Run with Script
```bash
git clone https://github.com/bvfootball1-cyber/super-spork.git && cd super-spork && bash quick-start.sh
```

---

## 📦 If Already Cloned

### Navigate and Install
```bash
cd super-spork && npm install
```

### Start the Server
```bash
npm start
```

### Start in Development Mode (Auto-reload)
```bash
npm run dev
```

---

## 🔧 Common Tasks

### Install Dependencies
```bash
npm install
```

### Start on Different Port
```bash
PORT=8080 npm start
```

### Check Node Version
```bash
node --version && npm --version
```

### Clean Install (Remove node_modules and reinstall)
```bash
rm -rf node_modules package-lock.json && npm install
```

---

## 🔄 Git Operations

### Pull Latest Changes
```bash
git pull origin main
```

### Check Current Branch
```bash
git branch
```

### View Recent Commits
```bash
git log --oneline -5
```

### Check Status
```bash
git status
```

---

## 🧪 Testing & Development

### Install and Start
```bash
npm install && npm start
```

### Run in Background
```bash
npm start &
```

### Kill Process on Port 3000
```bash
lsof -ti:3000 | xargs kill -9
```

### View Running Node Processes
```bash
ps aux | grep node
```

---

## 📁 File Operations

### List All Files
```bash
ls -la
```

### View Package.json
```bash
cat package.json
```

### View Haikus
```bash
cat haikus.json
```

### Check Project Structure
```bash
tree -L 2 -I 'node_modules'
```

---

## 🌐 Browser Commands

### Open in Default Browser (Mac)
```bash
npm start & sleep 2 && open http://localhost:3000
```

### Open in Default Browser (Linux)
```bash
npm start & sleep 2 && xdg-open http://localhost:3000
```

### Open in Default Browser (Windows Git Bash)
```bash
npm start & sleep 2 && start http://localhost:3000
```

---

## 🐳 Docker Commands (If Using Docker)

### Build Docker Image
```bash
docker build -t haikus-app .
```

### Run Docker Container
```bash
docker run -p 3000:3000 haikus-app
```

---

## 🚨 Troubleshooting

### Port Already in Use - Find Process
```bash
lsof -i :3000
```

### Port Already in Use - Kill Process
```bash
lsof -ti:3000 | xargs kill -9
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Everything
```bash
rm -rf node_modules package-lock.json && npm install
```

### Check for Node.js Installation
```bash
which node && which npm
```

---

## 📊 Monitoring

### Watch for File Changes
```bash
npm run dev
```

### View Logs (if running in background)
```bash
tail -f /var/log/app.log
```

### Check Memory Usage
```bash
ps aux | grep node | awk '{print $2, $4, $11}'
```

---

## 🎯 Quick Commands Cheat Sheet

```bash
# Full setup and start
git clone https://github.com/bvfootball1-cyber/super-spork.git && cd super-spork && npm install && npm start

# Already cloned - quick start
cd super-spork && npm install && npm start

# Development mode
npm run dev

# Different port
PORT=8080 npm start

# Kill port 3000 and restart
lsof -ti:3000 | xargs kill -9 && npm start

# Fresh install
rm -rf node_modules && npm install && npm start
```

---

## 💡 Pro Tips

### Create Alias for Quick Start (Add to ~/.bashrc or ~/.zshrc)
```bash
alias haikus='cd ~/super-spork && npm start'
```

### Then reload shell
```bash
source ~/.bashrc  # or source ~/.zshrc
```

### Now you can just type:
```bash
haikus
```

---

**Happy coding! Copy, paste, and execute! 🚀**
