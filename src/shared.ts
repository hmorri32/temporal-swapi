export type SwapiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
};

export type Operator = 'containsNumbers' | 'equals' | 'greaterThan' | 'lessThan';

export type Rule = {
  propertyName: string;
  operator: 'containsNumbers' | 'equals' | 'greaterThan' | 'lessThan';
  value: any;
};

export interface IPeople {
  birth_year: string;
  eye_color: string;
  films: string[];
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string;
  mass: string;
  name: string;
  skin_color: string;
  created: string;
  edited: string;
  species: string[];
  starships: string[];
  url: string;
  vehicles: string[];
}

export interface IFilm {
  characters: string[] | IPeople[];
  created: string;
  director: string;
  edited: string;
  episode_id: string;
  opening_crawl: string;
  planets: string[];
  producer: string;
  release_date: string;
  species: string[];
  starships: string[];
  title: string;
  url: string;
  vehicles: string[];
}
