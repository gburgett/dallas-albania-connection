import * as React from 'react'
import { Row, Jumbotron, Button } from 'reactstrap'
import * as graphql from 'graphql'



interface IHeroProps {
  image: string
  title?: string
  html?: string
}

interface IHeroNode {
  html: string,
  frontmatter: {
    image: string
    title: string
  }
}

export default class Hero extends React.Component<IHeroProps | IHeroNode, {}> {
  render() {
    let props: IHeroProps
    if (isQueryResult(this.props)) {
      const { html, frontmatter } = this.props
      props = { ...frontmatter, html: html }
    } else {
      props = this.props
    }

    const title = props.title && (<h1>{ props.title }</h1>)

    const body = props.html && props.html.length > 0 &&
      (<div
        dangerouslySetInnerHTML={{ __html: props.html }}
        >
      </div>)

    return  (<Jumbotron>
      <div className="hero-image" style={ {backgroundImage: `url('${props.image}')`} }>
        <div className="hero-title">
          {title}
          {body}
        </div>
      </div>
    </Jumbotron>)
  }
}

function isQueryResult(props): props is IHeroNode {
  return 'frontmatter' in props
}