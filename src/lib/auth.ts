import * as schema from "@/db/schema";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

export const auth = betterAuth({
  database: drizzleAdapter(drizzle(env.DB, { schema }), {
    provider: "sqlite",
  }),
});
