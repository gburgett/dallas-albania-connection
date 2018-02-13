
import * as React from 'react';
import * as ReactDomServer from 'react-dom/server'

import TemplateWrapper from '../../layouts/index'
import Template, {ITemplateData} from '../../templates/about'

import {FakeLayoutData} from './fixtures/layouts'

export const AboutPreview = ({entry, widgetFor, getAsset}) => {

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
    markdownRemark: {
      html: ReactDomServer.renderToStaticMarkup(widgetFor('body')) as string,
      frontmatter: {
        path: entry.getIn(['data', 'path']),
        title: entry.getIn(['data', 'title']),
      }
    }
  }

  const pathname = entry.getIn(['data', 'path'])

  return <TemplateWrapper data={layoutData} location={{pathname}}>
      {() => <Template data={fields} location={{pathname}} />}
    </TemplateWrapper>
};