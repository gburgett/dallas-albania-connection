import * as React from 'react'
import { Row, Jumbotron, Button } from 'reactstrap'
import * as graphql from 'graphql'



interface IHeroProps {
  image: string
  title?: string
  subtitle?: string
}

export default class Hero extends React.Component<IHeroProps, {}> {
  render() {
    const {title, subtitle, image} = this.props

    const body = subtitle && subtitle.length > 0 &&
      (<div className='d-none d-md-block'>
        <p>{subtitle}</p>
      </div>)

    return  (<Jumbotron>
      <div className="hero-image" style={ {backgroundImage: `url('${image}')`} }>
        <div className="hero-title">
          {title && (<h1>{ title }</h1>)}
          {body}
        </div>
      </div>
    </Jumbotron>)
  }
}

function isQueryResult(props): props is IHeroNode {
  return 'frontmatter' in props
}