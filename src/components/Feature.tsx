import * as React from 'react'
import { Row, Col, Button } from 'reactstrap'

interface IFeatureProps {
  title: string
  image?: string
  link: string
  buttonText: string
}

export default class Feature extends React.Component<IFeatureProps, {}> {
  render() {
    const {title, image, link, buttonText} = this.props;

    return  (<Row className="feature">
      <Col className='col-12 col-md-6'>
        <div className="bgimg" style={ { backgroundImage: image && `url('${image}')` }}>
          <h2 className="d-none d-md-block">{title}</h2>
          <Button color="success" className='d-block d-md-none' href={link}>{title}</Button>
        </div>
      </Col>
      <Col className='d-none d-md-block col-md-6'>
        <Button color="success" href={link}>{buttonText}</Button>
      </Col>
    </Row>)
  }
}