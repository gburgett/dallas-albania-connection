import * as React from 'react'
import { Row, Col, Container, Card, CardTitle, CardGroup, CardBody } from 'reactstrap'
import Helmet from 'react-helmet'
import * as graphql from 'graphql'
import { basename } from 'path'
import Link from 'gatsby-link'

import Hero from '../components/hero/Hero'
import Feature, {IFeatureProps} from '../components/Feature'
import { ITeamRosterProps, TeamRoster } from '../components/roster';

export default function Template ({ data }: IPageContext<ITemplateData>) {
  const { markdownRemark: post } = data
  const { heroimage, title, feature, roster } = post.frontmatter;
  const {siteUrl} = data.site.siteMetadata;

  const rosterComponent = roster && <div className="row">
    <div className="col-12">
      {roster.header && <h2 id="roster">{roster.header}</h2>}
      {roster.text && <div dangerouslySetInnerHTML={{ __html: roster.text }}></div>}
      {roster.teams && roster.teams.map(team => <TeamRoster {...team} />)}
    </div>
  </div>

  return (
    <div>
      <Helmet title={post.frontmatter.title}>
        {heroimage && <meta property="og:image" content={siteUrl + heroimage}></meta>}
      </Helmet>

      <Container fluid>
        {heroimage && <Hero image={heroimage} />}
        {feature && feature.show &&
            <Feature {...feature} />}
      </Container>

      <Container>

        <h1 className='display-3'>{title}</h1>
        {post.html && <div dangerouslySetInnerHTML={{ __html: post.html }} />}

        {rosterComponent}
      </Container>
    </div>
  )
}

export interface ITemplateData {
  site: ISite,
  markdownRemark: {
    html: string,
    frontmatter: {
      path: string,
      date: string,
      title: string,
      heroimage: string,
      feature?: IFeatureProps & {
        show?: boolean
      },
      roster: {
        header: string,
        text: string,
        teams: ITeamRosterProps[]
      }
    }
  }
}

export const pageQuery = graphql`
  query ArticleByPath($path: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }

    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        date(formatString: "MMMM DD, YYYY")
        title
        heroimage
        feature {
          show
          title
          image
          link
          buttonText
          buttonStyle
          backgroundColor
        }
        roster {
          header
          text
          teams {
            name
            goal
            members {
              name
              cruId
              goal
            }
          }
        }
      }
    }
  }
`
