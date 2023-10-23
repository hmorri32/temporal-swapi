import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker } from '@temporalio/worker';
import { fetchAndFilterSwapiPeople } from '../workflows';
import * as activities from '../activities';

describe('SwapiWorkflow', () => {
  let testEnv: TestWorkflowEnvironment;
  beforeAll(async function () {
    // this.timeout(_000);
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  afterAll(async () => {
    await testEnv?.teardown();
  });

  it('fetches + filters swapi people that contain numbers in their name', async () => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const mockPeople = [
      {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'https://swapi.dev/api/planets/1/',
      },
      {
        name: 'C-3PO',
        height: '167',
        mass: '75',
        hair_color: 'n/a',
        skin_color: 'gold',
        eye_color: 'yellow',
        birth_year: '112BBY',
        gender: 'n/a',
        homeworld: 'https://swapi.dev/api/planets/1/',
      },
    ];

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue,
      workflowsPath: require.resolve('../workflows'),
      activities: {
        fetchSwapiPeople: async () => mockPeople,
      },
    });

    const rules = [
      {
        propertyName: 'name',
        operator: 'containsNumbers',
        value: null,
      },
    ];

    await worker.runUntil(async () => {
      const result = await client.workflow.execute(fetchAndFilterSwapiPeople, {
        args: [rules],
        workflowId: 'test-test',
        taskQueue,
      });

      const C3PO = mockPeople[1];

      expect(result[0]).toEqual(C3PO);
    });
  });

  it('fetches and generates a random film quote every minute for five minutes', async () => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const mockFilmsResponse = {
      results: [
        {
          opening_crawl: 'It is a period of civil war.\r\nRebel spaceships...',
        },
      ],
    };

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue,
      workflowsPath: require.resolve('../workflows'),
      activities: {
        fetchRandomFilmQuote: async () => {
          return mockFilmsResponse.results[0].opening_crawl.replace(/\r\n\r\n/g, ' ').replace(/\r\n/g, ' ');
        },
      },
    });

    await worker.runUntil(async () => {
      const result = await client.workflow.execute('generateRandomFilmQuoteEveryMinute', {
        workflowId: 'test-test',
        taskQueue,
      });

      // generates and logs quote 5x // returns all quotes in arr
      expect(result.length).toBe(5);
    });
  });
});
