
import * as React from 'react';

import {FakeLayoutData} from './fixtures/layouts'
import { ApplicationLayout } from '../../components/layouts/application';
import { IndexPage, IPageData } from '../../components/static-pages';
import { IEventFields } from '../../components/events';

export const HomepagePreview = ({entry, widgetFor, getAsset, fieldsMetaData}) => {

  const articles = []
  if (fieldsMetaData.get('articles')) {
    for (let k of fieldsMetaData.get('articles').keys()) {
      const article = fieldsMetaData.getIn(['articles', k]).toJS()
      articles.push(
        { node: {
          excerpt: article.body.substr(0, 100) + '...',
          id: `fakearticle-${article.date.getTime()}`,
          frontmatter: {
            title: article.title,
            path: article.path,
            date: article.date.toDateString(),
            contentType: article.contentType,
            heroimage: article.heroimage
          }
        } })
    }
  }

  const blogs = []
  if (fieldsMetaData.get('featuredPosts')) {
    for (let k of fieldsMetaData.get('featuredPosts').keys()) {
      const blog = fieldsMetaData.getIn(['featuredPosts', k]).toJS()
      blogs.push(
        { node: {
          excerpt: blog.body.substr(0, 100) + '...',
          timeToRead: '?',
          id: `fakeblog-${blog.date.getTime()}`,
          frontmatter: {
            title: blog.title,
            slug: blog.slug,
            date: blog.date.toDateString(),
            contentType: blog.contentType,
            heroimage: blog.heroimage,
            author: blog.author
          }
        } })
    }
  }

  const heroImage = getAsset(entry.getIn(['data', 'hero', 'image']))
  const featureImage = getAsset(entry.getIn(['data', 'feature', 'image']))

  // Grab the fields
  const fields: IPageData = {
    site: FakeLayoutData.site,
    root: {
      frontmatter: {
        feature: {
          show: entry.getIn(['data', 'feature', 'show']) as boolean,
          title: entry.getIn(['data', 'feature', 'title']) as string,
          link: entry.getIn(['data', 'feature', 'link']) as string,
          buttonText: entry.getIn(['data', 'feature', 'buttonText']) as string,
          image: featureImage ? featureImage.value : undefined,
          buttonStyle: entry.getIn(['data', 'feature', 'buttonStyle']) as string,
          backgroundColor: entry.getIn(['data', 'feature', 'backgroundColor']) as string
        },
        hero: {
          title: entry.getIn(['data', 'hero', 'title']) as string,
          subtitle: entry.getIn(['data', 'hero', 'subtitle']) as string,
          image: heroImage ? heroImage.value : undefined
        },
        articles: entry.getIn(['data', 'articles']).toJS(),
        featuredPosts: entry.getIn(['data', 'featuredPosts']) && entry.getIn(['data', 'featuredPosts']).toJS(),
        postsToShow: entry.getIn(['data', 'postsToShow']) as number
      }
    },
    articles: {
      edges: articles
    },
    blogs: {
      edges: blogs
    },
    events: {
      edges: fakeEvents()
    }
  }


  return <ApplicationLayout data={FakeLayoutData}>
      <IndexPage data={fields} location={{pathname: ''}} />
    </ApplicationLayout>
};

const DAY = 24 * 60 * 60 * 1000;

function fakeEvents(): Array<{ node: IEventFields }> {
  return [
    {node: {
      html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce justo lectus, ornare vel erat ut, tempus facilisis urna. Nunc a. </p>',
      frontmatter: {
        title: 'Fake Event 1',
        date: new Date(Date.now() + 2 * DAY).toDateString(),
        contentType: 'event',
        link: '/fake1'
      }
    }},
    {node: {
      html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce justo lectus, ornare vel erat ut, tempus facilisis urna. Nunc a. </p>',
      frontmatter: {
        title: 'Fake Event 2',
        date: new Date(Date.now() + 5 * DAY).toDateString(),
        contentType: 'event',
      }
    }},
    {node: {
      html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce justo lectus, ornare vel erat ut, tempus facilisis urna. Nunc a. </p>',
      frontmatter: {
        title: 'Fake Event 3',
        date: new Date(Date.now() + 10 * DAY).toDateString(),
        contentType: 'event',
      }
    }}
  ]
}
