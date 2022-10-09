# operations API

This is a lightweight interface between RASA and airtable so that integrations are consolidated across an API

# dev local

npm run dev to test locally

http://localhost:4080/v1/

# authentication

RASA instances should have to provide an auth token in order for the API to work with Airtable, which requires a secret key

# Docker setup

docker build -t operations_api .

# Run in botfront

Use bf_weddings_bot project, botfront up followed by cd operations_api and docker-compose up to join app to network

# typescript support

- tsconfig.json for outdir
- command [`npx tsc`] to transpile to js in ./dist directory

# healthcheck

Deployed in AWS behind ELB please use /v1/healthcheck as the target URL

# server

- `cd dist/`
- `node server.js &`
