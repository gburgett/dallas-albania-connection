
import * as React from 'react';
import * as ReactDomServer from 'react-dom/server'
import { Footer, IFooterFields } from '../../components/footer/Footer';
import { ISitemapProps } from '../../components/footer/Sitemap';

export const FooterPreview = ({entry, widgetFor, widgetsFor}) => {
  const contact = widgetsFor('contact')
    .map(w => w.get('data'))
    .map(c => ({
      name: c.get('name'),
      email: c.get('email'),
      phone: c.get('phone')
    }))
    .toArray()

  const fields: IFooterFields = {
    html: ReactDomServer.renderToStaticMarkup(widgetFor('body')) as string,
    frontmatter: {
      contact: contact,
      mailchimp: entry.getIn(['data', 'mailchimp'])
    }
  }

  return <Footer sitemap={fakeSitemap} fields={fields} />
};


export const fakeSitemap: ISitemapProps = {
  pages: [
    { frontmatter: { path: '/about', title: 'About' } },
    { frontmatter: { path: '/fake', title: 'Fake Page'} }
  ],
  posts: [
    { frontmatter: { path: '/fake1', title: 'Fake Article 1' } },
    { frontmatter: { path: '/fake2', title: 'Fake Article 2' } },
  ]
}

/*
{
  "collection": {
    "name": "footer",
    "label": "Site Footer",
    "folder": "src/components/footer",
    "create": false,
    "fields": [
      {
        "label": "Contact Info",
        "name": "contact",
        "widget": "list",
        "fields": [
          {
            "label": "Name",
            "name": "name",
            "widget": "string",
            "required": true
          },
          {
            "label": "Email",
            "name": "email",
            "widget": "string",
            "required": true
          },
          {
            "label": "Phone",
            "name": "phone",
            "widget": "string"
          }
        ]
      },
      {
        "label": "Mailchimp Signup List Url",
        "name": "mailchimp",
        "widget": "string"
      },
      {
        "label": "Body",
        "name": "body",
        "widget": "markdown"
      }
    ],
    "type": "folder_based_collection"
  },
  "entry": {
    "partial": false,
    "path": "src/components/footer/Footer.md",
    "isModification": null,
    "raw": "---\ncontact:\n  - name: Gordon Burgett\n    email: info@albania-dallas-connection.netlify.com\n    phone: 972-275-9023\nmailchimp: https://gordonburgett.us11.list-manage.com/subscribe/post?u=fbcbfba66020e12dd41b9cf1b&amp;id=4a0067c925\n---\n\nCopyright © 2018 Gordon Burgett\nAll rights reserved",
    "data": {
      "contact": [
        {
          "name": "Gordon Burgett",
          "email": "info@albania-dallas-connection.netlify.com",
          "phone": "972-275-9023"
        }
      ],
      "mailchimp": "https://gordonburgett.us11.list-manage.com/subscribe/post?u=fbcbfba66020e12dd41b9cf1b&amp;id=4a0067c925",
      "body": "\nCopyright © 2018 Gordon Burgett\nAll rights reserved"
    },
    "slug": "Footer",
    "metaData": null,
    "newRecord": false,
    "isFetching": false,
    "label": null,
    "collection": "footer"
  },
  "fields": [
    {
      "label": "Contact Info",
      "name": "contact",
      "widget": "list",
      "fields": [
        {
          "label": "Name",
          "name": "name",
          "widget": "string",
          "required": true
        },
        {
          "label": "Email",
          "name": "email",
          "widget": "string",
          "required": true
        },
        {
          "label": "Phone",
          "name": "phone",
          "widget": "string"
        }
      ]
    },
    {
      "label": "Mailchimp Signup List Url",
      "name": "mailchimp",
      "widget": "string"
    },
    {
      "label": "Body",
      "name": "body",
      "widget": "markdown"
    }
  ],
  "fieldsMetaData": {}
}
*/