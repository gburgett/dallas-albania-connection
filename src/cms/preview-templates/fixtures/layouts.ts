
import {ILayoutData} from '../../../layouts/index'
import {fakeSitemap} from '../footer'

export const FakeLayoutData: ILayoutData = {
  site: {
    siteMetadata: {
      title: 'TeamAlbania.org'
    }
  },
  footer: {
    html: '<p>Copyright © 2018 Gordon Burgett<br/>All rights reserved</p>',
    frontmatter: {
      contact: [{name: 'Gordon Burgett', email: 'info@TeamAlbania.org'}],
      mailchimp: 'https://test.mailchimp.com'
    }
  },
  sitemap: {
    edges: [
      {node: { id: '1', frontmatter: { contentType: 'page', path: '/about', title: 'About' } } }
    ]
  }
}