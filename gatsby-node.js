const fs = require('fs').promises
const path = require('path')
const prettier = require('prettier')
const glob = require('tiny-glob')
const pLimit = require('p-limit')

const extParsers = {
  js: 'babel',
  html: 'html',
  css: 'css',
}

exports.onPreInit = (_, opts) => {
  return new Promise((resolve, reject) => {
    for (const type of opts.types) {
      if (!extParsers[type])
        return reject(
          `gatsby-plugin-prettier-build doesn't support '${type}' files\n` +
            `raise an issue? https://github.com/jmsv/gatsby-plugin-prettier-build/issues/new`
        )
    }

    return resolve()
  })
}

exports.onPostBuild = async (_, opts) => {
  const fileTypesToFormat = opts.types || ['html']
  const verbose = opts.verbose !== false

  const [prettierOpts, files] = await Promise.all([
    prettier.resolveConfig(process.cwd()),
    glob(`public/**/*.{${fileTypesToFormat.join(',')}}`),
  ])

  const limit = pLimit(opts.concurrency || 20)

  return Promise.all(
    files.map((filePath) =>
      limit(() =>
        prettifyFile(filePath, prettierOpts).then(() => {
          if (verbose) console.log('✔ prettified', filePath)
        })
      )
    )
  ).then(() => {
    if (verbose) {
      console.log(
        `✨ finished prettifying ${files.length} Gatsby build file${
          files.length ? 's' : ''
        }`
      )
    }
  })
}

const prettifyFile = async (filePath, prettierOpts) => {
  // Don't attempt format if not a file
  if (!(await fs.lstat(filePath)).isFile()) return

  const parser = extParsers[path.extname(filePath).slice(1)]

  const fileBuffer = await fs.readFile(filePath)

  const formatted = prettier.format(
    fileBuffer.toString(),
    Object.assign({ parser }, prettierOpts)
  )

  await fs.writeFile(filePath, formatted)
}
