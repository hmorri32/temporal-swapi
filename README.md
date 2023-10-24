# Temporal Star Wars

Exploration of Temporal.io TypeScript SDK + Star Wars API

### Configuration

1. `temporal server start-dev` to start [Temporal Server](https://github.com/temporalio/cli/#installation).
1. `npm install` to install dependencies.
1. `npm run start.watch` to start the Worker.
1. In another shell, `npm run workflow` to run the Workflow.

Navigate to `localhost:8233` (or wherever you have pointed your temporal server) to see the temporal web UI.

### Workflows

#### `fetchAndFilterSwapiPeople`

Fetches a list of people from the Star Wars API and filters based on rules. Supports `OR` + `AND` filtering and `containsNumber`, `equals`, `greaterThan`, and `lessThan` operators. See `matchesRule` for the full list of supported operators.

```js
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
```

#### `generateRandomFilmQuoteEveryMinute`

Fetches a random quote from the star wars films api every minute and prints it to the console. When complete, returns a list of all quotes fetched.
Return value looks something like: (truncated)

```js
[
  'It is a dark time for the Rebellion. ...etc',
  'Turmoil has engulfed the Galactic Republic. ...etc',
  'There is unrest in the Galactic Senate. ...etc',
  '...etc',
];
```

#### Testing

`npm run jest` will run the workflows and activities tests.

Coverage:
```js
----------------|---------|----------|---------|---------|----------------------
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------|---------|----------|---------|---------|----------------------
All files       |   65.45 |    88.88 |      75 |   64.81 |
 src            |   64.81 |    88.88 |      75 |   64.15 |
  activities.ts |   80.95 |       50 |     100 |   80.95 | 10-11,16-17
  workflows.ts  |   54.54 |    93.75 |   66.66 |   53.12 | 23,29-32,45-47,52-63
 src/test       |     100 |      100 |     100 |     100 |
  mockPeople.ts |     100 |      100 |     100 |     100 |
----------------|---------|----------|---------|---------|----------------------

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        4.312 s
```

#### esm info

Configuring a Temporal project with TypeScript and [ES Modules](https://nodejs.org/api/esm.html).

Fundamental difference from CommonJS:

- [`package.json`](./package.json) has `"type": "module"` attribute.
- [`tsconfig.json`](./tsconfig.json) outputs in `esnext` format.
- Imports [must](https://nodejs.org/api/esm.html#esm_mandatory_file_extensions) include the `.js` file extension.
