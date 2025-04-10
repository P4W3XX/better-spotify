This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Getting Started

```bash
git clone https://github.com/PAWEXX102/better-spotify.git
cd better-spotify
```

## Create and activate a virtual environment

```bash
cd backend
python -m venv env
source env/bin/activate  # Linux/macOS
env\Scripts\activate     # Windows
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Configure the database

Make a copy of the `.env.example` file and rename it to `.env`

Fill in the required variables:

```bash
SECRET_KEY=your-actual-django-secret-key
DEBUG=False

DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_HOST=your-db-host
DB_PORT=your-db-port
DB_NAME=your-db-name
```

`SECRET KEY`: To generate a secure SECRET_KEY for your Django project, run the following inside your activated virtual environment:

```bash
django-admin shell
```

Then, in the interactive shell, enter:
```bash
from django.core.management.utils import get_random_secret_key  
get_random_secret_key()
```
This will output a new random secret key you can copy and paste into your .env file

Now, get your Supabase credentials and update `.env` file

## Run migrations

```bash
python manage.py migrate
```

## Start development server

```bash
python manage.py runserver
```

The backend app will be avaible at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

Now, start the frontend development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
