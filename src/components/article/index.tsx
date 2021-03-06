import * as React from 'react'
import { Container } from 'reactstrap'
import Helmet from 'react-helmet'
import { GatsbyImageProps } from 'gatsby-image'

import Hero from '../hero/Hero'
import Feature, {IFeatureProps} from '../Feature'
import { ITeamRosterProps, TeamRoster, ICollatedSmappData } from '../roster';
import { ISmappExportFields, collateByDesignationNumber } from '../roster/support';


export interface ITemplateData {
  site: ISite,
  markdownRemark: {
    html: string,
    frontmatter: {
      path: string,
      date: string,
      title: string,
      heroimage: string,
      heroImageSharp: GatsbyImageProps | null
      feature?: IFeatureProps & {
        show?: boolean
      },
      showRoster?: boolean,
      roster: {
        header: string,
        text: string,
        projectIds: string[],
        teams: ITeamRosterProps[]
      }
    }
  }
  smappExport?: {
    edges: {
      node: ISmappExportFields
    }[]
  }
}

export function ArticleTemplate ({ data }: IPageContext<ITemplateData>) {
  const { markdownRemark: post, smappExport } = data
  const { heroimage, heroImageSharp, title, feature, showRoster, roster } = post.frontmatter;
  const {siteUrl} = data.site.siteMetadata;

  const year = data.markdownRemark.frontmatter.path.replace(/^\//, '')

  let collatedData: ICollatedSmappData
  if (roster && roster.teams && roster.teams.length > 0 && roster.projectIds && smappExport) {
    const dataForThisYear = smappExport.edges
      .filter(({node}) => year == node.year)
      .filter(({node}) => roster.projectIds.includes(node.name))
    collatedData = collateByDesignationNumber(dataForThisYear.map(edge => edge.node))
  }

  const rosterComponent = showRoster && roster && <div className="row">
    <div className="col-12">
      {roster.header && <h2 id="roster">{roster.header}</h2>}
      {roster.text && <div className="markdown" dangerouslySetInnerHTML={{ __html: roster.text }}></div>}
      {roster.teams && roster.teams.map(team => <TeamRoster {...team} data={collatedData} />)}
    </div>
  </div>

  return (
    <div>
      <Helmet title={post.frontmatter.title}>
        {heroimage && <meta property="og:image" content={siteUrl + heroimage}></meta>}
      </Helmet>

      <Container fluid>
        {heroimage && <Hero image={heroImageSharp || heroimage} />}
        {feature && feature.show &&
            <Feature {...feature} />}
      </Container>

      <Container className="main">

        {!(feature && feature.show) &&
          <h1 className='display-3'>{title}</h1>}
        {post.html && <div className="markdown" dangerouslySetInnerHTML={{ __html: post.html }} />}

        {rosterComponent}
      </Container>
    </div>
  )
}
