import * as React from 'react'
import { Row, Jumbotron, Col, Container, Button } from 'reactstrap'

interface IHeroProps {
  image?: string
  title?: string
  subtitle?: string
  link?: string
  buttonText?: string
  buttonStyle?: string
  heroAttribution?: string
}

export default class Hero extends React.Component<IHeroProps, {}> {
  render() {
    const {title, image, subtitle, heroAttribution} = this.props
    const {link, buttonText, buttonStyle} = this.props

    return  (<Jumbotron className="bg-black">
      <div className="hero-image" style={ {backgroundImage: `url('${image}')`} }>
      </div>
      <Container className="hero-image__title">
        <Row className="hero-title">
          <Col cols={12} md={6} xl={5}>
            {title && (<h1>{ title }</h1>)}
            {subtitle && <p className="subtitle">{subtitle}</p>}
            {link &&
              <a className={`btn btn-${buttonStyle}`}>
                {buttonText}
              </a>}
          </Col>
        </Row>
        <Row className="hero-body">
          {this.props.children}
        </Row>
        
        {heroAttribution &&
          <footer className="blockquote-footer attribution"
            dangerouslySetInnerHTML={{ __html: heroAttribution }}>
          </footer>
        }
      </Container>
    </Jumbotron>)
  }
}