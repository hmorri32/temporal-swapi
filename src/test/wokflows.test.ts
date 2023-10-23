import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker } from '@temporalio/worker';
import { fetchAndFilterSwapiPeople, filterPeople, matchesRule } from '../workflows';
import { Rule } from '../shared';
import { mockPeople } from './mockPeople';

describe('SwapiWorkflow', () => {
  let testEnv: TestWorkflowEnvironment;
  beforeAll(async function () {
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  afterAll(async () => {
    await testEnv?.teardown();
  });

  describe('fetchAndFilterSwapiPeople', () => {
    it('fetches + filters swapi people that contain numbers in their name', async () => {
      const { client, nativeConnection } = testEnv;
      const taskQueue = 'test';

      const worker = await Worker.create({
        connection: nativeConnection,
        taskQueue,
        workflowsPath: require.resolve('../workflows'),
        activities: {
          fetchSwapiPeople: async () => mockPeople,
        },
      });

      const rules: Rule[] = [
        {
          propertyName: 'name',
          operator: 'containsNumbers',
          value: null,
        },
        {
          propertyName: 'eye_color',
          operator: 'equals',
          value: 'yellow',
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
  });

  describe('matchesRule', () => {
    const mockLuke = mockPeople[0];

    it('should match equals', () => {
      const rule: Rule = {
        propertyName: 'eye_color',
        operator: 'equals',
        value: 'blue',
      };

      expect(matchesRule(mockLuke, rule)).toBe(true);
    });

    it('should match containsNumbers', () => {
      const rule: Rule = {
        propertyName: 'name',
        operator: 'containsNumbers',
        value: null,
      };

      expect(matchesRule(mockLuke, rule)).toBe(false);
    });

    it('should match greaterThan', () => {
      const rule: Rule = {
        propertyName: 'height',
        operator: 'greaterThan',
        value: '170',
      };

      expect(matchesRule(mockLuke, rule)).toBe(true);
    });

    it('should match lessThan', () => {
      const rule: Rule = {
        propertyName: 'height',
        operator: 'lessThan',
        value: '175',
      };

      expect(matchesRule(mockLuke, rule)).toBe(true);
    });

    it('should handle non-existent properties', () => {
      const rule: Rule = {
        propertyName: 'non_existent_prop',
        operator: 'equals',
        value: 'something',
      };

      expect(matchesRule(mockLuke, rule)).toBe(false);
    });
  });

  describe('filterPeople', () => {
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

    it('handles AND filtering', () => {
      const expected = mockPeople.filter((person) => {
        return person.eye_color === 'red' && person.name.match(/\d+/);
      });

      expect(filterPeople(mockPeople, rules).length).toBe(expected.length);
    });

    it('handles OR filtering', () => {
      const expected = mockPeople.filter((person) => {
        return person.eye_color === 'red' || person.name.match(/\d+/);
      });

      filterPeople(mockPeople, rules, 'OR');
      expect(filterPeople(mockPeople, rules, 'OR').length).toBe(expected.length);
    });
  });

  describe('generateRandomFilmQuoteEveryMinute', () => {
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
});
