const rateLimit = require('express-rate-limit');

const maxConnections = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5
  });

  module.exports = { maxConnections }