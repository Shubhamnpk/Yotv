export interface Channel {
  id: string;
  name: string;
  alt_names?: string[];
  network?: string;
  country: string;
  languages: string[];
  categories: string[];
  logo: string;
}

export interface Stream {
  channel: string;
  url: string;
  timeshift?: string;
  http_referrer?: string;
  user_agent?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Language {
  name: string;
  code: string;
}