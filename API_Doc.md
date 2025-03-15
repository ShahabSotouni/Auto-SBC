
# API Documentation

This API provides access to the EA Sports FC Ultimate Team web app's internal global objects and methods. It allows users to interact with the game's API to perform various actions such as solving SBCs, fetching player prices, and more.

## Endpoints

### GET /sbcSets

Returns a list of available SBC sets.

* Response:  object containing an array of SBC sets.
* Example Response:

* Usage: To fetch the list of SBC sets, make a GET request to .

### GET /challenges

Returns a list of challenges for a specific SBC set.

* Query Parameters:
  * : The ID of the SBC set.
* Response:  object containing an array of challenges.
* Example Response:

* Usage: To fetch the list of challenges for an SBC set, make a GET request to .

### POST /solveSBC

Solves an SBC challenge.

* Request Body:
  * : The ID of the SBC set.
  * : The ID of the challenge.
* Response:  object containing the solution.
* Example Response:

* Usage: To solve an SBC challenge, make a POST request to  with the required request body.

### GET /playerPrices

Returns a list of player prices.

* Response:  object containing an array of player prices.
* Example Response:

* Usage: To fetch the list of player prices, make a GET request to .

## Global Objects and Methods

### services

* : Provides access to SBC-related functionality.
+ : Loads a challenge.
+ : Submits a challenge.
* : Provides access to item-related functionality.
+ : Searches for concept items.

### repositories

* : Provides access to store-related functionality.
+ : Sets the store to dirty.
* : Provides access to item-related functionality.
+ : Clears the unassigned items.
+ : Resets the unassigned items.

## Examples

### Solving an SBC Challenge

To solve an SBC challenge, you can use the  object and the  endpoint.

### Fetching Player Prices

To fetch player prices, you can use the  endpoint.

Note: This API documentation is just a sample and may not reflect the actual API endpoints and functionality of the EA Sports FC Ultimate Team web app.
