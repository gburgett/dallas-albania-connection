import * as React from 'react'

export interface IAuthorProps {
  name: string,
  gravatar?: string,
  photo?: string
}

export class Author extends React.Component<IAuthorProps, {}> {
  render() {
    const {name, gravatar, photo} = this.props

    return (
      <div className="author">
        {photo &&
          <img src={photo}></img>}
        {!photo && gravatar &&
          <img src={`https://www.gravatar.com/avatar/${gravatar}`}></img>}
        <span className="name">{name}</span>
      </div>
    )
  }
}

export default Author