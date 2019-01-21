
import * as React from 'react';
import * as ReactDomServer from 'react-dom/server'

import {FakeLayoutData} from './fixtures/layouts'
import { ApplicationLayout, ILayoutData } from '../../components/layouts/application';
import { BlogTemplate, ITemplateData, IBlogPreviewData } from '../../components/blog';
import { BlogPost as BlogPostListItem, IPost } from '../../components/static-pages/blog';

export const BlogPreview = ({entry, widgetFor, getAsset}) => {

  // Add this blog to the Recent Posts at the bottom
  const layoutData: ILayoutData = JSON.parse(JSON.stringify(FakeLayoutData))
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
    } as IBlogPreviewData
  })

  const heroImage = getAsset(entry.getIn(['data', 'heroimage']))
  const authorPhoto = getAsset(entry.getIn(['data', 'author', 'photo']))
  const body = entry.getIn(['data', 'body']) as string
  console.log('body', body)

  // Grab the fields
  const fields: ITemplateData & { markdownRemark: IPost } = {
    site: layoutData.site,
    markdownRemark: {
      id: 'test',
      html: ReactDomServer.renderToStaticMarkup(widgetFor('body')) as string,
      excerpt: body.substring(0, 100) + '...',
      timeToRead: 0 as number,
      frontmatter: {
        slug: entry.getIn(['data', 'slug']),
        externalUrl: entry.getIn(['data', 'externalUrl']),
        contentType: 'blog',
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
      edges: layoutData.blogs.edges as Array<{ node: IBlogPreviewData }>
    },
    articles: {
      edges: []
    }
  }

  const pathname = entry.getIn(['data', 'path'])

  return <>
      <ul className="post-list">
        <BlogPostListItem {...fields.markdownRemark} />
      </ul>
      <hr className="thick" />
      { 
        fields.markdownRemark.frontmatter.externalUrl ?
          <iframe src={fields.markdownRemark.frontmatter.externalUrl}
            style={{width: '100%', minHeight: '1000px' }}></iframe> :
          <ApplicationLayout data={layoutData}>
            <BlogTemplate data={fields} location={{pathname}} />
          </ApplicationLayout>
      }
    </>
};
