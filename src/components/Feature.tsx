import * as React from 'react'
import { Row, Col, Container } from 'reactstrap'
import { Mailchimp } from './mailchimp';

export interface IFeatureProps {
  title?: string
  subtitle?: string
  image?: string
  link: string
  buttonText: string
  buttonStyle?: string
  backgroundColor?: string
}

export default class Feature extends React.Component<IFeatureProps, {}> {
  render() {
    const {title, subtitle, image, link, buttonStyle, buttonText, backgroundColor} = this.props;

    if (present(image)) {
      return  (<div className={`feature bg-${backgroundColor}`}>
        <Container>
          <Row>
            <Col md={6}>
              <div className="bgimg" style={ { backgroundImage: present(image) && `url('${image}')` }}>
              {present(title) && <h2 className="d-none d-md-block">{title}</h2>}

              <FeatureButton buttonStyle={buttonStyle} link={link} title={title} buttonText={buttonText} />
            </div>
            </Col>
            <Col md={6} className={`d-none d-md-flex justify-content-center`}>
              <a className={`btn ${buttonStyle}`} href={link}
                dangerouslySetInnerHTML={{ __html: buttonText }}></a>
            </Col>
          </Row>
        </Container>
      </div>)
    }

    return (<div className={`feature bg-${backgroundColor}`}>
        <Container>
          <Row>
          <Col col={12} md={6}>
            {present(title) && <h2 className="">{title}</h2>}
            {present(subtitle) && <p className="subtitle"
              dangerouslySetInnerHTML={{__html: subtitle}}></p>}
          </Col>
          <Col col={12} md={6}>
            <FeatureButton buttonStyle={buttonStyle} link={link} title={title} buttonText={buttonText} />
          </Col>
          </Row>
        </Container>
      </div>)
  }
}

function FeatureButton({
  buttonStyle,
  link,
  title,
  buttonText
}: {
  buttonStyle: string,
  link: string,
  title?: string,
  buttonText: string
}) {

  console.log('style', buttonStyle)
  if (buttonStyle == 'mailchimp') {
    return <Mailchimp mailchimp={link} />
  }

  const btn = present(buttonStyle) ?
    ('btn-' + this.props.buttonStyle).replace(/^btn\-btn\-/, 'btn-') :
    'btn-success'

  return <a className={`d-block d-md-none btn ${btn}`} href={link}
  dangerouslySetInnerHTML={{ __html: present(title) ? title : buttonText }}></a>
}

function present(str) {
  return str && str.length > 0
}