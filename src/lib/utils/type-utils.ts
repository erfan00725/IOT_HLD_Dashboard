export type ArrayElement<T> = T extends Array<infer U> ? U : never;

/**
 * Converts array-typed joined relations to single objects.
 * Use when Supabase types a FK join as T[] but you know it returns T.
 */
export type SingleRelation<T> = T extends (infer U)[] ? U : T;
