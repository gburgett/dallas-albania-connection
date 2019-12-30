import { SetFieldsOnGraphQLNodeTypeArgs } from 'gatsby';
import { FileNode } from 'gatsby-source-filesystem';

declare module 'gatsby-transformer-remark' {
  export interface MarkdownNode {
    id: string,
    children: string[],
    parent: string,
    internal: {
      content: string,
      type: 'MarkdownRemark',
      contentDigest: string,
      owner: 'gatsby-transformer-remark'
    },
    frontmatter: {
      [key: string]: any
    },
    excerpt: string,
    rawMarkdownBody: string
  }

  /**
   * Represents the shape of `module.exports` for a `gatsby-transformer-remark`
   * plugin.  Example:
   * 
   * ```ts
   * // my-plugin/index.ts
   * const plugin: Plugin = ...
   * module.exports = plugin
   * ```
   * 
   * ```js
   * // gatsby-config.js
   * {
   *   resolve: `gatsby-transformer-remark`,
   *   options: {
   *     plugins: ['my-plugin'],
   *   }
   * }
   * ```
   * 
   * Can be a function, or have the properties defined on PluginExports, or both.
   */
  export type Plugin = PluginExports | PluginFn

  export type PluginExports = {
    /**
     * Add a set of Unifiedjs plugins to the markdown processor.
     * https://github.com/unifiedjs/unified#processoruseplugin-options
     */
    setParserPlugins?: SetParserPlugins,
    /**
     * Allows changing the source GraphQL node before the Markdown AST is generated.
     */
    mutateSource?: MutateSource
  }

  /**
   * Executed after the markdown AST is parsed and allows modifying the AST
   * before it is converted to HTML.
   */
  export type PluginFn = ((args: PluginFnArgs, options: any) => void | Promise<void>) & PluginExports

  export type PluginFnArgs = {
    markdownAST: MarkdownAST,
    markdownNode: MarkdownNode,
    files: FileNode[],
  } & Omit<SetFieldsOnGraphQLNodeTypeArgs, 'type' | 'getNodesByType'>

  export type MutateSource =
    (args: MutateSourceArgs, pluginOptions: any) => void | Promise<void>

  export type MutateSourceArgs = {
    markdownNode: MarkdownNode,
    files: FileNode[],
  } & Omit<SetFieldsOnGraphQLNodeTypeArgs, 'type' | 'pathPrefix' | 'getNodesByType'>

  export type SetParserPlugins =
    (args: any, pluginOptions: any) => 
      Iterable<UnifiedAttacher | [UnifiedAttacher, any]>

  /** https://github.com/unifiedjs/unified#function-attacheroptions */
  type UnifiedAttacher = (options: any) => UnifiedTransformer

  /** https://github.com/unifiedjs/unified#function-transformernode-file-next */
  type UnifiedTransformer = 
    (
      (
        node: Node,
        file: VFile,
      ) => Error | Node | Promise<Node | void> | void
    ) | (
      (
        node: Node,
        file: VFile,
        next: (err?: Error, node?: Node, file?: VFile) => void
      ) => void
    )
  /** https://github.com/vfile/vfile */
  type VFile = any
  /** Not sure yet? */
  type Node = any

  /**
   * https://github.com/syntax-tree/mdast
   */
  export interface MarkdownAST {
    type: 'root',
    children: MDAST.Node[]
    position: {
      // note: this is NOT an instance of AST.Position
      start: { line: number, column: number, offset: number }
      end: { line: number, column: number, offset: number }
    }
  }

  type Omit<T, K extends keyof T> = { [key in Exclude<keyof T, K>]: T[key] }

  /**
   * Markdown Abstract Syntax Tree namespace
   * https://github.com/syntax-tree/mdast
   */
  namespace MDAST {
    export type NodeMap = {
      heading: HeadingNode,
      list: ListNode,
      listItem: ListItemNode,
      text: TextNode,
      link: LinkNode,
      image: ImageNode,
      paragraph: ParagraphNode,
      blockquote: BlockquoteNode,
      html: HTMLNode,
      table: TableNode,
      tableRow: TableRowNode,
      tableCell: TableCellNode
    }

    export type NodeType = keyof NodeMap
    export type Node = NodeMap[keyof NodeMap]

    interface NodeBase {
      children?: MDAST.Node[],
      position?: Position,
      data?: {
        /** HTML properties like "class" */
        hProperties?: {
          [key: string]: string
        }
        /** override HTML element name */
        hName?: string
        /** override HTML children */
        hChildren?: HAST.Node[]
      }
    }

    export interface HeadingNode extends NodeBase {
      type: 'heading'
      /** H1 => 1, H2 => 2 etc. */
      depth: number
    }

    /** Represents a <ul> or <ol> */
    export interface ListNode extends NodeBase {
      type: 'list',
      /** <ul>: false, <ol>: true */
      ordered: boolean,
      loose: boolean,
      /** only applicable to ordered lists */
      start: number | null
    }

    /** represents a <li> */
    export interface ListItemNode extends NodeBase {
      type: 'listItem'
      loose: boolean
      checked: any | null
    }

    export interface TextNode extends NodeBase {
      type: 'text'
      value: string
    }

    export interface LinkNode extends NodeBase {
      type: 'link'
      title: string | null
      url: string
    }

    export interface ImageNode extends NodeBase {
      type: 'image',
      title: null,
      url: string,
      alt: string,
    }

    export interface ParagraphNode extends NodeBase {
      type: 'paragraph'
    }

    export interface BlockquoteNode extends NodeBase {
      type: 'blockquote'
    }

    export interface HTMLNode extends NodeBase {
      type: 'html'
      value: string
    }

    export interface TableNode extends NodeBase {
      type: 'table'
      align: any[]
    }

    export interface TableRowNode extends NodeBase {
      type: 'tableRow'
    }

    export interface TableCellNode extends NodeBase {
      type: 'tableCell'
    }

    export interface Position {
      start: { line: number, column: number, offset: number }
      end: { line: number, column: number, offset: number }
      indent: number[]
    }
  }

  /**
   * HTML Abstract Syntax Tree namespace
   * https://github.com/syntax-tree/hast
   */
  namespace HAST {
    /** TODO */
    type Node = any
  }
}
