
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
    return parseISOLocal(date).toLocaleDateString()
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
  if (typeof s == 'string') {
    return new Date(Date.parse(s))
  }
  return s
}