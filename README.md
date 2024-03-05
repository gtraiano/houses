# Houses

This repository contains source code for both the backend and frontend.
All source code written in `TypeScript`.

The fronted has been setup by [`create-next-app`](https://www.npmjs.com/package/create-next-app), whereas for the backend we followed this [article](https://blog.logrocket.com/how-to-set-up-node-typescript-express/).

Live demo:
- [frontend](https://houses-e1mf.onrender.com)
- [backend](https://houses-backend.onrender.com)

## Scripts
For both parts of the project, the user needs to run `npm install` in each part's respective folder.

### Backend
`npm start` to start the server (after it has been built)

`npm run dev` to star the server in development mode

`npm run build` to build the server (build output in `./dist`)

### Frontend
`npm start` to serve the frontend
`npm run dev` to start development server
`npm run build` to build the frontend

## Configuration
The following environment variables need to be set in `./.env`.

|Variable|Description|Default Value|
|-|-|-|
|`BACKEND_URL`|backend URL| |
|`BACKEND_PORT`|backend port (optional)|4000|
|`REMOTE_API_URL`|fallback backend URL|https://wizard-world-api.herokuapp.com|

## Backend
Written in `Node.js` using `Express` framework.

### Database
All API data access/storage is performed in memory, with permanent storage in a local JSON file (for backup purposes).

On startup, the backend fetches all house data from `REMOTE_API_URL`. Should an error occur, it serves data from its local copy.

### REST API
Per the project requirements, the backend implements a `/houses` endpoint.

Furthermore, two extra endpoints have been added:
1. `/` responds with an HTML info page
2. `houses/querykeys` responds with the supported `/houses` parameter names

A summary table of all supported endpoints/parameters combinations follows

|endpoint|method|parameter|description|
|-|-|-|-|
|houses|GET||get all houses|
|houses|GET|id|query by id|
|houses|GET|name|query by name|
|houses|GET|houseColours|query by house colours|
|houses|GET|founder|query by house founder|
|houses|GET|animal|query by house animal|
|houses|GET|element|query by house element|
|houses|GET|ghost|query by house ghost|
|houses|GET|commonRoom|query by house common room|
|houses|GET|heads|query by value contained in house heads|
|houses|GET|traits|query by value contained in house traits|
|houses/querykeys|GET||get all valid query keys|

The API currently supports queries with **only a single** parameter.

## Frontend
Written in `React` (`Next.js` flavour), uses `Tailwind CSS` framework for styling.

The application uses React's [Context API](https://react.dev/reference/react/useContext) for state management.

### Flow
The application consists of two major UI elements
1. a query form
2. a query results grid

A typical interaction scenario between the components is the following

0. application startup
   1. fetch supported API query keys
   2. populate query form with supported query keys
1. alter query state via the query form (set *key* and *value*)
2. application performs an API query
   1. alters query results state (or message state if necessary)
   2. on failure, alters local error state
3. application populates the query results grid, or sets an information/error accordingly
4. back to step (1.)

### Application State
In the early phases of development, state was kept locally at the topmost level component (`Home`). The component listened to `input` events from the query form and set the state accordingly. However, since the component had many responsibilities, it grew large. [Prop drilling would be of no help to the issue, plus we needed two-way data flow.]

After taking the issue into consideration, along with the "...you will be asked to extend your code" hint, the decision was made to move towards a *"store"*-type state management. Thus enter `Context` API.


```typescript
const initialState: State = {
	items: {                                    // query result
		items: []
	},
	query: {                                    // query 
		queryKeys: ['name'],                    // supported query keys
		query: { key: 'name', text: '' },       // query parameter and value
		url: new URL(...)                       // API URL (currently unused)
	}
}
```
<center><font size="2">Schema of the application state</font></center>

### API Controller
Class `HousesAPIController` performs requests to the API. It exposes a `HousesAPIControllerRequest` member for each endpoint. Although the supported endpoints are preset, the class offers a method to add new endpoints.

```typescript
interface HousesAPIController {
    baseUrl: URL,                                                   // API base URL
    endpoints: {
        queryKeys: HousesAPIControllerRequest<HousesDBQueryKey[]>,  // /houses/querykeys endpoint
        houses: HousesAPIControllerRequest<HousesDBQueryResult>,    // /houses endpoint
        [key: string]: HousesAPIControllerRequest<any>              // further endpoints to be added
    }
}
```
<center><font size="2">API controller interface with preset endpoints</font></center>

The generic API request interface exposes an endpoint string, a request method, plus two optional properties: an abort controller and an abort method.

```typescript
// API request
interface HousesAPIControllerRequest<T> {
	endpoint: string,                           // endpoint
    abortController?: AbortController | null,   // abort controller
    abort?: () => void,                         // abort request
    request: (...args: any) => Promise<T>       // request fetcher
}
```
<center><font size="2">API request interface</font></center>

### Components
#### `HouseCard`
Renders a card containing all required information for a house.

To overcome the "invalid CSS colour" challenge, a default white to black gradient has been defined as fallback in the component's stylesheet.

#### `QueryResults`
Renders `HouseCard` components in a 4-column grid. Additionaly,
- an overlay containg a spinner is rendered while the application is busy
- information/error messages are rendered on appropriate occasions

#### `QueryForm`
A form with the necessary fields to perform an API request. No API requests operations are handled by the component, it is strictly limited to setting the query state.

#### `Spinner`
A spinner animation component. Credit https://tw-elements.com/docs/standard/components/spinners/.

#### `Home`
Top level component, renders the query form and results grid. Performs all API requests.