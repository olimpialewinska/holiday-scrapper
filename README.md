<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

 # Holiday Scrapper

This server application is built using Nest.js and is designed to scrape vacation offers every half an hour and send email notifications to users with new offers that match their preferences. Server uses postgresql as its database. 

## Features

- User registration and email confirmation
- User preferences management
- Scrapping vacation offers every 30 minutes
- Sending email notifications to users with matching preferences

## Requirements

- Node.js (>=14.0.0)
- PostgreSQL (>=12.0.0)

## Installation

```bash
git clone https://github.com/olimpialewinska/holiday-scrapper.git
cd holiday-scrapper
yarn install
yarn start:dev
```
Don't forget to set your postgresql db. 

## Usage
- Register a user: Send a POST request to /auth/register with the required information (email, password). An email confirmation link will be sent to the user's email.

- Confirm email: Click on the link sent to the user's email to confirm it.

- Log in: Send a POST request to /auth/login with the email and password to get a JWT token.

- Set preferences: Use the JWT token to send preferences (e.g., destination, budget) to /preferences/addPreferences.

- Scraping and Notifications: The server will automatically scrape vacation offers every 30 minutes and send email notifications to users with matching preferences.
