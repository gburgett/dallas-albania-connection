
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
    const dt = Date.parse(frontmatter.date)
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