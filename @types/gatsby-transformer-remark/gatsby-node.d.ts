import { SetFieldsOnGraphQLNodeType, OnCreateNode } from 'gatsby'

declare module 'gatsby-transformer-remark/gatsby-node' {
 export const setFieldsOnGraphQLNodeType: SetFieldsOnGraphQLNodeType
 export const onCreateNode: OnCreateNode
}