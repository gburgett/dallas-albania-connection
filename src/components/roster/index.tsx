import * as React from 'react'
import { Row, Jumbotron, Button } from 'reactstrap'
import * as graphql from 'graphql'

export interface ITeamRosterProps {
  name: string,
  goal: number,
  members: IRosterMemberProps[]
}

interface IRosterMemberProps {
  name: string,
  goal: number,
  cruId?: string
}

class RosterMember extends React.Component<IRosterMemberProps, {}> {
  render() {
    const {name, goal, cruId} = this.props

    const donateButton = (
      <a className={`donate btn btn-sm ${cruId ? "btn-info" : "btn-secondary disabled"}`}
        href={`https://give.cru.org/${cruId}`}>
        {cruId && <span><i className="fas fa-heart"></i>  Donate!</span>}
        {!cruId && <span>Donation link coming soon!</span>}
      </a>
    )
    const bgColor = cruId ? "bg-info" : "bg-secondary"
    const slider = (
      <div className="progress">
        <div className={`progress-bar progress-bar-striped progress-bar-animated ${bgColor}`}
          role="progressbar"
          style={{ width: '1%'}}
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={goal}>
          </div>
      </div>
    )

    return (<div className="member">
      <span className="memberName">
        <span className="name">{name}</span>
        <span className="amt">$0 of ${goal || "?"}</span>
        {donateButton}
      </span>
      {slider}
    </div>)
  }
}

export class TeamRoster extends React.Component<ITeamRosterProps, {}> {
  render() {
    const { name, goal, members} = this.props

    return  (<div className="teamRoster">
      <h4>{name}</h4>
      <ul>
        {members && members.map(m => (<li key={m.name}>
          <RosterMember {...m} goal={goal} key={m.name} />
        </li>))}
      </ul>
    </div>)
  }
}