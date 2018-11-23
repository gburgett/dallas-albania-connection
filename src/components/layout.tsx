import * as React from 'react'
import { Container } from 'reactstrap'
import { Link } from 'gatsby'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from "gatsby"

// code syntax-highlighting theme
// feel free to change it to another one
import 'prismjs/themes/prism-twilight.css'

// main site style
import './layout.scss'

import {IFooterFields, Footer} from './footer/Footer'
import { ISitemapFields } from './footer/Sitemap';

class Template extends React.Component<{ data: ILayoutData }, any> {

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
            <Link to='/' className='navbar-brand'>Home</Link>
            <ul className='nav navbar-nav'>

              {user && (
                <li className='nav-item'>
                  <a href='/admin' className='nav-link'>Admin</a>
                </li>
              )}

              <li className='nav-item'>
                <Link to='/about' className='nav-link'>About</Link>
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

export const Layout = ({children}) => {
  return <StaticQuery
    query={graphql`
      query LayoutIndexQuery {
        site {
          siteMetadata {
            title
          }
        }
        footer: markdownRemark(fileAbsolutePath: {regex: "/\/components/footer/Footer\\.md$/"}) {
          ...footerFields
        }
        sitemap: allMarkdownRemark(filter: { frontmatter: { path: { ne:null }, public: {ne: false} } }, sort: {order: DESC, fields: [frontmatter___date]}) {
          edges {
            node {
              ...sitemapFields
            }
          }
        }
        blogs: allMarkdownRemark(filter: { frontmatter: { contentType: { eq: "blog" }, published: {ne: false} } }, sort: {order: DESC, fields: [frontmatter___date]}) {
          edges {
            node {
              ...sitemapFields
            }
          }
        }
      }
    `}
    render={(data: ILayoutData) =>
      <Template data={data}>
        {children}
      </Template>}
  />
}

export function withLayout<TProps>(
  PageComponent: React.ComponentType<TProps>,
): React.ComponentType<TProps> {
  return (props: TProps) => (
    <Layout>
      <PageComponent {...props} />
    </Layout>
  )
}

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
