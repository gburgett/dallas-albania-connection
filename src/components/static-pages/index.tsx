import * as React from 'react'
import { Row, Col, Container, Card, CardGroup, CardImg, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import Helmet from 'react-helmet'

import Hero from '../hero/Hero'
import Feature, {IFeatureProps} from '../Feature'
import { Summary as EventSummary } from '../events/summary'
import { IEventFields } from '../events';

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
      postsToShow: number
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


const Article = (article: IArticle) => (
  <Card style={{marginBottom: 10}} key={article.id}>
    <CardBody>
      <CardImg top width="100%" src={article.frontmatter.heroimage} alt="Card image cap" />
      <CardTitle><a href={article.frontmatter.path}>{article.frontmatter.title}</a></CardTitle>
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
  return <div>
    <h3>Blog Posts</h3>
    <ul className="post-list">
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
          <a key={p.frontmatter.slug} href={`/blog/${p.frontmatter.slug}`}>
          <li className="post">
            {img && <div className="hero" style={ {backgroundImage: `url('${img}')`, width, height} }>
            </div>}
            <div className="title">
              <h4>{p.frontmatter.title}</h4>
              {author && 
                <span className="body">by {author.name}</span>}
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
    </div>
}

export const IndexPage = ({ data }: IPageContext<IPageData>) => {

  const featuredArticles = (data.root.frontmatter.articles || []).map(a => a.path);
  const cards = data.articles.edges.map(edge => ({
    ...edge.node,
    index: featuredArticles.indexOf(edge.node.frontmatter.path)
    }))
    .filter(n =>  n.index >= 0)
    .sort((a, b) => a.index - b.index)

  const { feature, hero, postsToShow, } = data.root.frontmatter
  const {title, siteUrl, signupFormUrl} = data.site.siteMetadata

  let yesterday = Date.now() - ( 1 * 24 * 60 * 60 * 1000 )
  const events = data.events.edges
    .map(edge => edge.node)
    .filter(node => Date.parse(node.frontmatter.date) > yesterday)
  
  const featuredPostSlugs = (data.root.frontmatter.featuredPosts || []).map(p => p.slug);
  const posts = (data.blogs || { edges: [] }).edges.map(edge => ({
      ...edge.node,
      index: featuredPostSlugs.indexOf(edge.node.frontmatter.slug)
    }))
  const featuredPosts = posts.filter(n => n.index >= 0).sort((a, b) => a.index - b.index)
  const latestPosts = posts.filter(n => n.index < 0).slice(0, Math.max(postsToShow - featuredPosts.length, 0))
  console.log(postsToShow, featuredPosts.length, latestPosts)
  featuredPosts.push(...latestPosts)
  const remainingPosts = posts.filter(n => n.index < 0).slice(latestPosts.length)

  return (<Container fluid className="homepage">
    <Helmet title={title} titleTemplate={undefined}>
        {hero && <meta property="og:image" content={siteUrl + hero.image}></meta>}
    </Helmet>
    <Hero {...hero} >
      <div className="signup">
        <a className="btn btn-dark" href={signupFormUrl}><i className="fas fa-envelope"></i>Get updates!</a>
      </div>
    </Hero>
    {feature && feature.show && <Feature {...feature} />}
    <Row>
      <Col xs={12} md={3} className="eventsList">
        <h3>Upcoming Events</h3>
        {events.map((node, i) => {
          const dt = Date.parse(node.frontmatter.date)
          return <EventSummary key={dt} {...node} collapse={i > 0} />
        })}
      </Col>
      <Col xs={12} md={9}>
        <GroupedArticles cards={cards} />
        {featuredPosts.length > 0 && <PostList posts={featuredPosts} />}
        {postsToShow > 0 && remainingPosts.length > 0 && <h4><a href={`/blog/${remainingPosts[0].frontmatter.slug}`}>
          {remainingPosts.length} more {remainingPosts.length > 1 ? 'posts' : 'post'}
          <i style={{paddingLeft: '1em'}} className="fa fa-arrow-right"></i>
          </a></h4>}
      </Col>
    </Row>
  </Container>)
}