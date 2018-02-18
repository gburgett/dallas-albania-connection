import * as React from 'react'
import { Row, Col, Container, Card, CardGroup, CardImg, CardDeck, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import Link from 'gatsby-link'
import * as graphql from 'graphql'
import Helmet from 'react-helmet'

import Hero from '../components/hero/Hero'
import Feature from '../components/Feature'
import { Summary as EventSummary } from '../events/summary'
import { IEventFields } from '../events';

const Post = (post: IArticle) => (
  <Card style={{marginBottom: 10}} key={post.id}>
    <CardBody>
      <CardImg top width="100%" src={post.frontmatter.heroimage} alt="Card image cap" />
      <CardTitle><Link to={post.frontmatter.path}>{post.frontmatter.title}</Link></CardTitle>
      <CardSubtitle style={{marginBottom: 10}}>{post.frontmatter.date}</CardSubtitle>
      <CardText>{post.excerpt}</CardText>
    </CardBody>
  </Card>
)

const GroupedPosts = ({ cards }: { cards: Array<IArticle> }) => {
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

  const featuredArticles = data.root.frontmatter.articles.map(a => a.path);
  const cards = data.articles.edges.map(edge => ({
    ...edge.node,
    index: featuredArticles.indexOf(edge.node.frontmatter.path)
    }))
    .filter(n =>  n.index >= 0)
    .sort((a, b) => a.index - b.index)

  const { feature, hero } = data.root.frontmatter
  const {title, siteUrl} = data.site.siteMetadata

  let yesterday = Date.now() - ( 1 * 24 * 60 * 60 * 1000 )
  const events = data.events.edges
    .map(edge => edge.node)
    .filter(node => Date.parse(node.frontmatter.date) > yesterday)

  return (<Container fluid>
    <Helmet title={title} titleTemplate={undefined}>
        {hero && <meta property="og:image" content={siteUrl + hero.image}></meta>}
    </Helmet>
    <Hero {...hero} />
    {feature && feature.show && <Feature {...feature} />}
    <Row>
      <Col xs={12} md={3}>
        <h3>Upcoming Events</h3>
        {events.map((node, i) => {
          const dt = Date.parse(node.frontmatter.date)
          return <EventSummary key={dt} {...node} collapse={i > 0} />
        })}
      </Col>
      <Col xs={12} md={9}>
        <GroupedPosts cards={cards} />
      </Col>
    </Row>
  </Container>)
}

export default IndexPage

export interface IPageData {
  site: ISite,
  root: {
    frontmatter: {
      feature: {
        show: boolean,
        title: string,
        image: string,
        link: string,
        buttonText: string
      },
      hero: {
        image: string,
        title: string,
        subtitle: string
      }
      articles: Array<{
        path: string
      }>
    }
  },
  articles: {
    edges: Array<{ node: IArticle }>
  },
  events: {
    edges: Array<{node: IEventFields}>
  }
}

export interface IArticle {
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
  site {
    siteMetadata {
      title
      siteUrl
    }
  }
  root: markdownRemark(fileAbsolutePath: {regex: "/\/pages\/homepage\/_index\\.md$/"}) {
    frontmatter {
      feature {
        show
        title
        image
        link
        buttonText
      }
      hero {
        image
        title
        subtitle
      }
      articles{
        path
      }
    }
  }
  articles: allMarkdownRemark(filter: {frontmatter: {contentType: {eq: "article"}}}, sort: {order: DESC, fields: [frontmatter___date]}) {
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
}
`
