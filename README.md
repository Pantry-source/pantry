Pantry is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It uses [`Supabase`](https://supabase.com/), an open source Firebase alternative. The UI is implemented using [Tailwind UI](https://tailwindui.com/).

## Getting Started

Install dependencies:

```bash
npm install
```

Setup Supabase configuration:
Create `.env.local` file in the root directory and add Pantry's Supabase keys to be able to access the API. The URL and the key can be found in the Pantry's Supabase "Project Settings / API".

```
NEXT_PUBLIC_SUPABASE_URL=PANTRY_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=PANTRY_SUPABASE_ANON_KEY
```

## Running application locally

First, run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the main page.

## Debugging

To debug the locally running application using VSCode, create a file `.vscode/launch.json` with the following configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

## Deployment

The deploys are powered by the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Typescript

To execute TypeScript files, we need to install the TypeScript compiler. To check if it was successfully installed, run `tsc -v`. It will display the TypeScript version that is present on your PC.

Then to check for errors in the project, run

```
tsc
```

### Supabase types

The types for all entities stored in the database are generated. After any changes to database schema it is required to re-generate types. The Supabase CLI allows to generate typesand produce the types/generated/supabase.ts file. Instructions below follow the [on the official documentation](https://supabase.com/docs/guides/api/rest/generating-types):

1. Log in using `npx supabase login`
2. Run `npx supabase gen types typescript --project-id "$project_id from .env" --schema public > types/generated/supabase.ts`
