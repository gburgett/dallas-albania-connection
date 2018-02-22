
import * as React from 'react';
import * as ReactDomServer from 'react-dom/server'

import TemplateWrapper from '../../layouts/index'
import Template, {ITemplateData} from '../../templates/article'

import {FakeLayoutData} from './fixtures/layouts'

export const ArticlePreview = ({entry, widgetFor, getAsset}) => {

  // Add this blog to the Recent Posts at the bottom
  const layoutData = JSON.parse(JSON.stringify(FakeLayoutData))
  layoutData.sitemap.edges.push({
    node: {
      id: 'test',
      frontmatter: {
        contentType: 'blog',
        path: entry.getIn(['data', 'path']) as string,
        title: entry.getIn(['data', 'title']) as string
      }
    }
  })

  const heroImage = getAsset(entry.getIn(['data', 'heroimage']))
  const featureImage = getAsset(entry.getIn(['data', 'feature', 'image']))

  // Grab the fields
  const fields: ITemplateData = {
    site: { siteMetadata: { title: 'Team Albania', siteUrl: 'https://www.teamalbania.org' } },
    markdownRemark: {
      html: ReactDomServer.renderToStaticMarkup(widgetFor('body')) as string,
      frontmatter: {
        path: entry.getIn(['data', 'path']),
        date: entry.getIn(['data', 'date']),
        title: entry.getIn(['data', 'title']),
        heroimage: heroImage ? heroImage.value : undefined,
        feature: {
          show: entry.getIn(['data', 'feature', 'show']) as boolean,
          title: entry.getIn(['data', 'feature', 'title']) as string,
          image: featureImage ? featureImage.value : undefined,
          link: entry.getIn(['data', 'feature', 'link']) as string,
          buttonText: entry.getIn(['data', 'feature', 'buttonText']) as string,
          buttonStyle: entry.getIn(['data', 'feature', 'buttonStyle']) as string,
          backgroundColor: entry.getIn(['data', 'feature', 'backgroundColor']) as string
        }
      }
    }
  }

  const pathname = entry.getIn(['data', 'path'])

  return <TemplateWrapper data={layoutData} location={{pathname}}>
      {() => <Template data={fields} location={{pathname}} />}
    </TemplateWrapper>
};