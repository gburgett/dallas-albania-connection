import * as React from "react";
import ReactScrollspy from 'react-scrollspy'

const GithubSlugger = require(`github-slugger`);

interface IScrollspyProps {
  headings: Array<{
    value: string,
    depth: number
  }>,
}

interface IHeader {
  value: string,
  depth: number,
  slug: string
  children?: IHeader[]
}

export default class Scrollspy extends React.Component<IScrollspyProps, {}> {

  public render() {
    if (this.props.headings.length == 0) {
      return <nav className="bs-docs-sidebar sticky-wrapper"></nav>
    }

    const slugs = new GithubSlugger()

    const headers: IHeader[] = []
    let lastHeader = {
      ...this.props.headings[0],
      slug: slugs.slug(this.props.headings[0].value, false),
      children: []
    }
    this.props.headings.slice(1).forEach((h) => {
      if (h.depth <= 2) {
        headers.push(lastHeader)
        lastHeader = {
          ...h,
          slug: slugs.slug(h.value, false),
          children: []
        }
      } else {
        lastHeader.children.push({
          ...h,
          slug: slugs.slug(h.value, false),
        })
      }
    })
    headers.push(lastHeader)

    const headerSlugs = []
    headers.forEach((h) => {
      headerSlugs.push(h.slug)
      h.children && h.children.forEach(h3 => headerSlugs.push(h3.slug))
    })

    let firstHeader = headers[0] && headers[0].value
    return (
      <nav id="scrollspy-sidebar" className="bs-docs-sidebar sticky-wrapper">
        <ReactScrollspy items={headerSlugs} currentClassName={'active'} className="nav nav-stacked sticky"
          onUpdate={this.onUpdate}>
          {headers.map((h) => {
            return <li className={firstHeader == h.value ? 'active' : undefined} key={h.slug}>
              <a href={'#' + h.slug}>{h.value}</a>
              {h.children.length > 0 &&
                <ul className="nav nav-stacked">
                  {h.children.map((child) => {
                    return <li key={child.slug}>
                      <a href={'#' + child.slug} data-parent={h.slug}>{child.value}</a>
                    </li>
                  })}
                </ul>}
            </li>
          })}
        </ReactScrollspy>
      </nav>
    )
  }

  private onUpdate = (elem: any) => {
    if (!elem) { return  }
    const headerId = elem.id
    let $anchor = $(`#scrollspy-sidebar`).find(`a[href=\\#${headerId}]`)
    $anchor.parent('li').addClass('active')
    $anchor.parent('li').siblings('li').removeClass('active')

    let parent = $anchor.data('parent')
    while (parent) {
      $anchor = $(`#scrollspy-sidebar`).find(`a[href=\\#${parent}]`)
      $anchor.parent('li').addClass('active')
      parent = $anchor.data('parent')
    }
  }
}
