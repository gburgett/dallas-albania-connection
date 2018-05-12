const Path = require('path')

exports.modifyWebpackConfig = ({ config }) => {
  config.merge({
    externals: {
      jquery: 'jQuery'
    }
  })

  return config;
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators

  const createNode = ({ node }) => {
    let { contentType, path, slug } = node.frontmatter
    if (contentType) {
      path = path || `${contentType}/${slug}`
    }

    const context = {
      id: node.id,
      ...node.frontmatter
    }
    if (context.path) {
      context['fm_path'] = context.path
      delete(context.path)
    }
      
    console.log('creating page:', contentType, 'at', path, 'context', context)
    createPage({
      path: path,
      component: Path.resolve(`src/templates/${String(contentType || 'page')}.tsx`),
      context: context
    })
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