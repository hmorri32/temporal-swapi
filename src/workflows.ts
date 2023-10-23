import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from './activities.js';
import { IPeople, Rule } from './shared.js';

const { fetchSwapiPeople, fetchRandomFilmQuote } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export function matchesRule(person: IPeople, rule: Rule): boolean {
  const propertyValue = person[rule.propertyName as keyof IPeople];

  switch (rule.operator) {
    case 'containsNumbers':
      return typeof propertyValue === 'string' && /\d+/.test(propertyValue);

    case 'equals':
      return propertyValue === rule.value;

    case 'greaterThan': // todo handle type coercion
      return propertyValue > rule.value;

    case 'lessThan':
      return propertyValue < rule.value;

    default:
      return true;
  }
}

export function filterPeople(people: IPeople[], rules: Rule[], logic: 'AND' | 'OR' = 'AND'): IPeople[] {
  return people.filter((person) => {
    const results = rules.map((rule) => matchesRule(person, rule));

    return logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
  });
}

export async function fetchAndFilterSwapiPeople(rules: Rule[]) {
  const people = await fetchSwapiPeople('https://swapi.dev/api/people/');

  return filterPeople(people, rules);
}

// fetches and logs a random movie quote every minute for 5 minutes
export async function generateRandomFilmQuoteEveryMinute(): Promise<string[]> {
  let count = 0;
  const maxTries = 5;
  const quotes = [];
  while (count < maxTries) {
    const quote = await fetchRandomFilmQuote();
    quotes.push(quote);
    console.log(quote);
    count++;
    await sleep(10 * 60 * 100);
  }

  return quotes;
}
