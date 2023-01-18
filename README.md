# BadgeReportGenerator

## Build Setup

```bash
# should be run on node v16
$ nvm use v16

# Copy .env.dist
$ cp .env.dist .env # update with your own config

# Copy ssl directory (dev only, generate your own ssl certs in prod)
$ cp ssl.dist ssl

# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```
