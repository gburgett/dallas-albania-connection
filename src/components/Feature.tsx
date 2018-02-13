import * as React from 'react'
import { Row, Col, Button } from 'reactstrap'

interface IFeatureProps {
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

    const style = {} as any
    if (present(backgroundColor)) {
      style.backgroundColor = backgroundColor
    }

    const buttonStyle = present(this.props.buttonStyle) ?
      ('btn-' + this.props.buttonStyle).replace(/^btn\-btn\-/, 'btn-') :
      'btn-success'

    if (present(image)) {
      return  (<Row className="feature" style={ style }>
        <Col className='col-12 col-md-6'>
          <div className="bgimg" style={ { backgroundImage: present(image) && `url('${image}')` }}>
            {present(title) && <h2 className="d-none d-md-block">{title}</h2>}

            <a className={`d-block d-md-none btn ${buttonStyle}`} href={link}>{present(title) ? title : buttonText}</a>
          </div>
        </Col>
        <Col className={`d-none d-md-block ${present(image) ? 'col-md-6' : 'col-md-12'}`}>
          <a className={`btn ${buttonStyle}`} href={link}>{buttonText}</a>
        </Col>
      </Row>)
    }

    return (<Row className="feature feature-sm">
      <Col className='d-none d-md-block col-md-6' />
      <Col className='col-12 col-md-6'  style={ style }>
        <div className="bgimg" style={ { backgroundImage: present(image) && `url('${image}')` }}>
          {title && <h2 className="d-none d-md-block">{title}</h2>}
          <a className={`btn ${buttonStyle}`} href={link}>{buttonText}</a>
        </div>
      </Col>
    </Row>)
  }
}

function present(str) {
  return str && str.length > 0
}