import { graphql } from 'gatsby'

import { withLayout } from '../components/layout-wrapper';
import { PageTemplate } from '../components/page';

export default withLayout(PageTemplate)

export const pageQuery = graphql`
  query PageByPath($path: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }

    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        public
        title
        heroimage
      }
    }
  }
`
