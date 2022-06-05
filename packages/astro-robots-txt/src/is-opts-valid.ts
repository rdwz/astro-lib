import { z } from 'zod';
import { RobotsTxtOptionsSchema } from './schema';
import type { RobotsTxtOptions } from './index';

// @internal
export const isOptsValid = (site: string | undefined, opts: RobotsTxtOptions) => {
  const schema = RobotsTxtOptionsSchema.extend({
    site: z.string().min(1, {
      message: '`site` property is required in `astro.config.mjs`.',
    }),
  });
  schema.parse({ site: site || '', ...(opts || {}) });
  return true;
};
