import { Source } from "../../types";
import defaultimage from "../../assets/default.avif";

// Define lookup tables for category , date and author filters
export const CATEGORY_PARAM_MAP: Record<
  string,
  (category: string) => Record<string, string>
> = {
  [Source.NewYorkTimes]: (category) => ({
    fq: `section_name:("${category}")`,
  }),
  [Source.TheGuardian]: (category) => ({ section: category }),
  [Source.NewsAPI]: (category) => ({ category: category }),
};

export const DATE_PARAM_MAP: Record<
  string,
  (date: string) => Record<string, string>
> = {
  [Source.NewYorkTimes]: (date) => ({
    begin_date: date.replace(/-/g, ""),
  }),
  [Source.TheGuardian]: (date) => ({ "from-date": date }),
  [Source.NewsAPI]: (date) => ({ from: date, to: date }),
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
  [Source.NewsAPI]: (author) => ({ author: author }),
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

//Identify the API source and normalize the response
export const API_SOURCE_PARSERS: Record<string, (data: any) => any[]> = {
  "nytimes.com": (data) =>
    data.response?.docs?.map((article: any) => ({
      title: article.headline?.main || "No Title",
      description: article?.abstract || "No Description",
      image: article.multimedia?.[0]?.url
        ? `https://www.nytimes.com/${article.multimedia[0].url}`
        : defaultimage,
      date: article?.pub_date || "",
      author: article.byline?.original || "Unknown",
      web_url: article?.web_url || "http://localhost:5173/",
      source: article?.source || "New York Times",
    })) || [],

  "guardianapis.com": (data) =>
    data.response?.results?.map((article: any) => ({
      title: article.webTitle || "No Title",
      description: article.fields?.trailText || "No Description",
      image: article.fields?.thumbnail || defaultimage,
      date: article.webPublicationDate || "",
      author: article.tags?.[0]?.webTitle || "Unknown",
      web_url: article?.webUrl || "http://localhost:5173/",
      source: "The Guardian",
    })) || [],

  "newsapi.org": (data) =>
    data.articles?.map((article: any) => ({
      title: article.title || "No Title",
      description: article.description || "No Description",
      image: article.urlToImage || defaultimage,
      date: article.publishedAt || "",
      author: article.author || "Unknown",
      web_url: article.url || "http://localhost:5173/",
      source: "NewsAPI.org",
    })) || [],
};
