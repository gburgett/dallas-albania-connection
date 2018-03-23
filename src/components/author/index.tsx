import * as React from 'react'
import * as graphql from 'graphql'

export interface IAuthorProps {
  name: string,
  gravatar?: string,
  photo?: string
}

export class Author extends React.Component<IAuthorProps, {}> {
  render() {
    const {name, gravatar, photo} = this.props

    return (
      <div className="author-row">
      <div className="author">
        {gravatar &&
          <img src={`https://www.gravatar.com/avatar/${gravatar}`}></img>}
        <span className="name">{name}</span>
      </div>
      </div>
    )
  }
}

export default Author