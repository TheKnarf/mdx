const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')

const testFixture = (fixture, _options = {}) => {
  const fileName = `./${fixture}`;

  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js'
    },
    node: {
      fs: 'empty'
    },
    module: {
      rules: [
        {
          test: /\.mdx?$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: path.resolve(__dirname, '..')
            }
          ]
        }
      ]
    }
  });

  compiler.outputFileSystem = new MemoryFs()

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)

      const module = stats
        .toJson()
        .modules.find(m => m.name.startsWith(fileName)).source

      resolve(module)
    })
  })
}

test('it loads markdown and returns a component', async () => {
  await testFixture('fixture.md')
}, 10000)
