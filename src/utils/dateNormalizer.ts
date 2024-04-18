import dayjs from 'dayjs';
import * as deLocale from 'dayjs/locale/de';
import * as enAuLocale from 'dayjs/locale/en-au';
import * as enCaLocale from 'dayjs/locale/en-ca';
import * as enGbLocale from 'dayjs/locale/en-gb';
import * as esLocale from 'dayjs/locale/es';
import * as esMxLocale from 'dayjs/locale/es-mx';
import * as frLocale from 'dayjs/locale/fr';
import * as frCaLocale from 'dayjs/locale/fr-ca';
import * as idLocale from 'dayjs/locale/id';
import * as trLocale from 'dayjs/locale/tr';

import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';
import timezonePlugin from 'dayjs/plugin/timezone';
import utcPlugin from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';

const localeMap = new Map([
  ['en', enCaLocale],
  ['en-ca', enCaLocale],
  ['en-au', enAuLocale],
  ['en-gb', enGbLocale],
  ['de', deLocale],
  ['es', esLocale],
  ['es-mx', esMxLocale],
  ['fr', frLocale],
  ['fr-ca', frCaLocale],
  ['tr', trLocale],
  ['id', idLocale],
]);
export type DateNormalizerOptions = {
  minuteFormat: 'mm' | 'm',
  hourFormat: 'HH' | 'H',
  dayFormat: 'D' | 'DD',
  monthFormat: 'MMMM' | 'MMM' | 'MM',
  yearFormat: 'YYYY' | 'YY',
};
export type DateNormalized = {
  minute: string,
  hour: string,
  day: string,
  month: string,
  year: string,
  dayjs: dayjs.Dayjs,
  isDateInPast: boolean,
};
export const dateNormalizer = (
  rawDate: string | number | dayjs.Dayjs,
  timezone?: string,
  locale?: string | ILocale,
  options: DateNormalizerOptions = {
    dayFormat: 'D',
    monthFormat: 'MMMM',
    yearFormat: 'YYYY',
    hourFormat: 'H',
    minuteFormat: 'm',
  },
): DateNormalized | undefined => {
  let dayJs: dayjs.Dayjs | undefined;
  dayjs.extend(utcPlugin);
  dayjs.extend(timezonePlugin);
  if (typeof rawDate === 'number') {
    dayJs = dayjs(new Date(rawDate));
  } else if (typeof rawDate === 'string') {
    dayjs.extend(customParseFormatPlugin);
    dayJs = dayjs(
      rawDate,
      rawDate.indexOf('-') > -1 ? 'YYYY-MM-DDTHH:mm:ssZ' : 'YYYYMMDDTHHmmssZ',
    );
  } else {
    dayJs = rawDate;
  }

  if (!dayJs) return undefined;

  const parsedDay = dayJs
    .locale(
      typeof locale === 'object'
        ? locale
        : localeMap.get(locale ?? 'en') ?? 'en',
    )
    .tz(timezone || 'Etc/UTC');
  const day = parsedDay.format(options.dayFormat);
  if (day === 'Invalid Date') return undefined;
  const month = parsedDay.format(options.monthFormat);
  const year = parsedDay.format(options.yearFormat);
  const hour = parsedDay.format(options.hourFormat);
  const minute = parsedDay.format(options.minuteFormat);
  return {
    day,
    month,
    year,
    hour,
    minute,
    dayjs: parsedDay,
    isDateInPast: parsedDay.isBefore(Date.now()),
  };
};
