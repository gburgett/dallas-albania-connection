import * as React from 'react'
import { Row, Col, Container, Card, CardGroup, CardImg, CardDeck, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import Link from 'gatsby-link'
import * as graphql from 'graphql'
import Helmet from 'react-helmet'

import Hero from '../components/hero/Hero'
import Feature, {IFeatureProps} from '../components/Feature'
import Author from '../components/author'
import { Summary as EventSummary } from '../events/summary'
import { IEventFields } from '../events';

const Article = (article: IArticle) => (
  <Card style={{marginBottom: 10}} key={article.id}>
    <CardBody>
      <CardImg top width="100%" src={article.frontmatter.heroimage} alt="Card image cap" />
      <CardTitle><Link to={article.frontmatter.path}>{article.frontmatter.title}</Link></CardTitle>
      <CardSubtitle style={{marginBottom: 10}}>{article.frontmatter.date}</CardSubtitle>
      <CardText>{article.excerpt}</CardText>
    </CardBody>
  </Card>
)

const GroupedArticles = ({ cards }: { cards: Array<IArticle> }) => {
  const groups = []
  for(let i = 0; i < cards.length; i += 2) {
  groups.push(<CardGroup key={i}>
    <Article {...cards[i]} />
    {i + 1 < cards.length ?
      <Article {...cards[i+1]} /> :
      <Card className='empty'></Card>}
  </CardGroup>)
  }
  return <Row>{groups}</Row>
}

const PostList = ({ posts}: { posts: IPost[] }) => {
  console.log('posts', posts)

  return <ul className="post-list">
      {posts.map(p => {
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
          <a href={`/blog/${p.frontmatter.slug}`}>
          <li className="post">
            <div className="hero" style={ {backgroundImage: `url('${img}')`, width, height} }>
            </div>
            <div className="title">
              <h4>{p.frontmatter.title}</h4>
              {author && 
                <span>by {author.name}</span>}
            </div>
            <div className="teaser">
              <div className="body">
                {p.excerpt}
                <footer className="blockquote-footer">{p.timeToRead} minute read</footer>
              </div>
            </div>
          </li>
          </a>)
      })}
    </ul>
}

const IndexPage = ({ data }: IPageContext<IPageData>) => {

  const featuredArticles = (data.root.frontmatter.articles || []).map(a => a.path);
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
    .slice(0, 4)
  
  const featuredPosts = (data.root.frontmatter.featuredPosts || []).map(p => p.slug);
  const posts = data.blogs.edges.map(edge => ({
      ...edge.node,
      index: featuredPosts.indexOf(edge.node.frontmatter.slug)
    }))
    .filter(n => n.index >= 0)
    .sort((a, b) => a.index - b.index)

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
        <GroupedArticles cards={cards} />
        {posts && posts.length > 0 && <h3>Blog Posts</h3>}
        {posts && posts.length > 0 && <PostList posts={posts} />}
      </Col>
    </Row>
  </Container>)
}

export default IndexPage

export interface IPageData {
  site: ISite,
  root: {
    frontmatter: {
      feature: IFeatureProps & {
        show: boolean
      },
      hero: {
        image: string,
        title: string,
        subtitle: string
      }
      articles: Array<{
        path: string
      }>,
      featuredPosts: {
        slug: string
      }[]
    }
  },
  articles: {
    edges: Array<{ node: IArticle }>
  },
  events: {
    edges: Array<{node: IEventFields}>
  },
  blogs: {
    edges: Array<{node: IPost}>
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
    heroimage: string
  }
}

export interface IPost {
  id: string
  excerpt: string
  timeToRead: string
  frontmatter: {
    slug: string
    title: string
    date: string
    heroimage: string
    author: {
      name: string
      gravatar: string
      photo: string
    }
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
        buttonStyle
        backgroundColor
      }
      hero {
        image
        title
        subtitle
      }
      articles{
        path
      }
      featuredPosts {
        slug
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
        }
      }
    }
  }
  events: allMarkdownRemark(filter: { fileAbsolutePath: {regex: "/\\/events\\/.+\\.md$/"}}, sort: {order: ASC, fields: [frontmatter___date]}) {
    edges {
      node {
        ...eventFields
      }
    }
  }
  blogs: allMarkdownRemark(filter: { frontmatter: { contentType: { eq: "blog" }, published: {ne: false} } }, sort: {order: DESC, fields: [frontmatter___date]}) {
    edges {
      node {
        id
        excerpt
        timeToRead
        frontmatter {
          slug
          title
          date
          heroimage
          author {
            name
            gravatar
            photo
          }
        }
      }
    }
  }
}
`
