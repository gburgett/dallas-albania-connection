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
        dataDir: 'data/donations'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-prismjs',
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
                  if (!slug || !externalUrl) {
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
    'gatsby-plugin-sass'
  ]
}
