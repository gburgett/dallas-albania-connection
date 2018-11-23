import * as React from 'react'
import { Container } from 'reactstrap'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Hero from '../components/hero/Hero'
import { withLayout } from '../components/layout';

export function Template ({ data }: IPageContext<ITemplateData>) {
  const { markdownRemark: post } = data
  const { heroimage, title } = post.frontmatter;
  const {siteUrl} = data.site.siteMetadata;

  return (
    <div>
      <Helmet title={post.frontmatter.title}>
        {heroimage && <meta property="og:image" content={siteUrl + heroimage}></meta>}
      </Helmet>

      <Container fluid>
        {heroimage && <Hero image={heroimage} />}
      </Container>

      <Container>

        <h1 className='display-3'>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </Container>
    </div>
  )
}

export default withLayout(Template)

export interface ITemplateData {
  site: ISite,
  markdownRemark: {
    html: string,
    frontmatter: {
      path: string,
      public: boolean,
      date: string,
      title: string,
      heroimage: string
    }
  }
}

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
