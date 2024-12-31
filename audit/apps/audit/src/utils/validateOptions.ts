import { z } from 'zod';

const schema = z.object({
  urls: z.array(z.string().url()),
});

export type Config = z.infer<typeof schema>;
export const isOptionsValid = (config: any): boolean => {
  return schema.safeParse(config).success;
};
