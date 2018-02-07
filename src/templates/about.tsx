import * as React from 'react'
import { Container } from 'reactstrap'
import Helmet from 'react-helmet'
import * as graphql from 'graphql'

export default function Template ({ data }: IPageContext<ITemplateData>) {
  const { markdownRemark: post } = data
  return (
    <div>
      <Helmet title={`${post.frontmatter.title} | ${data.site.siteMetadata.title}`} />
      <Container>
        <h1 className='display-3'>{post.frontmatter.title}</h1>
      </Container>
      <Container dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  )
}


interface ITemplateData {
  markdownRemark: {
    html: string,
    frontmatter: {
      path: string,
      title: string
    }
  }
  site: {
    siteMetadata: {
      title: string
    }
  }
}

export const query = graphql`
  query AboutPage($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
