import * as React from 'react'
import { Row, Jumbotron, Col, Container } from 'reactstrap'

interface IHeroProps {
  image: string
  title?: string
  heroAttribution?: string
}

export default class Hero extends React.Component<IHeroProps, {}> {
  render() {
    const {title, image, heroAttribution} = this.props

    return  (<Jumbotron>
      <div className="hero-image" style={ {backgroundImage: `url('${image}')`} }>
        <Container>
          <Row className="hero-title">
            <Col cols={6}>
            {title && (<h1>{ title }</h1>)}
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
      </div>
    </Jumbotron>)
  }
}