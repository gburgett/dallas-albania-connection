import * as React from 'react'
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
        {cruId && <span><i className="fas fa-gift"></i>  Donate!</span>}
        {!cruId && <span>Donation link coming soon!</span>}
      </a>
    )
    const xsDonateButton = (
      <a className={`donate btn btn-sm ${cruId ? "btn-info" : "btn-secondary disabled"}`}
        href={`https://give.cru.org/${cruId}`}
        style={{ width: '100%' }}>
        <span>{cruId && <i className="fas fa-gift"></i>} {name} #{cruId}</span>
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
      <span className="memberName d-none d-sm-flex">
        <span className="name">{name}</span>
        <span className="amt">$0 of ${goal || "?"}</span>
        {cruId && <span className="cruId">{cruId}</span>}
        {donateButton}
      </span>
      <span className="memberName d-block d-sm-none">
        {xsDonateButton}
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
          <RosterMember {...m} goal={m.goal || goal} key={m.name} />
        </li>))}
      </ul>
    </div>)
  }
}
