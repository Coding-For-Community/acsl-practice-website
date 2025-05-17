## Stuff to remember

1. Add the sheet id and other env vars

```
cd backend
npx vercel env add SHEET_ID
npx vercel env add OPENAI_API_KEY
npx vercel env pull
```

2. If your .venv is in the root dir instead of the backend dir, make sure your imports start with `import .xxxx` instead of `import backend.xxxx`
3. The `request: Request` argument is necessary for slowapi to work. You also cant change the name of it(annoying)
