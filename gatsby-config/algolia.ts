
export const algoliaQueries = [
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