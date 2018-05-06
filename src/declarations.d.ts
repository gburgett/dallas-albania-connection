declare const graphql: (query: TemplateStringsArray) => void

interface IPageContext<Data> {
  location?: {
    pathname: string,
    search?: string,
    hash?: string
  },
  history?: {
    createHref: Function,
    action: string,
    location: {
      pathname: string,
      search: string,
      hash: string
    },
    push: Function,
    replace: Function,
    go: Function,
    goBack: Function,
    goForward: Function,
    listen: Function,
    block: Function
  },
  staticContext?: any,
  data?: Data,
  children?: () => JSX.Element
}

interface ISite {
  siteMetadata: {
    title: string
    siteUrl: string
    signupFormUrl: string
  }
}

interface Window {
  netlifyIdentity: INetlifyIdentity
}

interface INetlifyIdentity {
  currentUser: () => any
}