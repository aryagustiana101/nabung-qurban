import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
  from: parseAsString,
  scope: parseAsString,
  keyword: parseAsString,
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  scopes: parseAsArrayOf(parseAsString),
  statuses: parseAsArrayOf(parseAsString),
  services: parseAsArrayOf(parseAsString),
  categories: parseAsArrayOf(parseAsString),
});
