import { GatsbyNode, CreateResolversArgs } from 'gatsby'
import * as Path from 'path'
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
import * as fs from 'fs-extra'
import * as path from 'path'

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ stage, actions, getConfig }) => {
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
      
      // let config = getConfig()
      // config.entry.previewStyles = `${__dirname}/src/stylesheets/application.scss`
      // actions.replaceWebpackConfig(config)
  }
}

export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql }) => {
  const { createPage } = actions
  const createRedirect = (...args) => {
    console.log('creating redirect', ...args)
    actions.createRedirect.call(this, ...args)
  }

  const createNode = ({ node }) => {
    let { contentType, path, slug } = node.frontmatter
    if (!path) {
      if (!contentType || !slug) {
        return
      }

      path = `${contentType}/${slug}`
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

  const result = await graphql<CreatePagesQuery>(`
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
  `)

  if (result.errors) {
    throw new Error(result.errors)
  }
  result.data.pages.edges.forEach(createNode)
  result.data.blogs.edges.forEach(createNode)

  const meta = JSON.parse((await fs.readFile('site/metadata.json')).toString())
  console.log('metadata:', meta)
  if (meta.applicationUrl && meta.applicationUrl.length > 0) {
    createRedirect({ fromPath: "/apply", toPath: meta.applicationUrl, isPermanent: false })
  }
}

interface CreatePagesQuery {
  pages: {
    edges: Array<{
      node: {
        id: string
        frontmatter: {
          contentType: string
          path: string
          date: string
        }
      }
    }>
  },
  blogs: {
    edges: Array<{
      node: {
        id: string
        frontmatter: {
          contentType: string
          slug: string
          date: string
        }
      }
    }>
  }
}


export const createResolvers: GatsbyNode['createResolvers'] = async ({createResolvers, getNode, getNodesByType}: CreateResolversArgs) => {
  createResolvers({
    MarkdownRemarkFrontmatter: {
      heroImageSharp: {
        type: 'ImageSharp',
        resolve: (source: HeroImageFrontmatter, args, context, info) => {
          const relPath = source.heroimage || (source.hero && source.hero.image)
          if (!relPath) {
            return null
          }
          const fullPath = path.join(__dirname, 'static', relPath)
          const f = getNodesByType('File').find((f) => f.absolutePath == fullPath)
          if (!f) {
            // An external URL most likely
            return null
          }
          const imgSharp = (f.children || []).map((childId) => getNode(childId))
            .find((child) => child.internal && child.internal.type == 'ImageSharp')

          return imgSharp
        }
      }
    }
  })
}

type HeroImageFrontmatter = {
  heroimage: string
  hero: undefined
} | {
  heroimage: undefined
  hero: {
    image: string
  }
} | {
  heroimage: undefined
  hero: undefined
}