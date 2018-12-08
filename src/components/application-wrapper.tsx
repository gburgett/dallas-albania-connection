import * as React from 'react'
import { StaticQuery, graphql } from "gatsby"

// code syntax-highlighting theme
// feel free to change it to another one
import 'prismjs/themes/prism-twilight.css'

// main site style
import '../stylesheets/application.scss'
import { ILayoutData, ApplicationLayout } from './layouts/application';

export const footerFields = graphql`
fragment footerFields on MarkdownRemark {
  html
  frontmatter {
    contact {
      name
      email
      phone
    }
    mailchimp
  }
}
`

export const sitemapFields = graphql`
fragment sitemapFields on MarkdownRemark {
  frontmatter {
    contentType
    path
    slug
    title
    published
  }
}
`

export const LayoutWrapper = ({children}) => {
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
      <ApplicationLayout data={data}>
        {children}
      </ApplicationLayout>}
  />
}

export function withLayout<TProps>(
  PageComponent: React.ComponentType<TProps>,
): React.ComponentType<TProps> {
  return (props: TProps) => (
    <LayoutWrapper>
      <PageComponent {...props} />
    </LayoutWrapper>
  )
}
