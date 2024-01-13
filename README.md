# e-Jobback an Asset Management System

### This is a web based asset management system that will fully automate your job in maintaining an asset in your property

#### Core features

- Manage asset details
- Create and configure asset checklist and workflow
- Able to attach graphic or files to a task
- Fully up to date information of an asset

Project Manager

- epi

Software Quality Assurance and Documentation

- icam

Software Engineer and Developer

- kyziq
- mishu

## Getting Started

1. Install packages using

```bash
npm i
# or
npm install
```

2. Create a new file `.env.local` on root directory
3. Copy the content of `.env.development` into the file and fill out the information needed inside
4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Prisma

1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started

- Get the url from supabase dashboard, open settings, open database tab, find connection string, switch to NodeJS tab, copy the url

```sh
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma (`npm run prisma`) for pulling db and generate schema from prisma. _Install prisma globally to use outside terminal `npm i -g prisma`_

npm i --save-dev prisma@latest
npm i @prisma/client@latest
