import * as React from 'react'
import { Row, Col, Container } from 'reactstrap'

import { Mailchimp } from '../mailchimp'
import { Sitemap, ISitemapProps } from './Sitemap'

export class Footer extends React.Component<{sitemap: ISitemapProps, fields: IFooterFields}> {
  render() {
    const { contact, mailchimp } = this.props.fields.frontmatter

    return (
      <Container fluid className='footer'>
        <Row>
          <Col md={6} className='d-none d-md-block'>
            <Sitemap {...this.props.sitemap} />
          </Col>
          <Col md={6} xs={12}>
              <h4>Sign up for updates!</h4>
              <Mailchimp mailchimp={mailchimp} />
              <h4>Contact</h4>
              <ul style={ {columnCount: contact.length} }>
                {contact.map((c, i) => (
                  <li key={i}>
                    {c.name}<br/>
                    {c.phone}{c.phone && <br/>}
                    {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
                  </li>
                ))}
              </ul>
          </Col>
        </Row>
        <Row className="footer-content markdown"
          dangerouslySetInnerHTML={{ __html: this.props.fields.html }}>
        </Row>
      </Container>
    )
  }
}

export interface IFooterFields {
  html: string,
  frontmatter: {
    contact: [{
      name: string,
      email: string,
      phone?: string
    }]
    mailchimp: string
  }
}
