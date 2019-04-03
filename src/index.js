const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')
const readFile = util.promisify(fs.readFile)
const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)
const writeFile = util.promisify(fs.writeFile)

const rimraf = require('rimraf')
const { gzip } = require('node-gzip')
const CleanCSS = require('clean-css')
const Table = require('cli-table')

const clearOutput = () => rimraf('./output/*', error => error && console.error(error))

const split = file => file.split(/\.(?=[^\.]+$)/)

const convertToKB = bytes => (bytes / 1024).toFixed(1) + 'K'

const build = async (config, output, css) => {
  await exec(`npx tailwind build ${css} -c ${config} -o ${output}`)
}

const minify = async (directory, file) => {
  const [filename, extension] = split(file)
  const css = await readFile(directory + file)

  const { styles } = new CleanCSS().minify(css.toString())

  await writeFile(`${directory + filename}.min.${extension}`, styles)
}

const compress = async path => {
  const file = await readFile(path)
  const compressed = await gzip(file.toString())
  await writeFile(`${path}.gzip`, compressed)
}

const measure = async (outputDirectory, filename) => {
  const { size: original } = await stat(`${outputDirectory + filename}.css`)
  const { size: minified } = await stat(`${outputDirectory + filename}.min.css`)
  const { size: gzipped } = await stat(`${outputDirectory + filename}.min.css.gzip`)
  return {
    original: convertToKB(original),
    minified: convertToKB(minified),
    gzipped: convertToKB(gzipped)
  }
}

const display = data => {
  const table = new Table({ head: ['Config', 'Original', 'Minified', 'Gzipped'] })
  table.push(...data)
  console.info(table.toString())
}

module.exports = async (configDirectory, cssPath) => {
  clearOutput()
  const configs = await readdir(configDirectory)

  console.info('Calculating...')
  const data = await Promise.all(configs.map(async config => {
    const [filename, extension] = split(config)
    const outputDirectory = `./output/`
    const outputFile = `${filename}.css`

    try {
      await build(configDirectory + config, outputDirectory + outputFile, cssPath)
      await minify(outputDirectory, outputFile)
      await compress(`${outputDirectory + filename}.min.css`)
      const { original, minified, gzipped } = await measure(outputDirectory, filename)

      return { [config]: [original, minified, gzipped] }

    } catch (error) {
      console.error(error)
    }
  }))
  console.info('Finished.')

  display(data)
}

