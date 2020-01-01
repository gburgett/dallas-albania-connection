import * as React from 'react'
import { Container, Row } from 'reactstrap'
import Helmet from 'react-helmet'
import { GatsbyImageProps } from 'gatsby-image'

import Hero from '../hero/Hero'
import Scrollspy from './scrollspy'

export interface ITemplateData {
  site: ISite,
  markdownRemark: {
    html: string,
    headings?: Array<{
      value: string,
      depth: number
    }> | null,
    frontmatter: {
      path: string,
      public: boolean,
      date: string,
      title: string,
      heroimage: string
      heroImageSharp: GatsbyImageProps | null
    }
  }
}


export function PageTemplate ({ data }: IPageContext<ITemplateData>) {
  const { markdownRemark: post } = data
  const { heroimage, heroImageSharp, title } = post.frontmatter;
  const {siteUrl} = data.site.siteMetadata;

  const headings = (post.headings || []).filter((h) => h.depth > 1 && h.depth <= 3)

  return (
    <div>
      <Helmet title={post.frontmatter.title}>
        {heroimage && <meta property="og:image" content={siteUrl + heroimage}></meta>}
      </Helmet>

      <Container fluid>
        <Hero image={heroImageSharp || heroimage} >
          <h1 className='display-3 title'>{title}</h1>
        </Hero>
      </Container>

      <Container fluid>
        <div className="row">
          <div className="col-md-3 d-none d-md-block">
            <Scrollspy headings={headings} />
          </div>
          <div className="col-12 col-md-9">
            <div className="markdown" dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
        </div>
      </Container>
    </div>
  )
}
