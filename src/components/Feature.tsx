import * as React from 'react'
import { Row, Col, Button, Container } from 'reactstrap'

export interface IFeatureProps {
  title?: string
  image?: string
  link: string
  buttonText: string
  buttonStyle?: string
  backgroundColor?: string
}

export default class Feature extends React.Component<IFeatureProps, {}> {
  render() {
    const {title, image, link, buttonText, backgroundColor} = this.props;

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
            <Col md={present(image) ? 6 : 12} className={`d-none d-md-flex`}>
              <a className={`btn ${buttonStyle}`} href={link}
                dangerouslySetInnerHTML={{ __html: buttonText }}></a>
            </Col>
          </Row>
        </Container>
      </div>)
    }

    return (<Row className="feature feature-sm">
      <Col className='d-none d-md-block col-md-6' />
      <Col className='col-12 col-md-6'  style={ style }>
        <div className="bgimg" style={ { backgroundImage: present(image) && `url('${image}')` }}>
          {title && <h2 className="d-none d-md-block">{title}</h2>}
          <a className={`btn ${buttonStyle}`} href={link}
            dangerouslySetInnerHTML={{ __html: buttonText }}></a>
        </div>
      </Col>
    </Row>)
  }
}

function present(str) {
  return str && str.length > 0
}