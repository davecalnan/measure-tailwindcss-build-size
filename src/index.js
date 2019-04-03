const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')
const zlib = require('zlib')
const readFile = util.promisify(fs.readFile)
const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)
const writeFile = util.promisify(fs.writeFile)

const rimraf = require('rimraf')
const { gzip } = require('node-gzip')
const CleanCSS = require('clean-css')
const Table = require('cli-table')

const brotli = (input, options) => {
  return new Promise(function(resolve, reject) {
    zlib.brotliCompress(input, options, function (error, result) {
      if(!error) resolve(result)
      else reject(Error(error))
    })
  })
}

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
  const gzipCompressed = gzip(file.toString(), { level: 9 })
  const brotliCompressed = brotli(file.toString(), { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 }})
  await Promise.all([
    writeFile(`${path}.gzip`, await gzipCompressed),
    writeFile(`${path}.brotli`, await brotliCompressed),
  ])
}

const getFileSizes = async (outputDirectory, filename) => {
  const { size: original } = await stat(`${outputDirectory + filename}.css`)
  const { size: minified } = await stat(`${outputDirectory + filename}.min.css`)
  const { size: gzipped } = await stat(`${outputDirectory + filename}.min.css.gzip`)
  const { size: brotlified } = await stat(`${outputDirectory + filename}.min.css.brotli`)
  return {
    original: convertToKB(original),
    minified: convertToKB(minified),
    gzipped: convertToKB(gzipped),
    brotlified: convertToKB(brotlified),
  }
}

const getCssStats = async path => {
  const css = await readFile(path)
  const classes = css.toString().match(/(\.[^{} ]*){/g).length
  const declarations = css.toString().match(/([^{} ]*){/g).length
  return {
    classes,
    declarations
  }
}

const measure = async (outputDirectory, filename) => {
  return {
    ...await getFileSizes(outputDirectory, filename),
    ...await getCssStats(`${outputDirectory + filename}.min.css`)
  }
}

const display = data => {
  const table = new Table({ head: ['Config', 'Original', 'Minified', 'Gzip', 'Brotli', 'Classes', 'Declarations'] })
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
      const { original, minified, gzipped, brotlified, classes, declarations } = await measure(outputDirectory, filename)

      return { [config]: [original, minified, gzipped, brotlified, classes, declarations] }

    } catch (error) {
      console.error(error)
    }
  }))
  console.info('Finished.')

  display(data)
}

