import * as React from 'react'
import { Container, Card, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import Link from 'gatsby-link'
import * as graphql from 'graphql'

import Hero from '../components/Hero'

const IndexPage = ({ data }: IPageContext<IPageData>) => (
  <Container fluid>
    <Hero {...data.hero} />
    {data.allMarkdownRemark.edges.filter(post => post.node.frontmatter.contentType === 'blog').map(({ node: post }) => (
      <Card style={{marginBottom: 10}} key={post.id}>
        <CardBody>
          <CardTitle><Link to={post.frontmatter.path}>{post.frontmatter.title}</Link></CardTitle>
          <CardSubtitle style={{marginBottom: 10}}>{post.frontmatter.date}</CardSubtitle>
          <CardText>{post.excerpt}</CardText>
        </CardBody>
      </Card>
    ))}
  </Container>
)

export default IndexPage

interface IPageData {
  allMarkdownRemark: {
    edges: [
      {
        node: {
          excerpt: string,
          id: any,
          frontmatter: {
            title: string,
            contentType: string,
            date: string,
            path: string
          }
        }
      }
    ]
  },
  hero: any
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          frontmatter {
            title
            contentType
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
    hero: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/\/components/Hero\\.md$/"}}) {
      edges {
        node {
          id
          frontmatter {
            image
            title
          }
        }
      }
    }
  }
`
