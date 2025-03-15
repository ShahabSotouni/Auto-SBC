"
# API Documentation

This API provides access to the EA Sports FC Ultimate Team web app's internal global objects and methods. It allows users to interact with the game's API to perform various actions such as solving SBCs, fetching player prices, and more.

## Endpoints

### GET /sbcSets

Returns a list of available SBC sets.

* Response: `JSON` object containing an array of SBC sets.
* Example Response:
```json
[
  {
    \"id\": 1,
    \"name\": \"SBC Set 1\"
  },
  {
    \"id\": 2,
    \"name\": \"SBC Set 2\"
  }
]
```
* Usage: To fetch the list of SBC sets, make a GET request to `http://localhost:5000/sbcSets`.

### GET /challenges

Returns a list of challenges for a specific SBC set.

* Query Parameters:
  * `setId`: The ID of the SBC set.
* Response: `JSON` object containing an array of challenges.
* Example Response:
```json
[
  {
   \"id\": 1,
    \"name\": \"Challenge 1\"
  },
  {
   \"id\": 2,
    \"name\": \"Challenge 2\"
  }
]
```
* Usage: To fetch the list of challenges for an SBC set, make a GET request to `http://localhost:5000/challenges?setId={setId}`.

### POST /solveSBC

Solves an SBC challenge.

* Request Body:
  * `setId`: The ID of the SBC set.
  * `challengeId`: The ID of the challenge.
* Response: `JSON` object containing the solution.
* Example Response:
```json
{
  \"status\": \"success\",
  \"solution\": [
    {
      \"id\": 1,
      \"name\": \"Player 1\"
    },
    {
      \"id\": 2,
      \"name\": \"Player 2\"
    }
  ]
}
```
* Usage: To solve an SBC challenge, make a POST request to `http://localhost:5000/solveSBC` with the required request body.

### GET /playerPrices

Returns a list of player prices.

* Response: `JSON` object containing an array of player prices.
* Example Response:
```json
[
  {
    \"id\": 1,
    \"name\": \"Player 1\",
    \"price\": 1000
  },
  {
    \"id\": 2,
    \"name\": \"Player 2\",
    \"price\": 500
  }
]
```
* Usage: To fetch the list of player prices, make a GET request to `http://localhost:5000/playerPrices`.

## Global Objects and Methods

### services

* `services.SBC`: Provides access to SBC-related functionality.
        + `services.SBC.loadChallenge`: Loads a challenge.
        + `services.SBC.submitChallenge`: Submits a challenge.
* `services.Item`: Provides access to item-related functionality.
        + `services.Item.searchConceptItems`: Searches for concept items.

### repositories

* `repositories.Store`: Provides access to store-related functionality.
        + `repositories.Store.setDirty`: Sets the store to dirty.
* `repositories.Item`: Provides access to item-related functionality.
        + `repositories.Item.unassigned.clear`: Clears the unassigned items.
        + `repositories.Item.unassigned.reset`: Resets the unassigned items.

## Examples

### Solving an SBC Challenge

To solve an SBC challenge, you can use the `services.SBC` object and the `solveSBC` endpoint.
```javascript
const setId = 1;
const challengeId = 1;

fetch('http://localhost:5000/solveSBC', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    setId,
    challengeId
  })
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```
### Fetching Player Prices

To fetch player prices, you can use the `playerPrices` endpoint.
```javascript
fetch('http://localhost:5000/playerPrices')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```
Note: This API documentation is just a sample and may not reflect the actual API endpoints and functionality of the EA Sports FC Ultimate Team web app." > API_Doc.md
echo "
# API Documentation
This API provides access to the EA Sports FC Ultimate Team web app's internal global objects and methods. It allows users to interact with the game's API to perform various actions such as solving SBCs, fetching player prices, and more.
## Endpoints
### GET /sbcSets
Returns a list of available SBC sets.
* Response: `JSON` object containing an array of SBC sets.
* Example Response:
```json
[
  {
    \"id\": 1,
    \"name\": \"SBC Set 1\"
  },
  {
    \"id\": 2,
    \"name\": \"SBC Set 2\"
  }
]
```
* Usage: To fetch the list of SBC sets, make a GET request to `http://localhost:5000/sbcSets`.
### GET /challenges
Returns a list of challenges for a specific SBC set.
* Query Parameters:
  * `setId`: The ID of the SBC set.
* Response: `JSON` object containing an array of challenges.
* Example Response:
```json
[
  {
   \"id\": 1,
    \"name\": \"Challenge 1\"
  },
  {
   \"id\": 2,
    \"name\": \"Challenge 2\"
  }
]
```
* Usage: To fetch the list of challenges for an SBC set, make a GET request to `http://localhost:5000/challenges?setId={setId}`.
### POST /solveSBC
Solves an SBC challenge.
* Request Body:
  * `setId`: The ID of the SBC set.
  * `challengeId`: The ID of the challenge.
* Response: `JSON` object containing the solution.
* Example Response:
```json
{
  \"status\": \"success\",
  \"solution\": [
    {
      \"id\": 1,
      \"name\": \"Player 1\"
    },
    {
      \"id\": 2,
      \"name\": \"Player 2\"
    }
  ]
}
```
* Usage: To solve an SBC challenge, make a POST request to `http://localhost:5000/solveSBC` with the required request body.
### GET /playerPrices
Returns a list of player prices.
* Response: `JSON` object containing an array of player prices.
* Example Response:
```json
[
  {
    \"id\": 1,
    \"name\": \"Player 1\",
    \"price\": 1000
  },
  {
    \"id\": 2,
    \"name\": \"Player 2\",
    \"price\": 500
  }
]
```
* Usage: To fetch the list of player prices, make a GET request to `http://localhost:5000/playerPrices`.
## Global Objects and Methods
### services
* `services.SBC`: Provides access to SBC-related functionality.
+ `services.SBC.loadChallenge`: Loads a challenge.
+ `services.SBC.submitChallenge`: Submits a challenge.
* `services.Item`: Provides access to item-related functionality.
+ `services.Item.searchConceptItems`: Searches for concept items.
### repositories
* `repositories.Store`: Provides access to store-related functionality.
+ `repositories.Store.setDirty`: Sets the store to dirty.
* `repositories.Item`: Provides access to item-related functionality.
+ `repositories.Item.unassigned.clear`: Clears the unassigned items.
+ `repositories.Item.unassigned.reset`: Resets the unassigned items.
## Examples
### Solving an SBC Challenge
To solve an SBC challenge, you can use the `services.SBC` object and the `solveSBC` endpoint.
```javascript
const setId = 1;
const challengeId = 1;
fetch('http://localhost:5000/solveSBC', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    setId,
    challengeId
  })
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```
### Fetching Player Prices
To fetch player prices, you can use the `playerPrices` endpoint.
```javascript
fetch('http://localhost:5000/playerPrices')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```
