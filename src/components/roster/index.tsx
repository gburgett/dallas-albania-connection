import * as React from 'react'

export interface ITeamRosterProps {
  name: string,
  goal: string | number,
  mileMarker: string | number,
  adjustment: string | number,
  members: Array<{
    name: string,
    cruId?: string,
    goal?: number | string,
    adjustment?: number | string
  }>,
  data?: ICollatedSmappData
}

export interface ICollatedSmappData {
  [designation: string]: number
}

interface IRosterMemberProps {
  name: string,
  goal: string | number,
  mileMarker: string | number,
  adjustment: number | string,
  raised: number,
  cruId?: string
}

class RosterMember extends React.Component<IRosterMemberProps, {}> {
  render() {
    const { name, mileMarker, cruId, raised } = this.props
    const goal = toInt(this.props.goal)
    const adjustment = this.props.adjustment || 0;
    const amt = toInt(adjustment) + raised;
    const prog = 100 * (amt / goal)

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

    let bgColor = "bg-secondary"
    if (cruId) { bgColor = 'bg-info' }
    if (amt >= goal) { bgColor = 'bg-success' }

    const passedMileMarker = amt >= toInt(mileMarker)

    const slider = (
      <div className="progress">
        <div className={`progress-bar progress-bar-striped progress-bar-animated ${bgColor}`}
          role="progressbar"
          style={{ width: prog + "%" }}
          aria-valuenow={amt}
          aria-valuemin={0}
          aria-valuemax={goal}>
          {passedMileMarker && <i className="fas fa-plane" style={{ marginLeft: 'auto', marginRight: '4px' }}></i>}
        </div>
      </div>
    )

    return (<div className="member">
      <span className="memberName d-none d-sm-flex">
        <span className="name">{name}</span>
        {goal && <span className="amt">
          ${amt.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })} of
          ${goal.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })}</span>}
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
    const { name, goal, adjustment, mileMarker, members, data } = this.props
    let adj = adjustment ? toInt(adjustment) : 0

    return (<div className="teamRoster">
      <h4>{name}</h4>
      <ul>
        {members && members.map(m => (<li key={m.name}>
          <RosterMember {...m}
            goal={m.goal || goal}
            adjustment={m.adjustment ? adj + toInt(m.adjustment) : adj}
            raised={data && m.cruId ? data[m.cruId] || 0 : 0}
            mileMarker={mileMarker}
            key={m.name} />
        </li>))}
      </ul>
    </div>)
  }
}

function toInt(num: number | string): number {
  if (typeof num == 'number') {
    return num;
  }
  return parseInt(num)
}