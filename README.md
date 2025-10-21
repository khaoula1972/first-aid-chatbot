# First Aid Chatbot

An intelligent Arabic-language first aid assistant built using **Hugging Face** models. The classification module was developed by **Imaane Mbrouk**. This project aims to provide accessible, AI-driven guidance for medical emergencies in Arabic-speaking contexts.

## Overview

The First Aid Chatbot leverages natural language processing (NLP) techniques to interpret users’ queries and deliver appropriate first aid advice. It is optimized for usability, linguistic accuracy, and responsiveness across devices.

## Features

• Full Arabic language support
• Automatic classification of first aid–related questions
• Contextual and reliable emergency response suggestions
• Responsive and user-friendly interface

## Installation and Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/khaoula1972/first-aid-chatbot.git
   ```
2. Navigate to the project directory and install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your Hugging Face API key:

   ```
   HUGGINGFACE_API_KEY=your_api_key_here
   ```
4. Start the development server:

   ```bash
   npm run dev
   ```

## Deployment

The chatbot is deployed on **Vercel**. Ensure that all required environment variables (e.g., API keys) are configured in the Vercel dashboard before deployment.

## Acknowledgements

This project was developed collaboratively, with the classification component designed by **Imaane Mbrouk**. It uses models hosted on **Hugging Face**, an open platform for machine learning applications.
