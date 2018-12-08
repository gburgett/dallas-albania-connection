
import {ILayoutData} from '../../../components/layouts/application'

export const FakeLayoutData: ILayoutData = {
  site: {
    siteMetadata: {
      title: 'TeamAlbania.org',
      siteUrl: 'https://www.teamalbania.org',
      signupFormUrl: 'https://test.com'
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
      {node: { frontmatter: { contentType: 'page', path: '/about', title: 'About' } } }
    ]
  },
  blogs: {
    edges: [
    ]
  }
}