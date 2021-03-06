const {getOptions} = require('loader-utils')
const mdx = require('@mdx-js/mdx')

module.exports = async function(content) {
  const callback = this.async()
  const options = Object.assign({}, getOptions(this), {
    filepath: this.resourcePath
  })
  let result

  try {
    result = await mdx(content, options)
  } catch (err) {
    return callback(err)
  }

  const code = `/* @jsx mdx */
  import { dom } from 'isomorphic-jsx';
  import { mdx } from '@mdx-js/isomorphic-jsx';
  ${result}
  `

  return callback(null, code)
}
