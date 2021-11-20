import * as React from 'react'
import Img, { GatsbyImageProps } from "gatsby-image"
import { Row, Jumbotron, Col, Container, Button } from 'reactstrap'

interface IHeroProps {
  image?: string | GatsbyImageProps
  title?: string
  subtitle?: string
  link?: string
  buttonText?: string
  buttonStyle?: string
  heroAttribution?: string
  /** Darken the hero image background */
  darken?: boolean
}

export default class Hero extends React.Component<IHeroProps, {}> {
  render() {
    const {title, image, darken, subtitle, heroAttribution} = this.props
    const {link, buttonText, buttonStyle} = this.props

    const imgComponent = !image ? undefined : 
      typeof(image) == 'string' ?
        (<img src={image} className=""></img>) :
        (<Img {...image} className="" />)

    return <Jumbotron className="bg-black">
      <div className={`hero-image ${darken && 'dark'}`} style={ {backgroundImage: `url('${image}')`} }>
        {imgComponent}
      </div>
      <Container className="hero-image__title">
        <Row className="hero-title">
          <Col cols={12} md={6} xl={5}>
            {title && (<h1>{ title }</h1>)}
            {subtitle && <p className="subtitle">{subtitle}</p>}
            {link &&
              <a className={`btn btn-${buttonStyle}`} href={link}>
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
    </Jumbotron>
  }
}