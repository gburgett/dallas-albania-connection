import * as React from 'react'
import { Row, Col, Container, Card, CardTitle, CardGroup, CardBody } from 'reactstrap'
import Helmet from 'react-helmet'
import * as graphql from 'graphql'
import { basename } from 'path'
import Link from 'gatsby-link'

import Hero from '../components/hero/Hero'
import Feature from '../components/Feature'

export default function Template ({ data }: IPageContext<ITemplateData>) {
  const { markdownRemark: post } = data
  const { heroimage, title, feature } = post.frontmatter;

  return (
    <div>
      <Helmet title={post.frontmatter.title}>
        {data.site.siteMetadata.disqus && (
          <script id='dsq-count-scr' src='//gatsby-starter-blog.disqus.com/count.js' async />
        )}
        {data.site.siteMetadata.disqus && (
          <script>{`(function() {
          var d = document, s = d.createElement('script');
          s.src = 'https://${data.site.siteMetadata.disqus}.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
          })();`}</script>
        )}
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

      {data.site.siteMetadata.disqus && (<Container>
        <hr />
        <div id='disqus_thread' />
      </Container>)}
    </div>
  )
}

export interface ITemplateData {
  site: {
    siteMetadata: {
      disqus?: string
    }
  },
  markdownRemark: {
    html: string,
    frontmatter: {
      path: string,
      date: string,
      title: string,
      heroimage: string,
      feature?: {
        show?: boolean
        title?: string
        image?: string
        link: string
        buttonText: string
        buttonStyle: string
        backgroundColor?: string
      }
    }
  }
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    site {
      siteMetadata {
        disqus
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
