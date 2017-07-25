var LevelRest = require('level-rest-parser')
var RestParser = require('rest-parser')

module.exports = function (db, model) {
  var Model = new RestParser(LevelRest(db, {
    schema: require('../models/' + model + '.json')
  }))
  return Model
}
