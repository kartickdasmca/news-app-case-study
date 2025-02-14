import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../app/store";
import defaultimage from "../../assets/default.avif";
import {
  AUTHOR_PARAM_MAP,
  DATE_PARAM_MAP,
  CATEGORY_PARAM_MAP,
  API_CONFIG,
} from "../lookup_table";

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

      // Search Filters
      if (searchTerm || filterCategory || filterDate || filterSource) {
        // If search filters exist, override preferences
        if (searchTerm) params.q = formattedSearchTerm; // 'q' param is the same for all sources

        if (filterCategory && CATEGORY_PARAM_MAP[filterSource]) {
          Object.assign(
            params,
            CATEGORY_PARAM_MAP[filterSource](filterCategory)
          );
        }

        if (filterDate && DATE_PARAM_MAP[filterSource]) {
          Object.assign(params, DATE_PARAM_MAP[filterSource](filterDate));
        }
      }
      // Preference Filters (category, author, source)
      else if (category || author || source) {
        // If no search filters but preferences exist, use preferences
        if (source && category && CATEGORY_PARAM_MAP[source]) {
          Object.assign(params, CATEGORY_PARAM_MAP[source](category));
        }

        if (source && author && AUTHOR_PARAM_MAP[source]) {
          Object.assign(params, AUTHOR_PARAM_MAP[source](author));
        }
      } else {
        // Default: Fetch trending news
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
