import * as React from 'react'
import * as graphql from 'graphql'

export interface ITeamRosterProps {
  name: string,
  goal: string | number,
  adjustment: string | number,
  members: IRosterMemberProps[]
}

interface IRosterMemberProps {
  name: string,
  goal: string | number,
  adjustment: number | string,
  cruId?: string
}

class RosterMember extends React.Component<IRosterMemberProps, {}> {
  render() {
    const {name, goal, cruId} = this.props
    const amtRaised = 0;  //TODO
    const adjustment = this.props.adjustment || 0;
    const amt = toInt(adjustment) + amtRaised;
    const prog = 100 * (amt / toInt(goal))

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
          style={{ width: prog + "%"}}
          aria-valuenow={amt}
          aria-valuemin={0}
          aria-valuemax={toInt(goal)}>
          </div>
      </div>
    )

    return (<div className="member">
      <span className="memberName d-none d-sm-flex">
        <span className="name">{name}</span>
        {goal && <span className="amt">${amt} of ${goal || "?"}</span>}
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
    const { name, goal, adjustment, members} = this.props
    let adj = adjustment ? toInt(adjustment) : 0
    
    return  (<div className="teamRoster">
      <h4>{name}</h4>
      <ul>
        {members && members.map(m => (<li key={m.name}>
          <RosterMember {...m}
            goal={m.goal || goal}
            adjustment={m.adjustment ? adj + toInt(m.adjustment) : adj}
            key={m.name} />
        </li>))}
      </ul>
    </div>)
  }
}

function toInt(num: number | string): number {
  if(typeof num == 'number') {
    return num;
  }
  return parseInt(num)
}