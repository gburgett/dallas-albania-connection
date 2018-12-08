import { graphql } from 'gatsby'

export const eventFields = graphql`
fragment eventFields on MarkdownRemark {
  html
  excerpt(pruneLength: 150)
  frontmatter {
    title
    contentType
    date(formatString: "MMMM DD, YYYY")
    link
  }
}
`