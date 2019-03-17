import { graphql } from 'gatsby'

import { withLayout } from '../../components/application-wrapper';
import { BlogIndexPage } from '../../components/static-pages/blog';

export default withLayout(BlogIndexPage)

export const pageQuery = graphql`
query BlogIndexQuery {
  site {
    siteMetadata {
      title
      siteUrl
      signupFormUrl
    }
  }
  articles: allMarkdownRemark(filter: {frontmatter: {contentType: {eq: "article"}, published: {ne: false}}}, sort: {order: DESC, fields: [frontmatter___date]}) {
    edges {
      node {
        excerpt(pruneLength: 150)
        id
        frontmatter {
          title
          contentType
          date(formatString: "MMMM DD, YYYY")
          path
          heroimage
        }
      }
    }
  }
  blogs: allMarkdownRemark(filter: { frontmatter: { contentType: { eq: "blog" }, published: {ne: false} } }, sort: {order: DESC, fields: [frontmatter___date]}) {
    edges {
      node {
        id
        excerpt(pruneLength: 300)
        timeToRead
        frontmatter {
          slug
          externalUrl
          title
          contentType
          date
          heroimage
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
}
`
