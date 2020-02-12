import * as React from 'react'
import { Row, Col, Container } from 'reactstrap'

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
    const {title, subtitle, image, link, buttonText, backgroundColor} = this.props;

    const buttonStyle = present(this.props.buttonStyle) ?
      ('btn-' + this.props.buttonStyle).replace(/^btn\-btn\-/, 'btn-') :
      'btn-success'

    if (present(image)) {
      return  (<div className={`feature bg-${backgroundColor}`}>
        <Container>
          <Row>
            <Col md={6}>
              <div className="bgimg" style={ { backgroundImage: present(image) && `url('${image}')` }}>
              {present(title) && <h2 className="d-none d-md-block">{title}</h2>}

              <a className={`d-block d-md-none btn ${buttonStyle}`} href={link}
                dangerouslySetInnerHTML={{ __html: present(title) ? title : buttonText }}></a>
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
            <a className={`btn ${buttonStyle}`} href={link}
              dangerouslySetInnerHTML={{ __html: buttonText }}></a>
          </Col>
          </Row>
        </Container>
      </div>)
  }
}

function present(str) {
  return str && str.length > 0
}