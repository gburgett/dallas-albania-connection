import * as React from 'react'
import { Jumbotron, Button } from 'reactstrap'
import * as graphql from 'graphql'



interface IHeroProps {
  image: string
  title: string
}

interface IHeroQueryResult {
  edges: [{
    node: {
      frontmatter: {
        image: string
        title: string
      }
    }
  }]
}

export default class Hero extends React.Component<IHeroProps | IHeroQueryResult, {}> {
  render() {
    let props: IHeroProps
    if (isQueryResult(this.props)) {
      props = this.props.edges[0].node.frontmatter
    } else {
      props = this.props
    }

    console.log('image:', props.image)
    return  (<Jumbotron style={ {'background-image': `url('${props.image}')`} }>
      <div className="hero-title">
        <h1>{ props.title }</h1>
      </div>
    </Jumbotron>)
  }
}

function isQueryResult(props): props is IHeroQueryResult {
  return 'edges' in props
}