import * as React from 'react'
import { Row, Col, Container, Card, CardGroup, CardImg, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import Helmet from 'react-helmet'
import Img, { GatsbyImageProps } from "gatsby-image"

import Hero from '../hero/Hero'
import Feature, {IFeatureProps} from '../Feature'
import { Summary as EventSummary } from '../events/summary'
import { IEventFields } from '../events';
import { PostList, IPost, IArticle } from './blog';
import { parseISOLocal } from '../blog/utilities';

export interface IPageData {
  site: ISite,
  root: {
    frontmatter: {
      feature: IFeatureProps & {
        show: boolean
      },
      jumbotronCta: IFeatureProps & {
        showUntil: string
      },
      hero: {
        image: string,
        title: string,
        subtitle: string
      }
      heroImageSharp: GatsbyImageProps | null
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

const Article = (article: IArticle) => {
  const img = article.frontmatter.heroImageSharp ?
    <Img {...article.frontmatter.heroImageSharp} className="card-img-top" /> :
    <img src={article.frontmatter.heroimage} className="card-img-top" />

  return <Card style={{marginBottom: 10}} key={article.id}>
    <a href={article.frontmatter.path} className="a-block">
    <CardBody>
      {img}
      <CardTitle><h4>{article.frontmatter.title}</h4></CardTitle>
      <CardSubtitle style={{marginBottom: 10}}>{article.frontmatter.date}</CardSubtitle>
      <CardText>{article.excerpt}</CardText>
    </CardBody>
    </a>
  </Card>
}

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

export const IndexPage = ({ data }: IPageContext<IPageData>) => {

  const featuredArticles = (data.root.frontmatter.articles || []).map(a => a.path);
  const cards = data.articles.edges.map(edge => ({
    ...edge.node,
    index: featuredArticles.indexOf(edge.node.frontmatter.path)
    }))
    .filter(n =>  n.index >= 0)
    .sort((a, b) => a.index - b.index)

  const { feature, hero, postsToShow, jumbotronCta} = data.root.frontmatter
  const {title, siteUrl} = data.site.siteMetadata

  const yesterday = Date.now() - ( 1 * 24 * 60 * 60 * 1000 )
  const events = data.events.edges
    .map(edge => edge.node)
    .filter(node => parseISOLocal(node.frontmatter.date).getTime() > yesterday)
  
  const featuredPostSlugs = (data.root.frontmatter.featuredPosts || []).map(p => p.slug);
  const posts = (data.blogs || { edges: [] }).edges.map(edge => ({
      ...edge.node,
      index: featuredPostSlugs.indexOf(edge.node.frontmatter.slug)
    }))
  const featuredPosts = posts.filter(n => n.index >= 0).sort((a, b) => a.index - b.index)
  const latestPosts = posts.filter(n => n.index < 0).slice(0, Math.max(postsToShow - featuredPosts.length, 0))
  featuredPosts.push(...latestPosts)
  const remainingPosts = posts.filter(n => n.index < 0).slice(latestPosts.length)

  const showJumbotronCta = jumbotronCta && jumbotronCta.showUntil &&
    (parseISOLocal(jumbotronCta.showUntil).getTime() > yesterday)

  const heroProps: Hero['props'] =
    showJumbotronCta ?
      { 

        ...data.root.frontmatter.hero,
        ...data.root.frontmatter.jumbotronCta,
      } :
      {
        ...data.root.frontmatter.hero,
        image: data.root.frontmatter.heroImageSharp || data.root.frontmatter.hero.image
      }

  return (<Container fluid className="homepage">
    <Helmet title={title} titleTemplate={undefined}>
        {hero && <meta property="og:image" content={siteUrl + hero.image}></meta>}
    </Helmet>
    <Hero {...heroProps} darken={true} >
    </Hero>
    {feature && feature.show && <Feature {...feature} />}
    <Row>
      <Col xs={12} md={3} className="eventsList">
        <h3>Upcoming Events</h3>
        {events.map((node, i) => {
          return <EventSummary key={node.frontmatter.date} {...node} collapse={i > 0} />
        })}
      </Col>
      <Col xs={12} md={9}>
        <GroupedArticles cards={cards} />
        {featuredPosts.length > 0 && <PostList posts={featuredPosts} />}
        {postsToShow > 0 && remainingPosts.length > 0 && <h4>
            <a href="/blog">
              {remainingPosts.length} more {remainingPosts.length > 1 ? 'posts' : 'post'}
              <i style={{paddingLeft: '1em'}} className="fa fa-arrow-right"></i>
            </a>
          </h4>}
      </Col>
    </Row>
  </Container>)
}