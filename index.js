const p = require('barnard59')
const path = require('path')

function convertCsvw (filename) {
  const filenameInput = 'input/' + filename
  const filenameMetadata = filenameInput + '-metadata.json'
  const filenameOutput = 'target/' + path.basename(filename, '.csv') + '.nt'

  return p.rdf.dataset().import(p.file.read(filenameMetadata).pipe(p.jsonld.parse())).then((metadata) => {
    return p.run(p.file.read(filenameInput)
      .pipe(p.csvw.parse({
        baseIRI: 'file://' + filename,
        metadata: metadata
      }))
      .pipe(p.filter((quad) => {
        return quad.object.value !== 'undefined'
      }))
      .pipe(p.map((quad) => {
        const subject = quad.subject
        const predicate = quad.predicate
        const object = quad.object
        let quads = []

        if (predicate.value === 'http://purl.org/dc/terms/identifier') {
          if (object.value.length < 5) {
            console.error('Wrong didok number: ' + predicate.value)
          }
        }

        return p.rdf.quad(subject, predicate, object)
      }))
      .pipe(p.ntriples.serialize())
      .pipe(p.file.write(filenameOutput)))
  })
}

function convertXlsx (filename, sheet, metadata) {
  const filenameInput = 'input/' + filename
  // const filenameMetadata = filenameInput + '-metadata.json'
  const filenameMetadata = 'input/' + metadata
  const filenameOutput = 'target/' + path.basename(filename, '.xlsx') + '.' + path.basename(metadata, '.csv-metadata.json') + '.nt'

  return p.rdf.dataset().import(p.file.read(filenameMetadata).pipe(p.jsonld.parse())).then((metadata) => {
    return p.run(p.file.read(filenameInput)
      .pipe(p.csvw.xlsx.parse({
        baseIRI: 'file://' + filename,
        metadata: metadata,
        sheet: sheet
      }))
      .pipe(p.ntriples.serialize())
      .pipe(p.file.write(filenameOutput)))
  })
}

const filenames = [
 // 'didok.csv',
  'rollmaterial.csv'
]

const xlsxSources = [
]

p.run(() => {
  p.shell.mkdir('-p', 'target/')
}).then(() => {
  return p.Promise.serially(filenames, (filename) => {
    console.log('convert: ' + filename)

    return convertCsvw(filename)
  })
}).then(() => {
  return p.Promise.serially(xlsxSources, (source) => {
    console.log('convert: ' + source.filename + ' ' + source.sheet)

    return convertXlsx(source.filename, source.sheet, source.metadata)
  })
}).then(() => {
  console.log('done')
}).catch((err) => {
  console.error(err.stack)
})
