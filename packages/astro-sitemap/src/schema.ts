import { z } from 'zod';
import isValidFilename from 'valid-filename';
import { isValidUrl, isObjectEmpty } from '@/at-utils';
import { changefreqValues } from './constants';

const urlSchema = () =>
  z
    .string()
    .min(1)
    .refine((val) => !val || isValidUrl(val), 'Not valid url');

const localeKeySchema = () => z.string().min(1);

const isFunction = (fn: any) => fn instanceof Function;

export const SitemapOptionsSchema = z.object({
  filter: z
    .any()
    .refine((val) => !val || isFunction(val), { message: 'Not a function' })
    .optional(),

  customPages: urlSchema().array().optional(),

  canonicalURL: urlSchema().optional(),

  i18n: z
    .object({
      defaultLocale: localeKeySchema(),
      locales: z.record(
        localeKeySchema(),
        z
          .string()
          .min(2)
          .regex(/^[a-zA-Z\-]+$/gm, { message: 'Only English alphabet symbols and hyphen allowed' }),
      ),
    })
    .refine(({ locales, defaultLocale }) => locales[defaultLocale], {
      message: '`defaultLocale` must exists in `locales` keys',
    })
    .optional(),

  outfile: z
    .string()
    .min(1)
    .refine((val) => !val || isValidFilename(val), { message: 'Not valid file name' })
    .optional(),

  changefreq: z.enum(changefreqValues).optional(),
  lastmod: z.date().optional(),
  priority: z.number().min(0).max(1).optional(),
});