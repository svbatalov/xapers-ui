### Web UI for [Xapers](https://finestructure.net/xapers/) -- a personal journal article management system.

#### Features:
* Search database
* Sort (desc/asc) by ID, Year, Relevance
* Load document via browser
* Edit bibtex entry and tags
* Tag autocompletion

#### Dev server

In this mode requests to `/api` endpoint are proxied to python web server on `localhost:5000`.
```sh
# Run webpack dev server and python server
$ cd client/ && yarn install && yarn start
```

#### Production
```sh
# Build client JS/CSS/HTML files in client/dist/
$ cd client/ && yarn install && yarn build
# Run server
$ ../server/server.py
```
