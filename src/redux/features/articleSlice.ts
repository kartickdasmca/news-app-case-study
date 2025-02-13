import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../app/store";
import defaultimage from "../../assets/default.avif";

import { NormalizedArticle, Article, Source } from "../../types";

// Define state type
interface ArticleState {
  articles: NormalizedArticle[];
  searchTerm?: string;
  filterCategory: string;
  filterSource: string;
  filterDate: any;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

// Initial state
const initialState: ArticleState = {
  articles: [],
  searchTerm: "",
  filterCategory: "",
  filterSource: "",
  filterDate: null,
  status: "idle",
  error: null,
};

// Async Thunk for fetching articles
export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      const { category, source, author } = state.preferences;
      const { searchTerm, filterCategory, filterSource, filterDate } =
        state.articles;
      const formattedSearchTerm = searchTerm
        ? encodeURIComponent(searchTerm.trim())
        : "";

      // Setting source/API endpoint based on user's filter, preference & default
      const API_CONFIG: Record<
        string,
        { BASE_URL: string; API_KEY: string; apiKeyParam: string }
      > = {
        NewYorkTimes: {
          BASE_URL: import.meta.env.VITE_API_NYT,
          API_KEY: import.meta.env.VITE_NYT_APIKEY,
          apiKeyParam: "api-key",
        },
        TheGuardian: {
          BASE_URL: import.meta.env.VITE_API_GUARDIAN,
          API_KEY: import.meta.env.VITE_GUARDIAN_APIKEY,
          apiKeyParam: "api-key",
        },
        "NewsAPI.org": {
          BASE_URL: import.meta.env.VITE_API_NEWSAPIORG,
          API_KEY: import.meta.env.VITE_NEWSAPIORG_APIKEY,
          apiKeyParam: "apiKey", // NewsAPI.org uses "apiKey"
        },
      };

      const selectedSource = filterSource || source || Source.NewYorkTimes; // Priority: filterSource > source > default

      const apiConfig =
        API_CONFIG[selectedSource] || API_CONFIG[Source.NewYorkTimes];
      const BASE_URL = apiConfig.BASE_URL;
      const params: Record<string, string> = {};
      params[apiConfig.apiKeyParam] = apiConfig.API_KEY;

      if (selectedSource == Source.TheGuardian) {
        params["show-tags"] = "contributor";
        params["show-fields"] = "thumbnail,trailText";
      }
      //Filters condition
      if (searchTerm || filterCategory || filterDate || filterSource) {
        // If search filters exist, override preferences
        if (searchTerm) params.q = formattedSearchTerm; //q param same for all 3 api

        if (filterCategory) {
          if (filterSource == Source.NewYorkTimes)
            // (future scope) here we could use mapping approach instead of multiple if else for better maintanability & avoiding Redundant Condition Checks
            params.fq = `section_name:("${filterCategory}")`;
          if (filterSource == Source.TheGuardian)
            params.section = filterCategory;
        }
        if (filterDate) {
          if (filterSource == Source.NewYorkTimes)
            params.begin_date = filterDate.replace(/-/g, "");
          if (filterSource == Source.TheGuardian)
            params["from-date"] = filterDate;
        }
      } else if (category || author || source) {
        // If no search filters but preferences exist, use preferences
        if (source == Source.NewYorkTimes) {
          params.fq = [
            author ? `byline:("${encodeURIComponent(author)}")` : "",
            category ? `section_name:("${category}")` : "",
          ]
            .filter(Boolean)
            .join(" AND "); // Combine filters
        } else if (source == Source.TheGuardian) {
          if (author) {
            params["tag"] = `profile/${author
              .replace(/\s+/g, "-")
              .toLowerCase()}`;
          }
          if (category) params.section = category;
        }
      } else {
        // Default : Fetch trending news
        params.q = "latest";
      }

      console.log(params);
      console.log("BASE_URL", BASE_URL);
      //API calling
      const response = await axios.get(BASE_URL, { params });

      // Identify the API source and normalize the response
      if (BASE_URL.includes("nytimes.com")) {
        return (
          response.data.response?.docs?.map((article: any) => ({
            title: article.headline?.main || "No Title",
            description: article?.abstract || "No Description",
            image: article.multimedia?.[0]?.url
              ? `https://www.nytimes.com/${article.multimedia[0].url}`
              : defaultimage,
            date: article?.pub_date || "",
            author: article.byline?.original || "Unknown",
            web_url: article?.web_url || "http://localhost:5173/",
            source: article?.source || "New York Times ",
          })) || []
        );
      }

      if (BASE_URL.includes("guardianapis.com")) {
        return (
          response.data.response?.results?.map((article: any) => ({
            title: article.webTitle || "No Title",
            description: article.fields?.trailText || "No Description",
            image: article.fields?.thumbnail || defaultimage,
            date: article.webPublicationDate || "",
            author: article.tags?.[0]?.webTitle || "Unknown",
            web_url: article?.webUrl || "http://localhost:5173/",
            source: "The Guardian",
          })) || []
        );
      }
      if (BASE_URL.includes("newsapi.org")) {
        //need to implement
        return [];
      }
      return [];
      //return response.data;
    } catch (error: any) {
      console.error("Error fetching", error);
      return rejectWithValue(error);
    }
  }
);

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setSearchFilters: (
      state,
      action: PayloadAction<{
        searchTerm: string;
        filterCategory: string;
        filterSource: string;
        filterDate: any;
      }>
    ) => {
      state.searchTerm = action.payload.searchTerm;
      state.filterCategory = action.payload.filterCategory;
      state.filterSource = action.payload.filterSource;
      state.filterDate = action.payload.filterDate;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchArticles.fulfilled,
        (state, action: PayloadAction<NormalizedArticle[]>) => {
          state.status = "succeeded";

          state.articles = action.payload;
          console.log("payload", action.payload);
        }
      )
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to fetch articles";
      });
  },
});

export const { setSearchFilters } = articleSlice.actions;
export default articleSlice.reducer;
