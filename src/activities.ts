import fetch from 'node-fetch';
import { IFilm, IPeople, SwapiResponse } from './shared';

export async function fetchSwapiPeople(url: string): Promise<IPeople[]> {
  try {
    const response = await fetch(url);
    const data = (await response.json()) as SwapiResponse;

    if (data.next) {
      // If there's a next page, fetch it and combine with current results
      const nextPageResults = await fetchSwapiPeople(data.next);
      return [...data.results, ...nextPageResults];
    } else {
      // No more pages, return current results
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
    const films = data.results;
    const randomFilm = films[Math.floor(Math.random() * films.length)];
    const quote = randomFilm.opening_crawl.replace(/\r\n\r\n/g, ' ').replace(/\r\n/g, ' ');

    return quote;
  } catch (error) {
    console.error('Failed to fetch films and generate random quote:', error);
    throw error;
  }
}
