import { graphql } from 'gatsby'

import { withLayout } from '../components/application-wrapper';
import { BlogTemplate } from '../components/blog';

export default withLayout(BlogTemplate)


export const pageQuery = graphql`
  query BlogPostByPath($id: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }

    markdownRemark(id: { eq: $id }) {
      html
      timeToRead
      frontmatter {
        slug
        date(formatString: "MMMM DD, YYYY")
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
    articles: allMarkdownRemark(filter: {frontmatter: {contentType: {eq: "article"}}}, sort: {order: DESC, fields: [frontmatter___date]}) {
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
    blogs: allMarkdownRemark(filter: { frontmatter: { contentType: { eq: "blog" } } }, sort: {order: DESC, fields: [frontmatter___date]}) {
      edges {
        node {
          id
          excerpt
          timeToRead
          frontmatter {
            slug
            externalUrl
            title
            contentType
            date
            published
          }
        }
      }
    }
  }
`
