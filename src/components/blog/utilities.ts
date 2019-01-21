
interface IArticle {
  frontmatter: {
    contentType: 'article',
    date: string
  }
}

interface IBlog {
  frontmatter: {
    contentType: 'blog',
    date: string,
    published?: boolean
  }
}

export function mergeBlogsAndArticles<A extends IArticle, B extends IBlog>(articles: {
  edges: {
    node: A
  }[]
},
blogs: {
  edges: {
    node: B
  }[]
}): Array<A | B> {
  let postsAndArticles: Array<A | B> = articles.edges.map((e) => e.node)
  postsAndArticles = postsAndArticles.concat(blogs.edges.map((e) => e.node))
  postsAndArticles.sort(byDate).reverse()

  postsAndArticles = postsAndArticles.filter(({ frontmatter }) => {
    const dt = parseISOLocal(frontmatter.date).getTime()
    if (frontmatter.contentType == 'blog' && frontmatter.published === false) {
      return false
    }
    return dt <= Date.now()
  })

  return postsAndArticles
}

function byDate(a: { frontmatter: { date: string }}, b: { frontmatter: { date: string }}): number {
  const dtA = Date.parse(a.frontmatter.date)
  const dtB = Date.parse(b.frontmatter.date)
  return dtA - dtB
}

export function formatLocalDate(date: string | Date) {
  if (!date) {
    return
  }
  if (typeof date == 'string') {
    return parseISOLocal(date).toLocaleDateString('en-US',
      { year: 'numeric', month: 'long', day: 'numeric' })
  } else {
    return date.toLocaleDateString()
  }
}

/*  @param {string} s - an ISO 8001 format date and time string
**                      with all components, e.g. 2015-11-24T19:40:00
**  @returns {Date} - Date instance from parsing the string. May be NaN.
*/
// https://stackoverflow.com/a/33909265/2192243
export function parseISOLocal(s: string | Date) {
  let dt: Date
  if (typeof s == 'string') {
    dt = new Date(Date.parse(s))
  } else {
    dt = s
  }

  // adjust the date because all of them are in the US central time zone
  dt = new Date(dt.getTime() + 6 * 60 * 60 * 1000);

  return dt
}

export function parseUrl(strUrl: string) {
  if (typeof URL !== 'undefined') {
    return new URL(strUrl)
  }
  const nodeUrl = require('url')
  return new nodeUrl.URL(strUrl)
}
