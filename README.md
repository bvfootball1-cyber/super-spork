# Haikus for Codespaces

A simple Node.js Express application that displays beautiful haikus. This project is perfect for demoing GitHub Codespaces and is based on the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world).

## 🚀 Quick Start (Copy-Paste Executable)

### Prerequisites
- Node.js (v12 or higher)
- npm (comes with Node.js)

### Option 1: Automated Script (Easiest!)

Clone and run the quick-start script:

```bash
git clone https://github.com/bvfootball1-cyber/super-spork.git && cd super-spork && bash quick-start.sh
```

### Option 2: One-Line Setup & Run

Copy and paste this entire block into your terminal:

```bash
git clone https://github.com/bvfootball1-cyber/super-spork.git && cd super-spork && npm install && npm start
```

Then open your browser to: http://localhost:3000

### Option 3: Step-by-Step Setup

**1. Clone the repository:**
```bash
git clone https://github.com/bvfootball1-cyber/super-spork.git
cd super-spork
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start the application:**
```bash
npm start
```

**4. Open in your browser:**
```
http://localhost:3000
```

### Development Mode

Run with auto-reload on file changes:
```bash
npm run dev
```

## 📁 Project Structure

```
super-spork/
├── index.js          # Main application server
├── haikus.json       # Haiku data
├── package.json      # Dependencies and scripts
├── views/            # EJS templates
│   └── index.ejs
└── public/           # Static assets
    ├── css/
    └── images/
```

## 🔧 Available Scripts

```bash
# Start the server
npm start

# Start with auto-reload (development)
npm run dev
```

## 🌐 Deployment

The application runs on port 3000 by default, or uses the PORT environment variable if set:

```bash
PORT=8080 npm start
```

## 📚 Additional Resources

- **[TERMINAL-COMMANDS.md](TERMINAL-COMMANDS.md)** - Complete copy-paste terminal commands reference
- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference guide with troubleshooting
- [Quickstart for GitHub Codespaces](https://docs.github.com/en/codespaces/getting-started/quickstart)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)

## 📝 License

MIT - See LICENSE file for details