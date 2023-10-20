import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from './activities.js';
import { IPeople, Rule } from './shared.js';

const { fetchSwapiPeople, fetchRandomFilmQuote } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

function filterPeople(people: IPeople[], rules: Rule[]): IPeople[] {
  return people.filter((person) => {
    return rules.every((rule) => {
      const propertyValue = person[rule.propertyName as keyof IPeople];

      switch (rule.operator) {
        case 'containsNumbers':
          if (typeof propertyValue === 'string') {
            const regex = /\d+/;
            return regex.test(propertyValue);
          }
          return false;

        case 'equals':
          return propertyValue === rule.value;

        default:
          return true;
      }
    });
  });
}

export async function fetchAndFilterSwapiPeople(rules: Rule[]) {
  const people = await fetchSwapiPeople('https://swapi.dev/api/people/');

  return filterPeople(people, rules);
}

// fetches and logs a random movie quote every minute for 5 minutes
export async function generateRandomFilmQuoteEveryMinute(): Promise<string[]> {
  let count = 0;
  const maxTries = 2;
  const quotes = []
  while (count < maxTries) {
    const quote = await fetchRandomFilmQuote();
    quotes.push(quote)
    console.log(quote);
    count++;
    await sleep(10 * 60 * 100);
  }

  return quotes;
}
