import * as React from 'react'
import { Row, Col } from 'reactstrap'

export interface ISitemapFields {
  id?: string
  frontmatter: {
    contentType?: string,
    title: string,
    path?: string,
    slug?: string,
    externalUrl?: string
    published?: boolean
  }
}

export interface ISitemapProps {
  pages: Array<ISitemapFields>
  posts: Array<ISitemapFields>
}

export const Sitemap = ({ pages, posts }: ISitemapProps) => {

  const pagesColumns = Math.ceil(pages.length / 6)

  return (<div>
    <h4>Sitemap</h4>
    <Row>
      <Pages pages={pages} columns={pagesColumns} />
      { posts && <Posts posts={posts} /> }
    </Row>
  </div>)
}

const Pages = (props: { pages: Array<ISitemapFields>, columns: number }) => {
  const mdCol = Math.max(props.columns * 3, 4)
  return <Col md={mdCol}>
    <span className="list-header">Pages</span>
    <ul style={ {columnCount: props.columns} }>
      {props.pages.map(p => (
        <li key={p.frontmatter.path}>
          <a href={p.frontmatter.path}>{p.frontmatter.title}</a>
        </li>
      ))}
    </ul>
  </Col>
}

const Posts = (props: { posts: Array<ISitemapFields> }) => {
  return <Col md={4}>
    <span className="list-header">Recent Posts</span>
    <ul>
      {props.posts.map(p => (
        <li key={p.frontmatter.slug}>
          <a href={p.frontmatter.externalUrl || `/blog/${p.frontmatter.slug}`}>
            {p.frontmatter.title}
          </a>
        </li>
      ))}
    </ul>
  </Col>
}
