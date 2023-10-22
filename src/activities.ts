import fetch from 'node-fetch';
import { IPeople, SwapiResponse } from './shared';

export async function fetchSwapiPeople(url: string): Promise<IPeople[]> {
  try {
    const response = await fetch(url);
    const data = (await response.json()) as SwapiResponse;

    if (data.next) {
      const nextPageResults = await fetchSwapiPeople(data.next);
      return [...data.results, ...nextPageResults];
    } else {
      return data.results;
    }
  } catch (error) {
    console.error('Failed to fetch people:', error);
    throw error;
  }
}

export async function fetchRandomFilmQuote(): Promise<string> {
  try {
    const response = await fetch('https://swapi.dev/api/films/');
    const data = (await response.json()) as SwapiResponse;
    console.log(data)
    const films = data.results;
    const randomFilm = films[Math.floor(Math.random() * films.length)];
    const quote = randomFilm.opening_crawl.replace(/\r\n\r\n/g, ' ').replace(/\r\n/g, ' ');

    return quote;
  } catch (error) {
    console.error('Failed to fetch films and generate random quote:', error);
    throw error;
  }
}
