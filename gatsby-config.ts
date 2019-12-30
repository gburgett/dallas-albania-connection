import {GatsbyConfig} from 'gatsby'
import { algoliaQueries } from "./gatsby-config/algolia";
import { gatsbyPluginFeed } from "./gatsby-config/feed";

const plugins: GatsbyConfig['plugins'] = [
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/src/pages`,
      name: 'pages'
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/src/components`,
      name: 'components'
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/src/events`,
      name: 'components'
    }
  },
  {
    resolve: 'gatsby-source-smapp',
    options: {
      username: process.env['SMAPP_USERNAME'],
      password: process.env['SMAPP_PASSWORD'],
      dataDir: `data/donations/2019`
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/static/files`,
    }
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-images`,
          options: {
            // It's important to specify the maxWidth (in pixels) of
            // the content container as this plugin uses this as the
            // base for generating different widths of each image.
            maxWidth: 1440,
          },
        },
        'gatsby-remark-copy-linked-files',
        `gatsby-remark-autolink-headers`,
      ]
    }
  },
  'gatsby-transformer-smapp',
  {
    resolve: "gatsby-plugin-typescript",
    options: {
    },
  },
  'gatsby-plugin-netlify',
  {
    resolve: 'gatsby-plugin-netlify-cms',
    options: {
      modulePath: `${__dirname}/src/cms`,
      stylesPath: `${__dirname}/src/components/layout.scss`
    }
  },
  gatsbyPluginFeed,
  'gatsby-plugin-offline',
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-sass',
]

if (process.env.ALGOLIA_API_KEY) {
  plugins.push({
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: process.env.GATSBY_ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME, // for all queries
      queries: algoliaQueries,
      chunkSize: 10000, // default: 1000
    },
  })
}

const config: GatsbyConfig = {
  siteMetadata: require('./site/metadata'),
  mapping: {
   // TODO: this only matches on IDs
   // https://github.com/gatsbyjs/gatsby/issues/3129
   // "MarkdownRemark.frontmatter.featured": `MarkdownRemark`,
  },
  plugins
}

module.exports = config
