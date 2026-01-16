# Feature-Based CLI Generator

A zero-dependency CLI tool to scaffold Node.js projects with a **Feature-Based (Modular) Architecture** using TypeScript.

---

## 🚀 Quick Start

You can run this tool directly using `npx` without installation:
```bash
# Initialize a new project
npx your-package-name init [folder-name]

# Generate a feature module
npx your-package-name res [resource-name]
```

---

## 📦 Commands

### `init [folder-name]`

Creates a new project with the feature-based architecture structure.

**Usage:**
```bash
npx your-package-name init my-project
```

If no folder name is provided, it initializes in the current directory.

**What it does:**
- Creates the directory structure
- Runs `npm init -y`
- Installs TypeScript and `@types/node`
- Generates a `tsconfig.json`
- Sets up base folders (`features`, `common`, `config`, `middleware`)

---

### `res [resource-name]`

Generates a new feature module with Controller, Service, and Model files.

**Usage:**
```bash
npx your-package-name res User
```

This creates:
```
src/features/user/
├── user.controller.ts
├── user.service.ts
└── user.model.ts
```

Each file includes boilerplate code to get you started quickly.

---

## 🏗 Generated Architecture

The tool enforces a modular structure where each functional area of your application lives in its own "feature" folder.
```
project-root/
├── src/
│   ├── features/
│   │   └── [feature-name]/
│   │       ├── [name].controller.ts
│   │       ├── [name].service.ts
│   │       └── [name].model.ts
│   ├── common/      # Shared utilities and helpers
│   ├── config/      # Environment and DB configurations
│   └── middleware/  # Global Express/Koa middlewares
├── tsconfig.json
└── package.json
```

---

## 🛠 Features

- **Zero Dependencies**: Lightweight and fast
- **TypeScript Ready**: Automatically generates `tsconfig.json` and installs `@types/node` and `typescript`
- **Automated Setup**: Runs `npm init -y` and dependency installation automatically
- **Clean Code**: Generates boilerplate classes and interfaces for rapid development
- **Modular Architecture**: Each feature is self-contained for better maintainability

---

## 📝 Example Workflow
```bash
# 1. Create a new project
npx your-package-name init my-app

# 2. Navigate to the project
cd my-app

# 3. Generate features
npx your-package-name res User
npx your-package-name res Product
npx your-package-name res Order

# 4. Start building!
```
