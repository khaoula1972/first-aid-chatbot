# First Aid Chatbot

An intelligent Arabic-language first aid assistant built using **Hugging Face** models. The classification module was developed by **Imane Mabrouk**. This project aims to provide accessible, AI-driven guidance for medical emergencies in Arabic-speaking contexts.

## Overview

The First Aid Chatbot leverages natural language processing (NLP) techniques to interpret users’ queries and deliver appropriate first aid advice. It is optimized for usability, linguistic accuracy, and responsiveness across devices.

## Features

• Full Arabic language support

• Automatic classification of first aid–related questions

• Contextual and reliable emergency response suggestions

• Responsive and user-friendly interface

## **Local Installation Guide (WSL Environment)**

This project is deployed and publicly accessible on Vercel at the following address:
[https://first-aid-chatbot.vercel.app/](https://first-aid-chatbot.vercel.app/)

If you wish to run the application locally, you should **create an isolated development environment** under **WSL (Windows Subsystem for Linux)** to avoid dependency conflicts and ensure consistent configuration. Follow the steps below carefully.

### **1. Create a Dedicated Environment**

First, create a dedicated folder for the chatbot environment and navigate to it:

```bash
mkdir -p ~/envs/first-aid-chatbot
cd ~/envs/first-aid-chatbot
```

### **2. Install and Configure Node Version Manager (NVM)**

Install NVM to manage Node.js versions independently from the system:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
```

Install and activate Node.js version 18:

```bash
nvm install 18
nvm use 18
```

Verify the installation:

```bash
node -v
npm -v
```

### **3. Clone the Repository**

Clone the chatbot project into the current environment:

```bash
git clone https://github.com/khaoula1972/first-aid-chatbot.git
cd first-aid-chatbot
```

### **4. Install Dependencies**

Install all required Node.js packages locally:

```bash
npm install
```

This will create a `node_modules` directory inside your project without modifying the global environment.

### **5. Run the Development Server**

Start the application using:

```bash
npm run dev
```

Once running, open your browser and navigate to:

```bash
http://localhost:3000/
```

You should now see the chatbot interface operating locally.

### **6. Notes on Environment Isolation**

By following this method:

* The Node.js and npm versions are isolated through **NVM**.
* All dependencies are installed locally to the environment directory.
* No system-level package conflicts will occur, even if other Node projects exist on your machine.

---

**Deployment Note:**
This chatbot is currently deployed on **Vercel**, a cloud platform optimized for Next.js applications. For continuous integration or production deployment, any changes pushed to the main branch will automatically update the live version available at [https://first-aid-chatbot.vercel.app/](https://first-aid-chatbot.vercel.app/).

---

**References:**

* Next.js Documentation: *Getting Started* — [https://nextjs.org/docs/getting-started](https://nextjs.org/docs/getting-started)
* NVM Documentation: *Node Version Manager (nvm)* — [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
* Vercel Documentation: *Deploying Next.js Applications* — [https://vercel.com/docs](https://vercel.com/docs)



## Acknowledgements

This project was developed collaboratively, with the classification component designed by **Imane Mabrouk**. It uses models hosted on **Hugging Face**, an open platform for machine learning applications.
