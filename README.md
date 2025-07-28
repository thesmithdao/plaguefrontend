# Plague Labs Frontend

This repository contains the frontend application for Plague Labs, a web3 marketing agency focused on memetic languages. This application showcases the agency's services, case studies, and provides a user profile to display Solana NFTs.

## Overview

The Plague Labs frontend is a Next.js application built with React and Tailwind CSS, utilizing shadcn/ui components for a modern and responsive user interface. Key features include:

*   **Dynamic Hero Section:** Engaging video background with calls to action.
*   **Service Showcase:** "Doctor's Recipe" section detailing viral marketing, community management, content creation, and Web3 growth services.
*   **Ecosystem/Case Studies:** Highlights successful projects like "Plague Collection" and "Goo Friends".
*   **Contact Form:** Allows users to get in touch with Plague Labs, with submissions handled by a Next.js API route, stored in Supabase, and email notifications sent via Resend.
*   **Patient Profile (NFT Viewer):** Users can connect their Solana wallet to view their Plague NFTs, complete with attributes and navigation.
*   **Informational Modals:** Provides details about the company, team, moonshots, terms, and privacy.
*   **Cookie Consent:** Manages user cookie preferences.
*   **SEO Optimization:** Configured with metadata for improved search engine visibility and social media sharing.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js (v18.x or later)
*   npm or yarn
*   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/defismith/v0-plaguefrontend-mt.git
    cd v0-plaguefrontend-mt
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

This project uses environment variables for API keys and database connections. You will need to set these up in a `.env.local` file in the root of your project.

**Required Environment Variables:**

*   `NEXT_PUBLIC_SOLANA_RPC`: Your Solana RPC endpoint (e.g., from Helius or QuickNode).
*   `HELIUS_API_KEY`: API key for Helius (used for fetching NFTs).
*   `POSTGRES_URL`: Connection URL for your PostgreSQL database (e.g., Neon).
*   `POSTGRES_PRISMA_URL`: Prisma-compatible URL for your PostgreSQL database.
*   `POSTGRES_URL_NON_POOLING`: Non-pooling URL for your PostgreSQL database.
*   `POSTGRES_USER`: PostgreSQL database user.
*   `POSTGRES_PASSWORD`: PostgreSQL database password.
*   `POSTGRES_DATABASE`: PostgreSQL database name.
*   `POSTGRES_HOST`: PostgreSQL database host.
*   `SUPABASE_URL`: Your Supabase project URL.
*   `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase project URL (client-side).
*   `SUPABASE_ANON_KEY`: Your Supabase public anon key.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public Supabase anon key (client-side).
*   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (server-side, for admin operations).
*   `SUPABASE_JWT_SECRET`: Your Supabase JWT secret.
*   `RESEND_API_KEY`: Your API key for Resend (for sending emails).

Example `.env.local` file:

```dotenv
NEXT_PUBLIC_SOLANA_RPC="YOUR_SOLANA_RPC_URL"
HELIUS_API_KEY="YOUR_HELIUS_API_KEY"

POSTGRES_URL="postgresql://user:password@host:port/database"
POSTGRES_PRISMA_URL="postgresql://user:password@host:port/database?schema=public"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host:port/database?connection_limit=1"
POSTGRES_USER="your_pg_user"
POSTGRES_PASSWORD="your_pg_password"
POSTGRES_DATABASE="your_pg_database"
POSTGRES_HOST="your_pg_host"

SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="your_supabase_anon_key"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
SUPABASE_JWT_SECRET="your_supabase_jwt_secret"

RESEND_API_KEY="re_YOUR_RESEND_API_KEY"
```

### Running Locally

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Database Setup (Supabase)

This project uses Supabase for storing contact form submissions.

1.  **Create a Supabase project:** If you don't have one, create a new project on [Supabase](https://supabase.com/).
2.  **Get your API keys:** Find your `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_JWT_SECRET` from your Supabase project settings (API section).
3.  **Run database migrations:**
    The project includes SQL scripts in the `scripts/` directory to set up the `contact_submissions` table. You can run these manually using the Supabase SQL Editor or a database client.

    *   `scripts/001_create_contact_submissions.sql`
    *   `scripts/002_fix_ip_address_column.sql`

    Alternatively, if you are using a local development environment with Supabase CLI, you might use:
    ```bash
    supabase db push
    ```

### Email Service Setup (Resend)

This project uses Resend for sending contact form notifications and confirmation emails.

1.  **Create a Resend account:** Sign up at [Resend](https://resend.com/).
2.  **Get your API key:** Obtain your `RESEND_API_KEY` from your Resend dashboard.
3.  **Verify your domain:** For sending emails from a custom domain (e.g., `noreply@plaguelabs.wtf`), you'll need to verify your domain in Resend.

## Project Structure

```
.
├── public/                 # Static assets (images, videos)
│   └── images/
├── app/
│   ├── api/                # Next.js API routes
│   │   ├── contact/        # Contact form submission API
│   │   └── get-nfts/       # NFT fetching API
│   ├── globals.css         # Global CSS styles
│   ├── layout.tsx          # Root layout for the application (includes SEO metadata)
│   └── page.tsx            # Main landing page component
├── components/             # Reusable UI components (shadcn/ui and custom)
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and configurations
│   ├── email.ts            # Resend email sending logic
│   ├── rate-limit.ts       # Rate limiting utility
│   └── supabase.ts         # Supabase client setup
├── scripts/                # SQL migration scripts
├── styles/                 # Additional global styles
├── constants.ts            # Global configuration constants
├── plague.tsx              # Main application component
├── Profile.tsx             # NFT Profile component
├── WalletProvider.tsx      # Solana wallet context provider
└── ... (other modal components like AboutModal, TermsModal, etc.)
```

## API Endpoints

### `/api/get-nfts`

*   **Method:** `GET`
*   **Description:** Fetches Solana NFTs for a given wallet address.
*   **Query Parameters:**
    *   `walletAddress`: The public key of the Solana wallet.
*   **Example Usage (Client-side):**
    ```javascript
    const response = await fetch(`/api/get-nfts?walletAddress=YOUR_WALLET_ADDRESS`);
    const data = await response.json();
    ```

### `/api/contact`

*   **Method:** `POST`
*   **Description:** Handles contact form submissions, stores them in Supabase, and sends email notifications.
*   **Request Body (JSON):**
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "subject": "Project Inquiry",
      "message": "I'd like to discuss a new project."
    }
    ```

## Deployment

This project is configured for seamless deployment to Vercel.

1.  **Connect to Vercel:** If you haven't already, connect your GitHub repository to Vercel.
2.  **Configure Environment Variables:** Ensure all necessary environment variables (listed above) are configured in your Vercel project settings.
3.  **Deploy:** Vercel will automatically deploy your application on every push to the main branch.

Your project is live in prod at: [https://plaguelabs.wrf](https://plaguelabs.wtf)

## Built With

*   [Next.js](https://nextjs.org/) - The React framework for production
*   [React](https://react.dev/) - JavaScript library for building user interfaces
*   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
*   [shadcn/ui](https://ui.shadcn.com/) - Reusable components built with Radix UI and Tailwind CSS
*   [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter) - Wallet integration for Solana dApps
*   [Supabase](https://supabase.com/) - Open source Firebase alternative (database)
*   [Resend](https://resend.com/) - Email API for developers
*   [Lucide React](https://lucide.dev/icons/) - Beautifully simple open-source icons


