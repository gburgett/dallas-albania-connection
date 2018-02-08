import * as React from 'react'
import { Jumbotron, Button } from 'reactstrap'
import * as graphql from 'graphql'



interface IHeroProps {
  image: string
  title: string
  html: string
}

interface IHeroQueryResult {
  edges: [{
    node: {
      html: string,
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
      const { html, frontmatter } = this.props.edges[0].node
      props = { ...frontmatter, html: html }
    } else {
      props = this.props
    }

    const body = props.html && props.html.length > 0 ?
      (<div
        dangerouslySetInnerHTML={{ __html: props.html }}
        >
      </div>) : undefined

    return  (<Jumbotron style={ {backgroundImage: `url('${props.image}')`} }>
      <div className="hero-title">
        <h1>{ props.title }</h1>
        {body}
      </div>
    </Jumbotron>)
  }
}

function isQueryResult(props): props is IHeroQueryResult {
  return 'edges' in props
}