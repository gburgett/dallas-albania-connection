const Path = require('path')

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators

  const createNode = ({ node }) => {
    let { contentType, path, slug } = node.frontmatter
    if (contentType) {
      path = path || `${contentType}/${slug}`
      
      console.log('creating page:', contentType, 'at', path)
      createPage({
        path: path,
        component: Path.resolve(`src/templates/${String(contentType)}.tsx`),
        context: {
          id: node.id,
          ...node.frontmatter
        } // additional data can be passed via context
      })
    } else {
      return Promise.reject(`No template found for content type ${contentType}`)
    }
  }

  return graphql(`
  {
    pages: allMarkdownRemark(filter: { frontmatter: { path: { ne: null } } }) {
      edges {
        node {
          id
          frontmatter {
            contentType
            path
            date
          }
        }
      }
    }
    blogs: allMarkdownRemark(filter: { frontmatter: { contentType: { eq: "blog" } } }) {
      edges {
        node {
          id
          frontmatter {
            contentType
            slug
            date
          }
        }
      }
    }
  }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }
    result.data.pages.edges.forEach(createNode)
    result.data.blogs.edges.forEach(createNode)
  })
}