#This is actually ToffeeScript

assert = require 'assert'

t = require '../lib/timed.js'

delay = (ms, func) -> setTimeout func, ms

describe 'timed', ->
  describe 'reset', ->
    it 'should reset the timer to 0', ->
      t.reset()
      was = t.rounded()
      console.log was
      assert was<0.09

    it 'should return time in ms since reset', (done) ->
      t.reset()
      delay! 700
      elapsed = t.rounded()
      console.log "Elapsed: #{elapsed}"
      assert.ok elapsed>699.99999
      assert.ok elapsed<705.001
      done()      

