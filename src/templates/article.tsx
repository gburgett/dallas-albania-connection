import * as React from 'react'
import { Row, Col, Container, Card, CardTitle, CardGroup, CardBody } from 'reactstrap'
import Helmet from 'react-helmet'
import * as graphql from 'graphql'
import { basename } from 'path'
import Link from 'gatsby-link'

import Hero from '../components/hero/Hero'
import Feature, {IFeatureProps} from '../components/Feature'

export default function Template ({ data }: IPageContext<ITemplateData>) {
  const { markdownRemark: post } = data
  const { heroimage, title, feature } = post.frontmatter;
  const {siteUrl} = data.site.siteMetadata;

  return (
    <div>
      <Helmet title={post.frontmatter.title}>
        {heroimage && <meta property="og:image" content={siteUrl + heroimage}></meta>}
      </Helmet>

      <Container fluid>
        {heroimage && <Hero image={heroimage} />}
        {feature && feature.show &&
            <Feature {...feature} />}
      </Container>

      <Container>

        <h1 className='display-3'>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </Container>
    </div>
  )
}

export interface ITemplateData {
  site: ISite,
  markdownRemark: {
    html: string,
    frontmatter: {
      path: string,
      date: string,
      title: string,
      heroimage: string,
      feature?: IFeatureProps & {
        show?: boolean
      }
    }
  }
}

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
        feature {
          show
          title
          image
          link
          buttonText
          buttonStyle
          backgroundColor
        }
      }
    }
  }
`
