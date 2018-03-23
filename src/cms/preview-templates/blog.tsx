
import * as React from 'react';
import * as ReactDomServer from 'react-dom/server'

import TemplateWrapper from '../../layouts/index'
import Template, {ITemplateData} from '../../templates/blog'

import {FakeLayoutData} from './fixtures/layouts'

export const BlogPreview = ({entry, widgetFor, getAsset}) => {

  // Add this blog to the Recent Posts at the bottom
  const layoutData = JSON.parse(JSON.stringify(FakeLayoutData))
  layoutData.blogs.edges.push({
    node: {
      id: 'test',
      excerpt: 'test test test...',
      timeToRead: 0,
      frontmatter: {
        contentType: 'blog',
        slug: entry.getIn(['data', 'slug']) as string,
        title: entry.getIn(['data', 'title']) as string,
        date: entry.getIn(['data', 'date']) as string,
        published: entry.getIn(['data', 'published'])
      }
    }
  })

  const heroImage = getAsset(entry.getIn(['data', 'heroimage']))
  const authorPhoto = getAsset(entry.getIn(['data', 'author', 'photo']))

  // Grab the fields
  const fields: ITemplateData = {
    site: { siteMetadata: { title: 'Team Albania', siteUrl: 'https://www.teamalbania.org' } },
    markdownRemark: {
      html: ReactDomServer.renderToStaticMarkup(widgetFor('body')) as string,
      timeToRead: 0 as number,
      frontmatter: {
        slug: entry.getIn(['data', 'slug']),
        date: entry.getIn(['data', 'date']),
        title: entry.getIn(['data', 'title']),
        published: entry.getIn(['data', 'published']),
        heroimage: heroImage ? heroImage.value : undefined,
        heroAttribution: entry.getIn(['data', 'heroAttribution']),
        author: {
          name: entry.getIn(['data', 'author', 'name']),
          gravatar: entry.getIn(['data', 'author', 'gravatar']),
          photo: authorPhoto
        }
      }
    },
    blogs: {
      edges: layoutData.blogs.edges
    }
  }

  const pathname = entry.getIn(['data', 'path'])

  return <TemplateWrapper data={layoutData} location={{pathname}}>
      {() => <Template data={fields} location={{pathname}} />}
    </TemplateWrapper>
};