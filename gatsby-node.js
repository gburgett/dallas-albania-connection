const Path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  switch (stage) {
    case `build-javascript`:
      actions.setWebpackConfig({
        externals: {
          jquery: 'jQuery'
        },
        /*
         * Because gatsby-plugin-netlify-cms does something funky to the sass loader,
         * we can't directly include our css in our preview component js files.
         * So, instead we build a new css file at a well-known path and include it
         * using CMS.registerPreviewStyle
         */
        plugins: [new MiniCssExtractPlugin({})],
      })
      
      let config = getConfig()
      config.entry.previewStyles = `${__dirname}/src/stylesheets/application.scss`
      actions.replaceWebpackConfig(config)
  }
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

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