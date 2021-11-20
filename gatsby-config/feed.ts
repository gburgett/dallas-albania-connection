export const gatsbyPluginFeed = {
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
        title: 'Team Albania Blog',
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
}