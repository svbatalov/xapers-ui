### Web UI for [Xapers](https://finestructure.net/xapers/) -- a personal journal article management system.

#### Motivation
Sometimes I like to read papers on my tablet while lying on coach.

#### Features:
* Access your papers database on any device in local network
* Search database
* Sort (desc/asc) by ID, Year, Relevance
* Load document via browser
* Edit bibtex entry and tags
* Tag autocompletion

#### Wishlist
* Limit via `limit:N` keyword or similar
* Smart autocompletion
* Uploading new articles with doi/arXiv ID detection
* Better UI

#### Python dependencies
1. `sudo apt install xapers` (Debian-based distros) or equivalent
2. `pip install flask eventlet argparse`

#### Dev server

In this mode requests to `/api` endpoint are proxied to python web server on `localhost:5000`. Source code changes are compiled on the fly and UI is hot module reloaded.
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

#### License
MIT
