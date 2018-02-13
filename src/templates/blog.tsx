import * as React from 'react'
import { Row, Container, Card, CardTitle, CardGroup, CardBody } from 'reactstrap'
import Helmet from 'react-helmet'
import * as graphql from 'graphql'
import { basename } from 'path'
import Link from 'gatsby-link'

import Hero from '../components/hero/Hero'

export default function Template ({ data }: IPageContext<ITemplateData>) {
  const { markdownRemark: post } = data
  const { heroimage, title } = post.frontmatter;
  const tabTitle = post.frontmatter.title ?
    post.frontmatter.title.split(' ')[0] :
    'Blog'

  return (
    <div>
      <Helmet title={tabTitle}>
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
        <h1 className='display-3'>{title}</h1>
      </Container>

      <Container dangerouslySetInnerHTML={{ __html: post.html }} />

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
      heroimage: string
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
      }
    }
  }
`
