export enum SelectedPage {
  Home = "home",
  ContactUs = "contactus",
}

export interface BenefitType {
  icon: any;
  title: string;
  description: string;
}
// Define Preferences type
export type PreferencesState = {
  category: string;
  source: string;
  author: string;
};

// Define dropdown type
export interface DropdownProps {
  label?: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface NormalizedArticle {
  title: string;
  description: string;
  image: string;
  date: Date;
  author: string;
  source: string;
  web_url: string;
}
export enum Source {
  NewYorkTimes = "NewYorkTimes",
  TheGuardian = "TheGuardian",
  NewsAPI = "NewsAPI.org",
}
//Type For API request
export interface Article {
  //new york times
  headline?: { main: string }; //heading
  abstract?: string; //article content
  web_url?: string;
  pub_date?: string;
  section_name?: string; //category
  byline?: { original?: string }; // Author
  multimedia?: {
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
  }[]; //image url

  //The Guardian
  webTitle?: string; // heading
  webUrl?: string;
  sectionName?: string; // category
  webPublicationDate?: string;
  fields?: {
    thumbnail?: string; //image url
    trailText?: string; //article content
  };
  authors?: string[];
}
