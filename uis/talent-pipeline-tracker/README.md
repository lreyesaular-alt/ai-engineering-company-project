This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

## Prompts Used During Hito 3

This section documents the key prompts used to build and refine the Talent Pipeline Tracker during Hito 3.

1. Initial dashboard build
- Prompt summary: build a functional dashboard in Next.js + TypeScript + App Router + Tailwind connected to the real API (`NEXT_PUBLIC_API_URL`), including candidate list, status filters, search, detail panel, notes, and robust loading/error states.

2. API integration and real data alignment
- Prompt summary: verify real API response shape and real status values before implementing assumptions, consume real endpoints with `fetch`, and avoid mock data.

3. New application form (POST /records)
- Prompt summary: add only the new-candidacy form with client-side validation, submit to `POST /records`, prevent duplicate submit, show success/error feedback, clear form on success, and refresh the list.

4. Corrections for pagination and filtering behavior
- Prompt summary: fix issues where only partial records were loaded, ensure pagination logic is correct, and align pipeline filters with real `status`/`stage` behavior.

5. Edit, status change, and notes management
- Prompt summary: add edit flow (`PUT /records/:id`), status update (`PATCH /records/:id`), note deletion with confirmation (`DELETE /records/:id/notes/:note_id`), and keep detail/list synchronized with loading/error feedback.

6. Lint-driven refactor without behavior change
- Prompt summary: fix `react-hooks/set-state-in-effect` warnings using minimal refactors, without changing UX, API contracts, or implemented functionality.

7. Global search fix across all candidates
- Prompt summary: keep page/limit pagination for normal navigation, but when typing in search, use the full candidate dataset (`getRecords()`), apply local search + current status/stage filters, cache full dataset, and return to paginated mode when search is empty.
