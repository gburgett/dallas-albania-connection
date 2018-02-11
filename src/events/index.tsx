

export interface IEventFields {
  excerpt?: string,
  html?: string,
  frontmatter: {
    contentType: 'event',
    title: string,
    date: string
    link: string
  }
}

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