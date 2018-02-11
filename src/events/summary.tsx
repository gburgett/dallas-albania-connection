import * as React from 'react'
import { IEventFields } from '.'

import { Card, CardTitle, CardHeader, CardBody } from 'reactstrap'


export const Summary = (props: IEventFields) => {
  const {date, title, link} = props.frontmatter
  console.log(props.frontmatter)

  let color="light"

  const dt = Date.parse(date)
  const tomorrow = Date.now() + (1 * 24 * 60 * 60 * 1000)
  if (dt < tomorrow) {
    color="danger"
  }

  return <Card body outline color={color}>
          <a href={link}>
            <CardHeader>
              {date}
            </CardHeader>
            <CardBody>
              <h4>{title}</h4>
              {props.excerpt}
            </CardBody>
          </a>
        </Card>
}
