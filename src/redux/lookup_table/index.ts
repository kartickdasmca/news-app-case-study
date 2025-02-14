import { Source } from "../../types";

// Define lookup tables for category , date and author filters
export const CATEGORY_PARAM_MAP: Record<
  string,
  (category: string) => Record<string, string>
> = {
  [Source.NewYorkTimes]: (category) => ({
    fq: `section_name:("${category}")`,
  }),
  [Source.TheGuardian]: (category) => ({ section: category }),
};

export const DATE_PARAM_MAP: Record<
  string,
  (date: string) => Record<string, string>
> = {
  [Source.NewYorkTimes]: (date) => ({
    begin_date: date.replace(/-/g, ""),
  }),
  [Source.TheGuardian]: (date) => ({ "from-date": date }),
};

export const AUTHOR_PARAM_MAP: Record<
  string,
  (author: string) => Record<string, string>
> = {
  [Source.NewYorkTimes]: (author) => ({
    fq: `byline:("${encodeURIComponent(author)}")`,
  }),
  [Source.TheGuardian]: (author) => ({
    tag: `profile/${author.replace(/\s+/g, "-").toLowerCase()}`,
  }),
};

// Setting source/API endpoint
export const API_CONFIG: Record<
  string,
  { BASE_URL: string; API_KEY: string; apiKeyParam: string }
> = {
  [Source.NewYorkTimes]: {
    BASE_URL: import.meta.env.VITE_API_NYT,
    API_KEY: import.meta.env.VITE_NYT_APIKEY,
    apiKeyParam: "api-key",
  },
  [Source.TheGuardian]: {
    BASE_URL: import.meta.env.VITE_API_GUARDIAN,
    API_KEY: import.meta.env.VITE_GUARDIAN_APIKEY,
    apiKeyParam: "api-key",
  },
  [Source.NewsAPI]: {
    BASE_URL: import.meta.env.VITE_API_NEWSAPIORG,
    API_KEY: import.meta.env.VITE_NEWSAPIORG_APIKEY,
    apiKeyParam: "apiKey", // NewsAPI.org uses "apiKey"
  },
};
