/**
 * Barrel export for the Supabase Auth query helpers that remain here.
 * The CRUD query modules for application tables have been migrated to Prisma:
 *   import { getHomes, createDevice } from "@/lib/prisma/queries";
 *
 * This module now only re-exports the auth-related helpers below.
 */

export * from "./user";
