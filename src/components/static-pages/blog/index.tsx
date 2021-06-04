import * as React from 'react'
import { Container, Row, Col } from "reactstrap";
import { Helmet } from "react-helmet";
import {InstantSearch, SearchBox, Hits, Configure} from 'react-instantsearch-dom'
import * as algoliasearch from 'algoliasearch';
import Img, { FixedObject } from 'gatsby-image';

import { parseISOLocal, parseUrl } from '../../blog/utilities';

export interface IPost {
  id: string
  excerpt: string
  timeToRead: number
  frontmatter: {
    slug: string
    externalUrl: string
    title: string
    date: string
    heroimage: string
    heroImageSharp: { fixed: FixedObject } | null
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
    heroImageSharp: { fixed: FixedObject } | null
  }
}

interface IPageData {
}

export const PostList = ({ posts }: { posts: IPost[] }) => {
  return <div>
    <h3>Blog Posts</h3>
    <ul className="post-list">
      {posts.map(p => <BlogPost {...p} />)}
    </ul>
    </div>
}

export const BlogPost = (p: IPost) => {
  const {heroimage, heroImageSharp, author} = p.frontmatter

  let img = heroImageSharp ?
    <Img fixed={{
      ...heroImageSharp.fixed,
      width: 128,
      height: 96
    }} /> :
    heroimage ? <img src={heroimage} style={{width: "128px", height: "96px"}} /> : undefined

  if (!img && author) {
    img = author.photo ?
      <img className="author" src={author.photo} style={{width: "128px", height: "96px"}} /> :
      author.gravatar ? 
        <img className="author" src={`https://www.gravatar.com/avatar/${author.gravatar}`} style={{width: "128px", height: "96px"}} /> :
          undefined
  }

  return (
    <a key={p.frontmatter.externalUrl || p.frontmatter.slug}
      href={p.frontmatter.externalUrl || `/blog/${p.frontmatter.slug}`}>
    <li className="post">
      {img}
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
                  {parseUrl(p.frontmatter.externalUrl).host} <i className="fa fa-external-link-alt" />
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
  const {heroimage, heroImageSharp} = a.frontmatter

  let img = heroImageSharp ?
    <Img fixed={{
      ...heroImageSharp.fixed,
      width: 128,
      height: 96
    }} /> :
    heroimage ? <img src={heroimage} style={{height: "96px"}} /> : undefined
  return (
    <a key={a.frontmatter.path} href={a.frontmatter.path}>
    <li className="post">
      {img}
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

const algoliaAppId = process.env.GATSBY_ALGOLIA_APP_ID
const indexPrefix = process.env.GATSBY_ALGOLIA_INDEX_NAME
const searchApiKey = process.env.GATSBY_ALGOLIA_SEARCH_API_KEY

const searchClient = algoliasearch(
  algoliaAppId,
  searchApiKey
);

export const BlogIndexPage = ({ }: IPageContext<IPageData>) => {

  let currentYear = 9999

  return (<Container fluid className="homepage">
    <Helmet title={'Blog Posts'} titleTemplate={undefined}>
    </Helmet>
    <Row>
      <Col xs={12} md={{ size: 9, offset: 3 }} >
        <InstantSearch
          searchClient={searchClient}
          appId={algoliaAppId}
          indexName={indexPrefix + '_blogs'}
          apiKey={searchApiKey}
        >
          <Configure hitsPerPage={99} />
          <SearchBox />

          <Hits<IPost | IArticle> hitComponent={
            ({ hit }) => {
              const dt = parseISOLocal(hit.frontmatter.date)
              let renderYearHeader = false
              if (dt.getFullYear() != currentYear) {
                currentYear = dt.getFullYear()
                renderYearHeader = true
              }
              return <>
              {renderYearHeader && <h2 className="year-header">{currentYear}</h2>}
              {
                hit.frontmatter.contentType == 'article' ?
                  <Article {...hit as IArticle} /> :
                  <BlogPost {...hit as IPost} />
              }
            </>
            }
          } />
          <a href="https://www.algolia.com/" style={{float: 'right'}}>
            <img src="/search-by-algolia-light-background.svg"></img>
          </a>
        </InstantSearch>
      </Col>
    </Row>
  </Container>)
}
