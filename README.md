
# 🚀 Terraform Project Generator  
### AI-powered platform that turns plain English into secure, enterprise-ready Terraform code.

---

## 🧠 Overview

**Terraform Project Generator** is an AI-powered tool that converts natural language infrastructure requirements into complete, production-grade Terraform configurations for **AWS**, **GCP**, and **Azure** — all with built-in security best practices.

Simply describe your infrastructure in plain English, select your cloud provider and region, and get a fully structured Terraform project with `.tf` files, variables, outputs, and a ready-to-deploy setup — downloadable as a **ZIP**.

---

## ✨ Features

- 🗣️ **Natural Language to IaC** — Describe your infrastructure requirements in plain English.  
- 🤖 **AI-Powered Generation** — Uses models like **Google Gemini**, **OpenAI GPT**, and **Anthropic Claude** to generate Terraform code.  
- ☁️ **Multi-Cloud Support** — Supports **AWS**, **GCP**, and **Azure**.  
- 🧩 **Complete Project Structure** — Automatically creates:
  - `main.tf`
  - `variables.tf`
  - `outputs.tf`
  - `providers.tf`
  - `README.md`
  - `terraform.tfvars.example`  
- 🔒 **Security by Default** — Enforces secure configurations:
  - Private networking  
  - Least-privilege IAM roles  
  - Encrypted storage  
  - Restricted SSH access  
- 🧠 **Diagnostics & Corrections** — Identifies inconsistencies, auto-fixes issues, and transparently explains all adjustments.  
- 💾 **One-Click Download** — Instantly download all generated Terraform files as a single **ZIP archive**.

---

## 🛠️ Tech Stack

| **Layer** | **Technology** |
|------------|----------------|
| **Frontend** | React (Vite + TypeScript) |
| **UI** | Tailwind CSS + shadcn/ui |
| **AI Models** | Google Gemini • OpenAI GPT • Anthropic Claude |
| **Build Tool** | Vite |
| **Packaging** | JSZip (for downloadable ZIPs) |

---

## ⚡ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone <YOUR_GIT_URL>
````

### 2️⃣ Navigate to the Project Directory

```bash
cd <YOUR_PROJECT_NAME>
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Start the Development Server

```bash
npm run dev
```

Your app will launch locally with **hot reload** enabled.

---

## 🧑‍💻 Editing the Code

You can modify the code using **any IDE**, directly in **GitHub**, or via **GitHub Codespaces**.

### 🧩 Option 1: Local Development

* Open your preferred IDE (**VS Code** recommended).
* Edit files inside the `src/` directory.
* Save changes — the dev server auto-reloads.

### 🌐 Option 2: Edit Directly on GitHub

* Navigate to the desired file.
* Click the **✏️ Edit** button.
* Commit changes directly from your browser.

### 💻 Option 3: Use GitHub Codespaces

* On your repo page, click the green **Code** button.
* Select the **Codespaces** tab → click **New Codespace**.
* Edit files in your browser, then commit and push.

---

## 🌍 Deployment

### 🏗️ Build the Project

```bash
npm run build
```

### 🚢 Deploy the `dist/` Folder to Any Static Hosting Provider

* [Vercel](https://vercel.com)
* [Netlify](https://www.netlify.com)
* [GitHub Pages](https://pages.github.com)
* [Firebase Hosting](https://firebase.google.com/products/hosting)

---

## 💡 Example Prompt

> “Create a secure VPC with 2 subnets, an EC2 instance (t3.micro), and a private S3 bucket for logs in AWS.”

The app will generate:

```
main.tf
variables.tf
outputs.tf
providers.tf
terraform.tfvars.example
README.md
```

All following **Terraform best practices** and **security standards**.

---

## 🧩 Roadmap

* ✅ Add support for multi-environment generation (dev/staging/prod)
* 💰 Introduce cost estimation and optimization suggestions
* 🧭 Enable infrastructure visualization (auto-generated architecture diagrams)
* 📦 Add export options to GitHub repo or GCS bucket directly

---

## 🛡️ Security Note

All **API keys** (Gemini, OpenAI, Anthropic) are session-based and **never stored**.
The app enforces **secure defaults** such as:

* Private networking
* Data encryption
* Minimal-access IAM roles

---

## 🧭 License

**MIT License © 2025** — Built with ❤️ for DevOps engineers who love automation and simplicity.

---

> “Write your cloud in English. Get Terraform that’s bulletproof.” 🌩️

```

