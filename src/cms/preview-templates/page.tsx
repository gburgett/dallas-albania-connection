
import * as React from 'react';
import * as ReactDomServer from 'react-dom/server'

import {FakeLayoutData} from './fixtures/layouts'
import { ApplicationLayout, ILayoutData } from '../../components/layouts/application';
import { PageTemplate, ITemplateData } from '../../components/page';

export const PagePreview = ({entry, widgetFor, getAsset}) => {

  // Add this blog to the Recent Posts at the bottom
  const layoutData: ILayoutData = JSON.parse(JSON.stringify(FakeLayoutData))
  const pub = entry.getIn(['data', 'public']) as boolean
  if (pub !== false) {
    layoutData.sitemap.edges.push({
      node: {
        id: 'test',
        frontmatter: {
          path: entry.getIn(['data', 'path']) as string,
          title: entry.getIn(['data', 'title']) as string
        }
      }
    })
  }

  const heroImage = getAsset(entry.getIn(['data', 'heroimage']))
  const featureImage = getAsset(entry.getIn(['data', 'feature', 'image']))

  // Grab the fields
  const fields: ITemplateData = {
    site: layoutData.site,
    markdownRemark: {
      html: ReactDomServer.renderToStaticMarkup(widgetFor('body')) as string,
      frontmatter: {
        public: pub,
        path: entry.getIn(['data', 'path']),
        date: entry.getIn(['data', 'date']),
        title: entry.getIn(['data', 'title']),
        heroimage: heroImage ? heroImage.value : undefined
      }
    }
  }

  const pathname = entry.getIn(['data', 'path'])

  return <ApplicationLayout data={layoutData}>
      <PageTemplate data={fields} location={{pathname}} />
    </ApplicationLayout>
};