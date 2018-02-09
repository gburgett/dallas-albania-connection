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
      <Col sm={6}>
        <div className="bgimg" style={ { backgroundImage: image && `url('${image}')` }}>
          <h2>{title}</h2>
        </div>
      </Col>
      <Col sm={6}>
        <Button color="success" href={link}>{buttonText}</Button>
      </Col>
    </Row>)
  }
}