import * as React from "react";
const GithubSlugger = require(`github-slugger`)

interface IScrollspyProps {
  headings: Array<{
    value: string,
    depth: number
  }>,
}

export default class Scrollspy extends React.Component<IScrollspyProps, {}> {

  public render() {
    if (this.props.headings.length == 0) {
      return <nav className="bs-docs-sidebar affix"></nav>
    }

    const slugs = new GithubSlugger()

    const headers = []
    let lastHeader = {
      ...this.props.headings[0],
      children: []
    }
    this.props.headings.slice(1).forEach((h) => {
      if (h.depth <= 2) {
        headers.push(lastHeader)
        lastHeader = {
          ...this.props.headings[0],
          children: []
        }
      } else {
        lastHeader.children.push(h)
      }
    })
    headers.push(lastHeader)

    return (
      <nav id="scrollspy-sidebar" className="bs-docs-sidebar affix">
        <ul className="nav nav-stacked fixed">
          {headers.map((h) => {
            const slug = slugs.slug(h.value, false)
            return <li>
              <a href={'#' + slug}>{h.value}</a>
              {h.children.length > 0 &&
                <ul className="nav nav-stacked">
                  {h.children.map((child) => {
                    const childSlug = slugs.slug(child.value, false)
                    return <li>
                      <a href={'#' + childSlug}>{child.value}</a>
                    </li>
                  })}
                </ul>}
            </li>
          })}
        </ul>
      </nav>
    )
  }
}
