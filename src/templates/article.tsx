import { graphql } from 'gatsby'

import { withLayout } from '../components/application-wrapper';
import { ArticleTemplate } from '../components/article';

export default withLayout(ArticleTemplate)

export const smappExportFields = graphql`
fragment smappExportFields on SmappExportCsv {
  studentName
  amount
  designation
  name
  year
}
`

export const pageQuery = graphql`
  query ArticleByPath($path: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }

    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        date(formatString: "MMMM DD, YYYY")
        title
        heroimage
        heroImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
        feature {
          show
          title
          image
          link
          buttonText
          buttonStyle
          backgroundColor
        }
        showRoster
        roster {
          header
          text
          projectIds
          teams {
            name
            goal
            adjustment
            mileMarker
            members {
              name
              cruId
              goal
              adjustment
            }
          }
        }
      }
    }

    smappExport: allSmappExportCsv {
      edges {
        node {
          ...smappExportFields
        }
      }
    }
  }
`
