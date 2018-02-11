import * as React from 'react'
import { Row, Col, Container, Card, CardGroup, CardImg, CardDeck, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import Link from 'gatsby-link'
import * as graphql from 'graphql'

import Hero from '../components/hero/Hero'
import Feature from '../components/Feature'
import { Summary as EventSummary } from '../events/summary'
import { IEventFields } from '../events';

const Post = (post: IPost) => (
  <Card style={{marginBottom: 10}} key={post.id}>
    <CardBody>
      <CardImg top width="100%" src={post.frontmatter.heroimage} alt="Card image cap" />
      <CardTitle><Link to={post.frontmatter.path}>{post.frontmatter.title}</Link></CardTitle>
      <CardSubtitle style={{marginBottom: 10}}>{post.frontmatter.date}</CardSubtitle>
      <CardText>{post.excerpt}</CardText>
    </CardBody>
  </Card>
)

const GroupedPosts = ({ cards }: { cards: Array<IPost> }) => {
  const groups = []
  for(let i = 0; i < cards.length; i += 2) {
  groups.push(<CardGroup key={i}>
    <Post {...cards[i]} />
    {i + 1 < cards.length ?
      <Post {...cards[i+1]} /> :
      <Card className='empty'></Card>}
  </CardGroup>)
  }
  return <Row>{groups}</Row>
}

const IndexPage = ({ data }: IPageContext<IPageData>) => {
  const cards = data.blogs.edges.filter(post => post.node.frontmatter.homepage).map(edge => edge.node)

  const { feature } = data.root.frontmatter

  console.log('events', data.events)

  return (<Container fluid>
    <Hero {...data.hero} />
    {feature && <Feature {...feature} />}
    <Row>
      <Col xs={12} md={3}>
        <h3>Upcoming Events</h3>
        {data.events.edges.map((edge, i) => {
          const dt = Date.parse(edge.node.frontmatter.date)
          let yesterday = Date.now() - ( 1 * 24 * 60 * 60 * 1000 )
          if (dt > yesterday) {
            return <EventSummary key={dt} {...edge.node} collapse={i > 0} />
          }
        })}
      </Col>
      <Col xs={12} md={9}>
        <GroupedPosts cards={cards} />
      </Col>
    </Row>
  </Container>)
}

export default IndexPage

interface IPageData {
  root: {
    frontmatter: {
      feature: {
        title: string
        image: string
        link: string
        buttonText: string
      }
    }
  }
  blogs: {
    edges: [
      {
        node: IPost
      }
    ]
  },
  events: {
    edges: [
      {
        node: IEventFields
      }
    ]
  }
  hero: {
    html: string,
    frontmatter: {
      image: string,
      title: string
    }
  }
}

interface IPost {
  excerpt: string,
  id: any,
  frontmatter: {
    title: string,
    contentType: string,
    date: string,
    path: string,
    homepage: boolean,
    heroimage: string
  }
}

export const pageQuery = graphql`
query IndexQuery {
  root: markdownRemark(fileAbsolutePath: {regex: "/\/pages\/homepage\/_index\\.md$/"}) {
    frontmatter {
      feature {
        title
        image
        link
        buttonText
      }
    }
  }
  blogs: allMarkdownRemark(filter: {frontmatter: {homepage: {eq: true}}}, sort: {order: DESC, fields: [frontmatter___date]}) {
    edges {
      node {
        excerpt(pruneLength: 150)
        id
        frontmatter {
          title
          contentType
          date(formatString: "MMMM DD, YYYY")
          path
          heroimage
          homepage
        }
      }
    }
  }
  events: allMarkdownRemark(filter: { fileAbsolutePath: {regex: "/\\/events\\/.+\\.md$/"}}, sort: {order: ASC, fields: [frontmatter___date]}, limit: 4) {
    edges {
      node {
        ...eventFields
      }
    }
  }
  hero: markdownRemark(fileAbsolutePath: {regex: "/\/components/hero/Hero\\.md$/"}) {
    html
    frontmatter {
      image
      title
    }
  }
}
`
