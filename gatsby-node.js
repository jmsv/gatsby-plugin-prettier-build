const prettier = require('prettier')
const glob = require('tiny-glob')
const { readFileSync, writeFileSync, statSync } = require('fs')
const { extname } = require('path')

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

  for (const filePath of files) {
    if (!statSync(filePath).isFile()) continue

    const parser = extParsers[extname(filePath).slice(1)]

    const formatted = prettier.format(
      readFileSync(filePath).toString(),
      Object.assign({ parser }, prettierOpts)
    )

    writeFileSync(filePath, formatted)

    if (verbose) console.log('✔ prettified', filePath)
  }

  if (verbose) {
    console.log(
      `✨ finished prettifying ${files.length} Gatsby build file${
        files.length ? 's' : ''
      }`
    )
  }
}
