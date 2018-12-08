import * as React from 'react'
import { Container } from 'reactstrap'
import Helmet from 'react-helmet'

import Hero from '../hero/Hero'
import Author from '../author'

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

const BlogsPreview = (props: { edges: { node: IBlogPreviewData }[] }) => {
  const edges = props.edges.filter(e => {
    const dt = Date.parse(e.node.frontmatter.date)
    return dt <= Date.now() && e.node.frontmatter.published !== false
  })
  return <ul className='list-group'>
    { edges.map(e => (
      <li className="d-flex w-100 justify-content-between" key={e.node.id}>
        <BlogPreview {...e.node} />
      </li>
    ))}
    </ul>
}

const BlogPreview = (node: IBlogPreviewData) => (
  <a href={`/blog/${node.frontmatter.slug}`}>
    <span className='body date'>{new Date(Date.parse(node.frontmatter.date)).toLocaleDateString()}</span>
    <span className='title'>{node.frontmatter.title}</span>
    <span className='body readtime'>{node.timeToRead} minute read</span>
  </a>
)

export function BlogTemplate ({ data }: IPageContext<ITemplateData>) {
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
    <div className="blog">
      <Helmet title={post.frontmatter.title}>
        {heroimage && <meta property="og:image" content={siteUrl + heroimage}></meta>}
      </Helmet>

      <Container fluid>
        {heroimage && 
          <Hero image={heroimage} heroAttribution={heroAttribution} >
            <h1 className='display-3 title'>
              {author &&
                <Author {...author} />}
              {title}
            </h1>
          </Hero>
        }
      </Container>

      <Container>
        <div className='row blog-body'>
          <div className='d-none d-md-block col-md-2 blog-list'>
            { <BlogsPreview edges={blogs.edges} /> }
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

function present(str?: string): boolean {
  return str && str.length > 0
}