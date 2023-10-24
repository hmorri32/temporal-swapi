import { Client } from '@temporalio/client';
import { fetchAndFilterSwapiPeople, generateRandomFilmQuoteEveryMinute } from './workflows.js';
import { Rule } from './shared.js';

const rules: Rule[] = [
  {
    propertyName: 'name',
    operator: 'containsNumbers',
    value: null,
  },
  {
    propertyName: 'eye_color',
    operator: 'equals',
    value: 'red',
  },
];

const client = new Client();

const filteredPeople = await client.workflow.execute(fetchAndFilterSwapiPeople, {
  taskQueue: 'swapi',
  workflowId: 'swapi-filtered-people',
  args: [rules],
});

const filmQuotes = await client.workflow.execute(generateRandomFilmQuoteEveryMinute, {
  taskQueue: 'swapi',
  workflowId: 'swapi-film-quote',
});

console.log(filteredPeople, filmQuotes);
