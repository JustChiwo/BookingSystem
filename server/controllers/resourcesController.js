const { RESOURCES } = require('../data/config');

function getResources(req, res) {
  return res.json(RESOURCES);
}

module.exports = { getResources };
