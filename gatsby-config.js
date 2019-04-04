

const algoliaQueries = [
  {
    query: `
    query AlgoliaBlogsQuery {
      site {
        siteMetadata {
          title
          siteUrl
        }
      }
      articles: allMarkdownRemark(filter: {frontmatter: {contentType: {eq: "article"}, published: {ne: false}}}, sort: {order: DESC, fields: [frontmatter___date]}) {
        edges {
          node {
            id
            excerpt(pruneLength: 150)
            rawMarkdownBody
            frontmatter {
              path
              contentType
              date(formatString: "YYYY-MM-DD")
              title
              heroimage
              roster {
                header
                text
                projectIds
                teams {
                  name
                  members {
                    name
                    cruId
                  }
                }
              }
            }
          }
        }
      }
      blogs: allMarkdownRemark(filter: { frontmatter: { contentType: { eq: "blog" }, published: {ne: false} } }, sort: {order: DESC, fields: [frontmatter___date]}) {
        edges {
          node {
            id
            excerpt(pruneLength: 150)
            rawMarkdownBody
            timeToRead
            frontmatter {
              slug
              externalUrl
              contentType
              date(formatString: "YYYY-MM-DD")
              title
              heroimage
              heroAttribution
              published
              author {
                name
                gravatar
                photo
              }
            }
          }
        }
      }
    }`,
    transformer: ({ data }) => {
      let articles = data.articles.edges.map(({ node }) => node)
      let blogs = data.blogs.edges.map(({ node }) => node)

      articles = articles.map(extractWordFrequency('rawMarkdownBody'))
      blogs = blogs.map(extractWordFrequency('rawMarkdownBody'))

      return [...articles, ...blogs].map((node) =>
        Object.assign(node,
          data.site.siteMetadata,
          {
            objectID: node.id
          }))
    }, // optional
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME + '_blogs',
    settings: {
    },
  },
]

function extractWordFrequency(attr) {
  const { english } = require('stopwords');

  return (node) => {
    const text = node[attr]
    delete(node[attr])

    const wordsMap = {};
    text.replace(/[^\w]/g, ' ').split(/\s+/)
      .map((word) => word.toLowerCase())
      .filter((word) => word.length > 0 && !english.includes(word))
      .forEach((word) => {
        if (wordsMap.hasOwnProperty(word)) {
          wordsMap[word]++;
        } else {
          wordsMap[word] = 1;
        }
      })

    const frequency = Object.keys(wordsMap).map((key) => {
      return {
        name: key,
        total: wordsMap[key]
      };
    });

    frequency.sort((a, b) => b.total - a.total)
    
    node[attr + '_freq'] = frequency.map((v) => v.name)
    return node
  }
}

module.exports = {
  siteMetadata: require('./site/metadata'),
  mapping: {
   // TODO: this only matches on IDs
   // https://github.com/gatsbyjs/gatsby/issues/3129
   // "MarkdownRemark.frontmatter.featured": `MarkdownRemark`,
  },
  plugins: [
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
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-copy-linked-files'
        ]
      }
    },
    {
      resolve: 'gatsby-transformer-smapp'
    },
    {
      resolve: "gatsby-plugin-typescript",
      options: {
      },
    },
    {
      resolve: 'gatsby-plugin-netlify'
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms`,
        stylesPath: `${__dirname}/src/components/layout.scss`
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges
                .filter(edge => edge.node.frontmatter.published !== false)
                .map(edge => {
                  const { slug, externalUrl, author, heroimage } = edge.node.frontmatter
                  if (!slug && !externalUrl) {
                    return null
                  }

                  return Object.assign({}, edge.node.frontmatter, {
                    url: externalUrl || site.siteMetadata.siteUrl + '/blog/' + slug,
                    guid: externalUrl || site.siteMetadata.siteUrl + '/blog/' + slug,
                    author: author ? author.name : null,
                    custom_elements: [
                      { "content:encoded": edge.node.html.replace(/\"\/files\//g, `"${site.siteMetadata.siteUrl}/files/`) },
                      { "media:content":  { 
                        _attr: {
                          url: site.siteMetadata.siteUrl + edge.node.frontmatter.heroimage
                        }
                      } }
                    ],
                  });
                }).filter(e => e);
            },
            query: `
              {
                site {
                  siteMetadata {
                    siteUrl
                  }
                },
                allMarkdownRemark(filter: { frontmatter: { contentType: { eq: "blog" } } }, sort: {order: DESC, fields: [frontmatter___date]}) {
                  edges {
                    node {
                      id
                      html
                      excerpt(pruneLength: 1000)
                      timeToRead
                      frontmatter {
                        slug
                        externalUrl
                        title
                        date
                        published
                        heroimage
                        author {
                          name
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: "/blogrss.xml",
          }
        ]
      }
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
        indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME, // for all queries
        queries: algoliaQueries,
        chunkSize: 10000, // default: 1000
      },
    },
  ]
}
