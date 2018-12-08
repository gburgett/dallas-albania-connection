import * as React from 'react'
import { IEventFields } from '.'

import { Card, CardTitle, CardHeader, CardBody } from 'reactstrap'

interface IEventSummaryProps extends IEventFields {
  collapse: boolean
}

export const Summary = (props: IEventSummaryProps) => {
  const {date, title, link} = props.frontmatter

  let color="light"

  const dt = Date.parse(date)
  const tomorrow = Date.now() + (1 * 24 * 60 * 60 * 1000)
  if (dt < tomorrow) {
    color="danger"
  }

  const id = `EventSummary-${dt}`

  return <Card body outline color={color}>
            <a data-toggle="collapse" data-target={`#${id}`} aria-expanded="true" aria-controls={id}>
              <CardHeader>
                <span className="date">{date}</span>
                <h4>{title}</h4>
              </CardHeader>
            </a>
            <div id={id} className={`collapse ${props.collapse || 'show'}`}>
              <CardBody>
                {present(link) ?
                  <a href={link} dangerouslySetInnerHTML={{ __html: props.html }}>
                  </a> :
                  <span dangerouslySetInnerHTML={{ __html: props.html }}></span>
                }
              </CardBody>
            </div>
        </Card>
}

function present(str: string) {
  return str && str.length > 0
}