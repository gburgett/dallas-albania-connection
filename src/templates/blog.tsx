import * as React from 'react'
import { Row, Col, Container, Card, CardTitle, CardGroup, CardBody } from 'reactstrap'
import Helmet from 'react-helmet'
import * as graphql from 'graphql'
import { basename } from 'path'
import Link from 'gatsby-link'

import Hero from '../components/hero/Hero'
import Feature, {IFeatureProps} from '../components/Feature'
import Author from '../components/author'

const BlogsPreview = (props: { edges: { node: IBlogPreviewData }[] }) => {
  const edges = props.edges.filter(e => {
    const dt = Date.parse(e.node.frontmatter.date)
    return dt <= Date.now() && e.node.frontmatter.published !== false
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
  const { heroimage, heroAttribution, title } = post.frontmatter;
  const {siteUrl} = data.site.siteMetadata;

  let author = post.frontmatter.author
  if (author){
    if (!present(author.name) &&
        !present(author.gravatar) &&
        !present(author.photo)) {
      author = undefined
    }
  }

  return (
    <div>
      <Helmet title={post.frontmatter.title}>
        {heroimage && <meta property="og:image" content={siteUrl + heroimage}></meta>}
      </Helmet>

      <Container fluid>
        {heroimage && 
          <Hero image={heroimage} heroAttribution={heroAttribution} >
            <h1 className='display-3'>{title}</h1>
          </Hero>
        }
      </Container>

      <Container>
        <div className='row'>
          <div className='d-none d-md-block col-md-2 blog-list'>
            { blogs && <BlogsPreview edges={blogs.edges} /> }
          </div>
          <div className='col-md-10'>
            {!heroimage && <h1 className='display-3'>{title}</h1>}
            {author &&
              <Author {...author} />}
            {post.html && 
              <div className='post' dangerouslySetInnerHTML={{ __html: post.html}} />}
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
      heroimage: string,
      heroAttribution: string,
      published?: boolean
      author: {
        name: string,
        gravatar?: string,
        photo?: string
      }
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
    published?: boolean
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
        heroAttribution
        published
        author {
          name
          gravatar
          photo
        }
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
            published
          }
        }
      }
    }
  }
`

function present(str?: string): boolean {
  return str && str.length > 0
}