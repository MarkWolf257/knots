import * as schema from "@/db/schema.ts";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { defineMiddleware } from "astro:middleware";
import { betterAuth } from "better-auth";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

export const onRequest = defineMiddleware(async (context, next) => {
  const auth = betterAuth({
    database: drizzleAdapter(drizzle(env.DB, { schema }), {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
  });

  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }
  context.locals.authHandler = auth.handler;

  return next();
});
