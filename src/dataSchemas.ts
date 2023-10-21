import { z } from 'zod';

export const rootSchema = z.record(z.unknown());

export type Root = z.infer<typeof rootSchema>;

export const addonListSchema = z.array(z.string());

export type AddonList = z.infer<typeof addonListSchema>;

export const addonSchema = z.object({
    addonVersions: z.array(z.object({
        addonVersion: z.string(),
    })),
    publisher: z.string(),
    type: z.string(),
    addonName: z.string(),
    owner: z.string(),
});

export type Addon = z.infer<typeof addonSchema>;

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
    z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const addonVersionConfigurationSchema = jsonSchema;

export type AddonVersionConfiguration = z.infer<typeof addonVersionConfigurationSchema>;
