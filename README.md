# gatsby-plugin-prettier-build

prettify gatsby build output

## Why?

[![wesbos-tweet](https://user-images.githubusercontent.com/14852491/78827410-02ccdb00-79db-11ea-9369-74c0ada99cf4.png)](https://twitter.com/wesbos/status/1247903517051768839)

## Usage

In `gatsby-config.js` plugins array:

```js
{
  resolve: `gatsby-plugin-prettier-build`,
  options: {
    types: ['html'] // default value
  }
}
```

To stick to default options (see defaults below) just add `'gatsby-plugin-prettier-build'` to the `plugins` array.

### Options

#### `types`

> default: `['html']`

Array of filetypes to be prettified after build. Currently supports:

- `js`
- `html`
- `css`

#### `verbose`

> default: `true`

Whether or not to log progress to the console
