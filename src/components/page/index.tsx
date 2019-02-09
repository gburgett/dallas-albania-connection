import * as React from 'react'
import { Container } from 'reactstrap'
import Helmet from 'react-helmet'
import Hero from '../hero/Hero'

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


export function PageTemplate ({ data }: IPageContext<ITemplateData>) {
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
        <div className="markdown" dangerouslySetInnerHTML={{ __html: post.html }} />
      </Container>
    </div>
  )
}
