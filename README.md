# gatsby-plugin-prettier-build

prettify gatsby build output

[![npm version](https://badge.fury.io/js/gatsby-plugin-prettier-build.svg)](https://badge.fury.io/js/gatsby-plugin-prettier-build)

## Why?

[![wesbos-tweet](https://user-images.githubusercontent.com/14852491/78827410-02ccdb00-79db-11ea-9369-74c0ada99cf4.png)](https://twitter.com/wesbos/status/1247903517051768839)

## Install

```bash
npm install --save gatsby-plugin-prettier-build
# or
yarn add gatsby-plugin-prettier-build
```

## Usage

In `gatsby-config.js` plugins array:

To stick to default options (see defaults below) add `'gatsby-plugin-prettier-build'`.

Or to provide custom options:

```js
{
  resolve: `gatsby-plugin-prettier-build`,
  options: {
    // default values
    types: ['html'],
    concurrency: 20,
    verbose: true
  }
}
```

### Options

#### `types`

> default: `['html']`

Array of filetypes to be prettified after build. Currently supports:

- `js`
- `html`
- `css`

For example, to prettify all supported types: `['html', 'js', 'css']`

#### `verbose`

> default: `true`

Whether or not to log progress to the console

#### `concurrency`

> default: `20`

How many files to prettify at once

## Changelog

#### `0.4.1`

- Docs fix

#### `0.4.0`

- Limit prettify concurrency with new `concurrency` option (defaults to `20`)
- Fix issue with counting number of prettified files

#### `0.3.0`

- Prettify files asynchronously with `Promise.all`

#### `0.2.0`

- Replace `glob` with `tiny-glob` (smaller and faster)
- Validate options on `onPreInit` to avoid hitting config problems post-build (saves time if there's a predictable problem)
- `fs.stat` filepaths to make sure they're files - avoids trying to read directories (`page-data` etc.) as files

#### `0.1.0`

Initial version
