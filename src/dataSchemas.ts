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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = rootSchema.parse(require('./data.json'));

export const getAddons = (): Array<Addon> => {
    const addons: Array<Addon> = [];
    for (const addonName of addonListSchema.parse(data['./addons.json']).sort()) {
        addons.push(addonSchema.parse(data[`./${addonName}/addon.json`]));
    }
    return addons;
};

export const getAddon = (addonName: string): Addon => {
    return addonSchema.parse(data[`./${addonName}/addon.json`]);
};

export const getAddonVersionConfiguration = (addonName: string, addonVersion: string): AddonVersionConfiguration => {
    return addonVersionConfigurationSchema.parse(data[`./${addonName}/configurations/${addonVersion}.json`]);
};
