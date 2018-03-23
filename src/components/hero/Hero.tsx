import * as React from 'react'
import { Row, Jumbotron, Button } from 'reactstrap'
import * as graphql from 'graphql'



interface IHeroProps {
  image: string
  title?: string
  subtitle?: string
  heroAttribution?: string
}

export default class Hero extends React.Component<IHeroProps, {}> {
  render() {
    const {title, subtitle, image, heroAttribution} = this.props

    const sub = subtitle && subtitle.length > 0 &&
      (<div className='d-none d-md-block subtitle'>
        <p>{subtitle}</p>
      </div>)

    return  (<Jumbotron>
      <div className="hero-image" style={ {backgroundImage: `url('${image}')`} }>
        <div className="hero-title">
          {title && (<h1>{ title }</h1>)}
          {sub}
        </div>
        <div className="hero-body">
          {this.props.children}
          {heroAttribution &&
            <footer className="blockquote-footer">{heroAttribution}</footer>
          }
        </div>
      </div>
    </Jumbotron>)
  }
}