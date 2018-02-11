import * as React from 'react'
import { Row, Col } from 'reactstrap'
import Link from 'gatsby-link'

export interface IPageSitemapInfo {
  title: string,
  path: string
}

export interface ISitemapFields {
  pages: Array<IPageSitemapInfo>
  posts: Array<IPageSitemapInfo>
}

export const Sitemap = ({ pages, posts }: ISitemapFields) => {

  const pagesColumns = Math.ceil(pages.length / 6)

  return (<div>
    <h4>Sitemap</h4>
    <Row>
      <Pages pages={pages} columns={pagesColumns} />
      <Posts posts={posts} />
    </Row>
  </div>)
}

const Pages = (props: { pages: Array<IPageSitemapInfo>, columns: number }) => {
  const mdCol = Math.max(props.columns * 3, 4)
  return <Col md={mdCol}>
    <span className="list-header">Pages</span>
    <ul style={ {columnCount: props.columns} }>
      {props.pages.map(p => (
        <li key={p.path}>
          <Link to={p.path}>{p.title}</Link>
        </li>
      ))}
    </ul>
  </Col>
}

const Posts = (props: { posts: Array<IPageSitemapInfo> }) => {
  return <Col md={4}>
    <span className="list-header">Recent Posts</span>
    <ul>
      {props.posts.map(p => (
        <li key={p.path}>
          <Link to={p.path}>{p.title}</Link>
        </li>
      ))}
    </ul>
  </Col>
}