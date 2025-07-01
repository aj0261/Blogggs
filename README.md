# Blogggs - An AI-Powered Blogging Platform


**Blogggs** is a full-stack, serverless social blogging platform designed for writers, thinkers, and creators. It provides a modern, intuitive interface for writing and sharing stories, coupled with powerful AI tools to assist in the creative process. The application is built with a high-performance serverless backend on Cloudflare Workers and a responsive React frontend.

**Live Demo:** [**blogggs.yourdomain.com**](https://blogggs-psi.vercel.app/) <!-- Replace with your live deployment URL -->

---

## ✨ Key Features

-   **Full CRUD Functionality:** Create, read, update, and delete blog posts with a feature-rich text editor.
-   **AI Writing Assistant:**
    -   **Generate Draft:** Kickstart your writing by generating a full blog post from a simple topic.
    -   **Proofread & Improve:** Enhance your writing by fixing grammar or changing the tone of selected text.
    -   **Summarize:** Condense long articles into key bullet points.
-   **User Engagement:**
    -   **Voting System:** Upvote and downvote posts to show appreciation.
    -   **Commenting:** Engage in discussions on blog posts.
    -   **User Profiles:** View author profiles with their bio and list of posts.
-   **Content Discovery:** A robust search engine to find posts by title, content, or author.
-   **Secure Authentication:** JWT-based authentication for user registration, login, and protected actions.
-   **Responsive Design:** A seamless experience across desktop, tablet, and mobile devices using Tailwind CSS and shadcn/ui.

---

## 🛠️ Tech Stack

| Category             | Technology                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend**         | [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Axios](https://axios-http.com/) |
| **Backend**          | [Hono.js](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/) (Serverless)             |
| **Database & ORM**   | [PostgreSQL](https://www.postgresql.org/), [Prisma](https://www.prisma.io/) (with Prisma Accelerate for connection pooling) |
| **Artificial Intelligence** | [Hugging Face Inference API](https://huggingface.co/inference-api) with the [FLAN-T5](https://huggingface.co/google/flan-t5-large) model |
| **Authentication**   | [JWT](https://jwt.io/) (JSON Web Tokens)                                                                    |

---

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
-   [Git](https://git-scm.com/)
-   A PostgreSQL database instance (e.g., from [Supabase](https://supabase.com/) or a local installation)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aj0261/Blogggs.git
    cd Blogggs
    ```

2.  **Backend Setup:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file and add your environment variables
    # (see the Environment Variables section below)

    # Apply database migrations
    npx prisma migrate dev

    # Start the backend development server
    npm run dev
    ```
    The backend server will be running on `http://localhost:8787`.

3.  **Frontend Setup:**
    ```bash
    # Navigate to the frontend directory from the root
    cd frontend

    # Install dependencies
    npm install

    # Start the frontend development server
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173`.

---

## 🔒 Environment Variables

You need to create a `.env` file in the `backend` directory and add the following variables.

```env
# backend/.env

# Your PostgreSQL connection string (ideally from Prisma Accelerate)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."

# A secret key for signing JWTs (any random string)
JWT_SECRET="your-super-secret-jwt-key"

# Your API token from Hugging Face (with 'write' permissions)
HF_ACCESS_TOKEN="hf_xxxxxxxxxxxxxxxxxxxxxxxxxx"
