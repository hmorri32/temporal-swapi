export type SwapiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
};

export type Rule = {
  propertyName: string;
  operator: string;
  value: any;
};

export interface IPeople {
  birth_year: string;
  eye_color: string;
  films: IFilm[];
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string;
  mass: string;
  name: string;
  skin_color: string;
  created: Date;
  edited: Date;
  species: string[];
  starships: string[];
  url: string;
  vehicles: string[];
}

export interface IFilm {
  characters: string[] | IPeople[];
  created: Date;
  director: string;
  edited: Date;
  episode_id: string;
  opening_crawl: string;
  planets: string[];
  producer: string;
  release_date: Date;
  species: string[];
  starships: string[];
  title: string;
  url: string;
  vehicles: string[];
}
