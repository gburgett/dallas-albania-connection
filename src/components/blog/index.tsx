import * as React from 'react'
import { Container } from 'reactstrap'
import Helmet from 'react-helmet'

import Hero from '../hero/Hero'
import Author from '../author'
import { mergeBlogsAndArticles, formatLocalDate, parseUrl } from './utilities';

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
  articles: {
    edges: {
      node: IArticle
    }[]
  }
  blogs: {
    edges: {
      node: IBlogPreviewData
    }[]
  }
}

interface IArticle {
  excerpt: string,
  id: any,
  frontmatter: {
    title: string,
    contentType: 'article',
    date: string,
    path: string,
    heroimage: string
  }
}

export interface IBlogPreviewData {
  id: string
  excerpt: string
  timeToRead: number
  frontmatter: {
    slug: string
    externalUrl: string
    title: string
    contentType: 'blog'
    date: string
    published?: boolean
  }
}

const BlogsPreview = ({ nodes }: { nodes: Array<IArticle | IBlogPreviewData> }) => {
  return <ul className='list-group'>
    { nodes.map(e => (
      <li className="d-flex w-100 justify-content-between" key={e.id}>
      {e.frontmatter.contentType == 'article' ?
        <ArticlePreview {...e as IArticle} /> :
        <BlogPreview {...e as IBlogPreviewData} />}
      </li>
    ))}
    <li className="d-flex w-100 justify-content-between">
        <a href="/blog">
          All blogs
          <i style={{paddingLeft: '1em'}} className="fa fa-arrow-right d-inline"></i>
        </a>
      </li>
    </ul>
}

const BlogPreview = (node: IBlogPreviewData) => (
  <a href={node.frontmatter.externalUrl || `/blog/${node.frontmatter.slug}`}>
    <span className='body date'>{formatLocalDate(node.frontmatter.date)}</span>
    <span className='title'>
      {node.frontmatter.title}
    </span>
    {
      node.frontmatter.externalUrl ?
        <span className='body readtime'>
          {parseUrl(node.frontmatter.externalUrl).host} <i className="fa fa-external-link-alt" />
        </span> :
        <span className='body readtime'>{node.timeToRead} minute read</span>
    }
  </a>
)

const ArticlePreview = (node: IArticle) => (
  <a href={node.frontmatter.path}>
    <span className='body date'>{formatLocalDate(node.frontmatter.date)}</span>
    <span className='title'>{node.frontmatter.title}</span>
  </a>
)

export function BlogTemplate ({ data }: IPageContext<ITemplateData>) {
  const { markdownRemark: post, blogs, articles } = data
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

  const postsAndArticles = mergeBlogsAndArticles(articles, blogs);

  return (
    <div className="blog">
      <Helmet title={post.frontmatter.title}>
        {heroimage && <meta property="og:image" content={siteUrl + heroimage}></meta>}
      </Helmet>

      <Container>
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
            { <BlogsPreview nodes={postsAndArticles} /> }
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
