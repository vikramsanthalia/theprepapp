
start = process.hrtime()

reset = ->
  start = process.hrtime()

rounded = ->
  since().toFixed(3) * 1.0

since = ->
  diff = process.hrtime start
  secondsToMS = diff[0] * 1000.0000000
  nanosecondsToMS = diff[1] / 1000000.00000
  start = diff
  secondsToMS + nanosecondsToMS

exports.reset = reset
exports.since = since
exports.rounded = rounded
