import * as React from 'react'
import { Container, Row, Col } from "reactstrap";
import { Helmet } from "react-helmet";
import { URL } from 'url'

import { mergeBlogsAndArticles, parseISOLocal } from '../../blog/utilities';

export interface IPost {
  id: string
  excerpt: string
  timeToRead: string
  frontmatter: {
    slug: string
    externalUrl: string
    title: string
    date: string
    heroimage: string
    contentType: 'blog'
    published?: boolean
    author: {
      name: string
      gravatar: string
      photo: string
    }
  }
}

export interface IArticle {
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

interface IPageData {
  articles: {
    edges: Array<{ node: IArticle }>
  },
  blogs: {
    edges: Array<{node: IPost}>
  }
}

export const PostList = ({ posts }: { posts: IPost[] }) => {
  return <div>
    <h3>Blog Posts</h3>
    <ul className="post-list">
      {posts.map(p => <BlogPost {...p} />)}
    </ul>
    </div>
}

const BlogPost = (p: IPost) => {
  const {heroimage, author} = p.frontmatter
  let img = heroimage
  let height = "96px"
  let width = "128px"
  if (!img && author) {
    width = "96px"
    img = author.photo
    if (!img && author.gravatar) {
      img = `https://www.gravatar.com/avatar/${author.gravatar}`
    }
  }

  return (
    <a key={p.frontmatter.externalUrl || p.frontmatter.slug}
      href={p.frontmatter.externalUrl || `/blog/${p.frontmatter.slug}`}>
    <li className="post">
      {img && <div className="hero" style={ {backgroundImage: `url('${img}')`, width, height} }>
      </div>}
      <div className="title">
        <h4>{p.frontmatter.title}</h4>
        {author && 
          <span className="body">by {author.name}</span>}
      </div>
      <div className="teaser col-12">
        {
          <div className="body">
            {p.excerpt}
            {
              p.frontmatter.externalUrl ?
                <footer className="blockquote-footer">
                  {new URL(p.frontmatter.externalUrl).host} <i className="fa fa-external-link-alt" />
                </footer> :
                <footer className="blockquote-footer">
                  {p.timeToRead} minute read
                </footer>
            }
          </div>
        }
      </div>
    </li>
    </a>)
}

const Article = (a: IArticle) => {
  const {heroimage} = a.frontmatter
  let img = heroimage
  let height = "96px"
  let width = "128px"

  return (
    <a key={a.frontmatter.path} href={a.frontmatter.path}>
    <li className="post">
      {img && <div className="hero" style={ {backgroundImage: `url('${img}')`, width, height} }>
      </div>}
      <div className="title">
        <h4>{a.frontmatter.title}</h4>
      </div>
      <div className="teaser col-12">
        <div className="body">
          {a.excerpt}
        </div>
      </div>
    </li>
    </a>)
}

export const BlogIndexPage = ({ data }: IPageContext<IPageData>) => {
  
  const postsAndArticles = mergeBlogsAndArticles(data.articles, data.blogs);

  let currentYear = 9999

  return (<Container fluid className="homepage">
    <Helmet title={'Blog Posts'} titleTemplate={undefined}>
    </Helmet>
    <Row>
      <Col xs={12} md={{ size: 9, offset: 3 }} >
        <ul className="post-list">
        {postsAndArticles.map((postOrArticle) => {
          const dt = parseISOLocal(postOrArticle.frontmatter.date)
          let renderYearHeader = false
          if (dt.getFullYear() != currentYear) {
            currentYear = dt.getFullYear()
            renderYearHeader = true
          }

          return <>
            {renderYearHeader && <h2 className="year-header">{currentYear}</h2>}
            {
              postOrArticle.frontmatter.contentType == 'article' ?
                <Article {...postOrArticle as IArticle} /> :
                <BlogPost {...postOrArticle as IPost} />
            }
          </>
        })}
        </ul>
      </Col>
    </Row>
  </Container>)
}
