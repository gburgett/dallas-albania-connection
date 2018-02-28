import * as React from 'react'
import { Row, Col, Container, Card, CardTitle, CardGroup, CardBody } from 'reactstrap'
import Helmet from 'react-helmet'
import * as graphql from 'graphql'
import { basename } from 'path'
import Link from 'gatsby-link'

import Hero from '../components/hero/Hero'
import Feature, {IFeatureProps} from '../components/Feature'

const BlogsPreview = (props: { edges: { node: IBlogPreviewData }[] }) => {
  const edges = props.edges.filter(e => {
    const dt = Date.parse(e.node.frontmatter.date)
    return dt <= Date.now()
  })
  return <div className='list-group'>
    { edges.map(e => (
      <div className="d-flex w-100 justify-content-between">
        <BlogPreview {...e.node} />
      </div>
    ))}
    </div>
}

const BlogPreview = (node: IBlogPreviewData) => (
  <a href={`/blog/${node.frontmatter.slug}`}>
    <span className='pull-right'>{new Date(Date.parse(node.frontmatter.date)).toLocaleDateString()}</span>
    <h2>{node.frontmatter.title}</h2>
    <span>{node.excerpt}</span><br/>
    <span className='text-right'>{node.timeToRead} minute read</span>
  </a>
)

export default function Template ({ data }: IPageContext<ITemplateData>) {
  const { markdownRemark: post, blogs } = data
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
        <div className='row'>
          <div className='col-md-3 blog-list'>
            { blogs && <BlogsPreview edges={blogs.edges} /> }
          </div>
          <div className='col-md-9'>
            <h1 className='display-3'>{title}</h1>
            <p className='text-right'>{post.timeToRead} minute read</p>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
        </div>
      </Container>
    </div>
  )
}

export interface ITemplateData {
  site: ISite,
  markdownRemark: {
    html: string,
    timeToRead: number
    frontmatter: {
      slug: string,
      date: string,
      title: string,
      heroimage: string
    }
  },
  blogs: {
    edges: {
      node: IBlogPreviewData
    }[]
  }
}

interface IBlogPreviewData {
  id: string
  excerpt: string
  timeToRead: number
  frontmatter: {
    slug: string
    title: string
    date: string
  }
}

export const pageQuery = graphql`
  query BlogPostByPath($id: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }

    markdownRemark(id: { eq: $id }) {
      html
      timeToRead
      frontmatter {
        slug
        date(formatString: "MMMM DD, YYYY")
        title
        heroimage
      }
    }

    blogs: allMarkdownRemark(filter: { frontmatter: { contentType: { eq: "blog" } } }, sort: {order: DESC, fields: [frontmatter___date]}) {
      edges {
        node {
          id
          excerpt
          timeToRead
          frontmatter {
            slug
            title
            date
          }
        }
      }
    }
  }
`
