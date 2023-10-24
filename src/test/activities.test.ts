import { MockActivityEnvironment } from '@temporalio/testing';
import * as activities from '../activities';

import fetch, { Response } from 'node-fetch';
jest.mock('node-fetch', () => jest.fn());

describe('SwapiWorkflow', () => {
  const env = new MockActivityEnvironment();

  it('fetch with mock activity', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    const json = jest.fn() as jest.MockedFunction<any>;
    json.mockResolvedValue({ status: 200, results: 'hello' });
    mockFetch.mockResolvedValue({ ok: true, json } as Response);

    const result = await env.run(activities.fetchSwapiPeople, 'https://swapi.dev/api/people/');

    expect(result).toEqual('hello');
  });

  it('should fetch a random film quote and format', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    const json = jest.fn() as jest.MockedFunction<any>;
    const mockFilmsResponse = {
      results: [
        {
          opening_crawl: 'It is a period of civil war.\r\nRebel spaceships...',
        },
      ],
    };

    json.mockResolvedValue({ status: 200, ...mockFilmsResponse });
    mockFetch.mockResolvedValue({ ok: true, json } as Response);

    const quote = await activities.fetchRandomFilmQuote();

    // Assert that the returned quote is formatted correctly
    expect(quote).toContain('It is a period of civil war. Rebel spaceships');
  });

  it('should handle errors gracefully', async () => {
    // Mock the fetch to reject with an error
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('API is down'));

    await expect(activities.fetchRandomFilmQuote()).rejects.toThrow('API is down');
  });
});
