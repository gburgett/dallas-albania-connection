
import * as React from 'react';
import * as ReactDomServer from 'react-dom/server'

import TemplateWrapper from '../../layouts/index'
import IndexPage, {IPageData, IArticle} from '../../pages/index'
import { IEventFields } from '../../events'

import {FakeLayoutData} from './fixtures/layouts'

export const HomepagePreview = ({entry, widgetFor, getAsset, fieldsMetaData}) => {

  console.log(fieldsMetaData.toJS())

  // Grab the fields
  const fields: IPageData = {
    site: {
      siteMetadata: {
        title: 'teamalbania.org',
        siteUrl: 'https://www.teamalbania.org'
      }
    },
    root: {
      frontmatter: {
        feature: {
          show: entry.getIn(['data', 'feature', 'show']) as boolean,
          title: entry.getIn(['data', 'feature', 'title']) as string,
          link: entry.getIn(['data', 'feature', 'link']) as string,
          buttonText: entry.getIn(['data', 'feature', 'buttonText']) as string,
          image: getAsset(entry.getIn(['data', 'feature', 'image']))
        },
        hero: {
          title: entry.getIn(['data', 'hero', 'title']) as string,
          subtitle: entry.getIn(['data', 'hero', 'subtitle']) as string,
          image: getAsset(entry.getIn(['data', 'hero', 'image']))
        },
        articles: [
          {path: '/fake1'},
          {path: '/fake3'},
          {path: '/fake2'},
          {path: '/fake4'}
        ]
      }
    },
    articles: {
      edges: fakeArticles()
    },
    events: {
      edges: fakeEvents()
    }
  }


  return <TemplateWrapper data={FakeLayoutData} location={{pathname: ''}}>
      {() => <IndexPage data={fields} location={{pathname: ''}} />}
    </TemplateWrapper>
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

function fakeArticles(): Array<{ node: IArticle }> {
  return [
    { node: {
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce justo lectus, ornare vel',
      id: 'fakepost1',
      frontmatter: {
        title: 'Fake Post 1',
        path: '/fake1',
        date: new Date(Date.now() - 30 * DAY).toDateString(),
        contentType: 'article',
        heroimage: '/files/afc.jpg',
        homepage: true
      }
    } },
    { node: {
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce justo lectus, ornare vel',
      id: 'fakepost2',
      frontmatter: {
        title: 'Fake Post 2',
        path: '/fake2',
        date: new Date(Date.now() - 300 * DAY).toDateString(),
        contentType: 'article',
        heroimage: '/files/2016_team.jpg',
        homepage: true
      }
    } },
    { node: {
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce justo lectus, ornare vel',
      id: 'fakepost3',
      frontmatter: {
        title: 'Fake Post 3',
        path: '/fake3',
        date: new Date(Date.now() - 600 * DAY).toDateString(),
        contentType: 'article',
        heroimage: '/files/2015_team_in_berat.jpg',
        homepage: true
      }
    } },
    { node: {
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce justo lectus, ornare vel',
      id: 'fakepost1',
      frontmatter: {
        title: 'Fake Post 4',
        path: '/fake4',
        date: new Date(Date.now() - 1000 * DAY).toDateString(),
        contentType: 'article',
        heroimage: '/files/einstein.jpg',
        homepage: true
      }
    } }
  ]
}