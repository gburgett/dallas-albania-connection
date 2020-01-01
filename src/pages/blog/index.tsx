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
}
`
