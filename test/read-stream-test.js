'use strict'
var test = require('tape')
var ReadStream = require('../src/read-stream')

test('ReadStream should be able to read all data in the blob', function (t) {
  var blob = new Blob(['abcdef'])
  var data = ''
  new ReadStream(blob, { highWaterMark: 1 })
    .on('data', function (chunk) { data += chunk })
    .on('end', function () {
      t.equal(data.length, blob.size)
      t.equal(data, 'abcdef')
      t.end()
    })
})

test('ReadStream should be destroyed', function (t) {
  new ReadStream(new Blob(['abcdef']))
    .resume()
    .on('end', function () {
      t.ok(this.destroyed)
      t.notok(this._reader)
      t.end()
    })
})

test('ReadStream should emit error event', function (t) {
  new ReadStream(new Blob(['abcdef']), { highWaterMark: 1 })
    .on('data', function (chunk) {
      if (chunk.toString() === 'e') this.destroy(new Error('intentional'))
    })
    .on('error', function (err) {
      t.equal(err.message, 'intentional')
      t.ok(this.destroyed)
      t.notok(this._reader)
      t.end()
    })
})
