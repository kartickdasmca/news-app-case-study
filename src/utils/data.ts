import { Source } from "../types/index";

export const sources = [
  { value: Source.NewYorkTimes, label: "New York Times" },
  { value: Source.TheGuardian, label: "The Guardian" },
  { value: Source.NewsAPI, label: "NewsAPI.org" },
];

export const categoryMapping: Record<
  string,
  { label: string; value: string }[]
> = {
  [Source.NewYorkTimes]: [
    { label: "World", value: "world" },
    { label: "Technology", value: "technology" },
    { label: "Science", value: "science" },
    { label: "Health", value: "health" },
    { label: "Sports", value: "sports" },
    { label: "Arts", value: "arts" },
    { label: "Fashion", value: "fashion" },
  ],
  [Source.TheGuardian]: [
    { label: "World", value: "world" },
    { label: "Politics", value: "politics" },
    { label: "Business", value: "business" },
    { label: "Technology", value: "technology" },
    { label: "Science", value: "science" },
    { label: "Sports", value: "sport" },
    { label: "Culture", value: "culture" },
    { label: "Film", value: "film" },
    { label: "Music", value: "music" },
  ],
  [Source.NewsAPI]: [
    { label: "Business", value: "business" },
    { label: "Entertainment", value: "entertainment" },
    { label: "General", value: "general" },
    { label: "Health", value: "health" },
    { label: "Science", value: "science" },
    { label: "Sports", value: "sports" },
    { label: "Technology", value: "technology" },
  ],
};
