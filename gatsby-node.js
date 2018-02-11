const Path = require('path')

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators

  return graphql(`
  {
    allMarkdownRemark(filter: { frontmatter: { path: { ne: null } } }) {
      edges {
        node {
          excerpt(pruneLength: 400)
          html
          id
          frontmatter {
            contentType
            path
            date
            title
          }
        }
      }
    }
  }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const { contentType, path } = node.frontmatter
      if (contentType) {
        console.log('creating page:', contentType, 'at', path)
        createPage({
          path: path,
          component: Path.resolve(`src/templates/${String(contentType)}.tsx`),
          context: {} // additional data can be passed via context
        })
      } else {
        return Promise.reject(`No template found for content type ${contentType}`)
      }
    })
  })
}
