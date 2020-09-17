import { graphql } from 'gatsby'

import { withLayout } from '../components/application-wrapper';
import { IndexPage } from '../components/static-pages/index';

// graphql fragments eventFields
import {} from '../events/index'

export default withLayout(IndexPage)

export const pageQuery = graphql`
query IndexQuery {
  site {
    siteMetadata {
      title
      siteUrl
      signupFormUrl
    }
  }
  root: markdownRemark(fileAbsolutePath: {regex: "/\/pages\/homepage\/_index\\.md$/"}) {
    frontmatter {
      feature {
        show
        title
        subtitle
        image
        link
        buttonText
        buttonStyle
        backgroundColor
      }
      jumbotronCta {
        showUntil
        title
        subtitle
        link
        buttonText
        buttonStyle
      }
      hero {
        image
        title
        subtitle
      }
      heroImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
      articles{
        path
      }
      featuredPosts {
        slug
      }
      postsToShow
    }
  }
  articles: allMarkdownRemark(filter: {frontmatter: {contentType: {eq: "article"}, public: {ne: false}}}, sort: {order: DESC, fields: [frontmatter___date]}) {
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
          heroImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
  events: allMarkdownRemark(filter: { fileAbsolutePath: {regex: "/\\/events\\/.+\\.md$/"}}, sort: {order: ASC, fields: [frontmatter___date]}) {
    edges {
      node {
        ...eventFields
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
          heroImageSharp {
            fixed {
              ...GatsbyImageSharpFixed
            }
          }
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
