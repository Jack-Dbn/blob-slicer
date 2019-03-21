'use strict'
var test = require('tape')
var BlobSlicer = require('../src/')

test('BlobSlicer constructor should throws on invalid argument', function (t) {
  t.throws(function () { BlobSlicer() })
  t.throws(function () { BlobSlicer({}) })
  t.end()
})

test('BlobSlicer#read should throws on invalid argument', function (t) {
  var reader = new BlobSlicer(new Blob(['abc']))
  t.throws(function () { reader.read(0, 3) })
  t.throws(function () { reader.read(0, 3, 'foo') })
  t.throws(function () { reader.read() })
  t.end()
})

test('BlobSlicer#read should work with 1, 2 or 3 arguments', function (t) {
  var reader = new BlobSlicer(new Blob(['abcef']))
  t.plan(6)
  reader.read(1, 3, function (err, buf) {
    t.error(err)
    t.deepEqual(buf, Buffer.from('bc'))
  })
  reader.read(3, function (err, buf) {
    t.error(err)
    t.deepEqual(buf, Buffer.from('ef'))
  })
  reader.read(function (err, buf) {
    t.error(err)
    t.deepEqual(buf, Buffer.from('abcef'))
  })
})
