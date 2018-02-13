
import * as React from 'react';
import * as ReactDomServer from 'react-dom/server'

import TemplateWrapper from '../../layouts/index'
import Template, {ITemplateData} from '../../templates/blog'

import {FakeLayoutData} from './fixtures/layouts'

export const BlogPreview = ({entry, widgetFor, getAsset}) => {

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

  // Grab the fields
  const fields: ITemplateData = {
    site: { siteMetadata: {} },
    markdownRemark: {
      html: ReactDomServer.renderToStaticMarkup(widgetFor('body')) as string,
      frontmatter: {
        path: entry.getIn(['data', 'path']),
        date: entry.getIn(['data', 'date']),
        title: entry.getIn(['data', 'title']),
        heroimage: getAsset(entry.getIn(['data', 'heroimage']))
      }
    }
  }

  const pathname = entry.getIn(['data', 'path'])

  return <TemplateWrapper data={layoutData} location={{pathname}}>
      {() => <Template data={fields} location={{pathname}} />}
    </TemplateWrapper>
};