module.exports = {
  siteMetadata: {
    title: 'Albania Dallas Discipleship Connection',
    disqus: 'N/A'// put your disqus ID here
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files'
        ]
      }
    },
    {
      resolve: "gatsby-plugin-typescript",
      options: {
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass'
  ]
}
