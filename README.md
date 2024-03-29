# Cairo chatbot

This is a chatbot to help you learn and code with the [Cairo language](https://cairo-lang.org/)

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `chatbot`: a [Next.js](https://nextjs.org/) app. The application is highly inspired by the vercel ai chatbot template (https://github.com/supabase-community/vercel-ai-chatbot).
- `@repo/ai`: a package for the AI use cases
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Develop

You will need `OPENAI_API_KEY` and `MONGODB_ATLAS_URI` environment set properly.
```shell
export OPENAI_API_KEY="sk-<...>"
export MONGODB_ATLAS_URI="mongodb+srv:<...>"
```

To develop all apps and packages, run the following command:

```
pnpm dev
```


