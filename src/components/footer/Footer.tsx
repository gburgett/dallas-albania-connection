import * as React from 'react'
import { Row, Col, Container } from 'reactstrap'

import { Sitemap, ISitemapFields } from './Sitemap'

// footer styles
import './footer.scss'

export class Footer extends React.Component<{sitemap: ISitemapFields, fields: IFooterFields}> {
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
              {this.renderMailchimp(mailchimp)}
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
        <Row className="footer-content"
          dangerouslySetInnerHTML={{ __html: this.props.fields.html }}>
        </Row>
      </Container>
    )
  }

  private renderMailchimp(mailchimp: string) {
    return (
      <div id="mc_embed_signup">
        <form action={mailchimp} method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="form-inline" target="_blank">
          <div className="input-group">
            <input type="email" placeholder="Your Email Address" name="EMAIL" className="required form-control" id="mce-EMAIL"></input>
          </div>
          <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="btn"></input>
          <div id="mce-responses" className="clear">
            <div className="response" id="mce-error-response" style={ {display: "none"} }></div>
            <div className="response" id="mce-success-response" style={ {display: "none"} }></div>
          </div>    {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
          <div style={ {position: "absolute", left: "-5000px"} } aria-hidden="true">
            <input type="text" name="b_fbcbfba66020e12dd41b9cf1b_4a0067c925" tabIndex={-1} value=""></input>
          </div>
        </form>
      </div>
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

export const footerFields = graphql`
fragment footerFields on MarkdownRemark {
  html
  frontmatter {
    contact {
      name
      email
      phone
    }
    mailchimp
  }
}
`