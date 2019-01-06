import * as React from 'react'
import { Container } from 'reactstrap'
import Helmet from 'react-helmet'

import {IFooterFields, Footer} from '../footer/Footer'
import { ISitemapFields } from '../footer/Sitemap';

export interface ILayoutData {
  site: ISite,
  footer: IFooterFields,
  sitemap: {
    edges: {
      node: ISitemapFields
    }[]
  },
  blogs: {
    edges: {
      node: ISitemapFields
    }[]
  }
}

export class ApplicationLayout extends React.Component<{ data: ILayoutData }, any> {

  render() {
    const { children, data } = this.props

    let user
    if (typeof window !== 'undefined') {
      user = window.netlifyIdentity && window.netlifyIdentity.currentUser()
    }

    let pages = data.sitemap.edges.map(e => e.node)
      .filter(p => p.frontmatter.published !== false)
      .filter(p => p.frontmatter.contentType != 'blog')
    const posts = data.blogs && data.blogs.edges.map(e => e.node)
      .filter(p => p.frontmatter.published !== false)
      .slice(0, 6)

    return (
      <div className='App'>
        <Helmet titleTemplate={`${data.site.siteMetadata.title} | %s`}>
        </Helmet>
        <div className='navbar navbar-expand-lg navbar-light bg-light'>
          <Container fluid>
            <a href='/' className='navbar-brand'>Home</a>
            <ul className='nav navbar-nav'>

              {user && (
                <li className='nav-item'>
                  <a href='/admin' className='nav-link'>Admin</a>
                </li>
              )}

              <li className='nav-item'>
                <a href='/about' className='nav-link'>About</a>
              </li>
            </ul>
          </Container>
        </div>
        <div className='pageContent'>{children}</div>
        <Footer fields={data.footer} sitemap={{posts, pages}} />
      </div>
    )
  }
}