import path from 'path'
import fs from 'fs'

export default {
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/server.crt'))
    }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'BadgeReportGenerator',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700' },
      { rel: 'stylesheet', type: 'text/css', href: '/assets/css/nucleo-icons.css' },
      { rel: 'stylesheet', type: 'text/css', href: '/assets/css/nucleo-svg.css' },
      { rel: 'stylesheet', type: 'text/css', href: '/assets/css/argon-dashboard.css' }
    ]
  },

  router: {
    middleware: ['auth']
  },

  redirect: {
    login: '/login',
    logout: '/',
    callback: '/login',
    home: '/'
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios',
    '~/plugins/services'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],
  axios: {
    proxy: true
  },
  proxy: {
    '/osm': {
      target: 'https://www.onlinescoutmanager.co.uk',
      pathRewrite: { '^/osm/': '/' }
    }
  },
  auth: {
    strategies: {
      social: {
        scheme: 'oauth2',
        endpoints: {
          authorization: 'https://www.onlinescoutmanager.co.uk/oauth/authorize',
          token: '/osm/oauth/token',
          userInfo: '/osm/oauth/resource'
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        responseType: 'code',
        grantType: 'authorization_code',
        accessType: undefined,
        redirectUri: 'https://localhost:3000/login',
        logoutRedirectUri: undefined,
        clientId: process.env.OSM_CLIENT_ID,
        scope: ['section:member:read', 'section:badge:read'],
        state: 'UNIQUE_AND_NON_GUESSABLE',
        codeChallengeMethod: 'S256',
        responseMode: '',
        acrValues: ''
      }
    },
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
