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
        return quad.predicate.value !== 'http://ld.stadt-zuerich.ch/statistics/property/XXX'
      }))
      .pipe(p.map((quad) => {
        if (quad.predicate.value === 'http://ld.stadt-zuerich.ch/statistics/property/WERT') {
          //const value = quad.object.value.split(' ').join('')
          const value = quad.object.value.split(' ').join('')

          var valnumber

          // workaround to kick out all non-numbers
          if(isNaN(parseFloat(value))) {
            valnumber = 0
          } else {
            valnumber = parseFloat(value)

          }
          
          //return p.rdf.quad(quad.subject, quad.predicate, p.rdf.literal(value, quad.object.datatype))          
          return p.rdf.quad(quad.subject, quad.predicate, p.rdf.literal(valnumber, quad.object.datatype))
        } else {
          return quad
        }
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
  'didok.csv',
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
