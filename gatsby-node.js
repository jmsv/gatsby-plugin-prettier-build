const prettier = require('prettier')
const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { extname } = require('path')

// TODO: Validate config on pre init

const extParsers = {
  js: 'babel',
  html: 'html',
  css: 'css',
}

const getFilePathsToFormat = (types) => {
  if (!types.length) return Promise.resolve([])

  const globPattern = `public/**/*.${
    types.length === 1 ? types[0] : `{${types.join(',')}}`
  }`

  return new Promise((resolve, reject) =>
    glob(globPattern, {}, (err, files) => {
      if (err) return reject(err)
      return resolve(files)
    })
  )
}

exports.onPostBuild = (_, opts) => {
  const fileTypesToFormat = opts.types || ['html']
  const verbose = opts.verbose !== false

  return Promise.all([
    prettier.resolveConfig(process.cwd()),
    getFilePathsToFormat(fileTypesToFormat),
  ]).then(([prettierOpts, files]) => {
    for (const filePath of files) {
      // TODO: Check isn't directory instead of below line
      if (filePath.includes('page-data')) break

      const fileType = extname(filePath).slice(1)
      const parser = extParsers[fileType]

      if (!parser)
        return reject(
          `gatsby-plugin-prettier-build doesn't support ${fileType} files yet`
        )

      const contents = readFileSync(filePath).toString()

      // TODO: `prettier.check` before format
      const formatted = prettier.format(
        contents,
        Object.assign({ parser }, prettierOpts)
      )

      writeFileSync(filePath, formatted)

      if (verbose) console.log('✔ prettified', filePath)
    }

    if (verbose)
      console.log(
        `✨ finished prettifying ${files.length} Gatsby output file${
          files.length ? 's' : ''
        }`
      )
  })
}
