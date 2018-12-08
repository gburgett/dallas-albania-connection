

export interface IEventFields {
  excerpt?: string,
  html?: string,
  frontmatter: {
    contentType: 'event',
    title: string,
    date: string
    link?: string
  }
}