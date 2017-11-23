var winston = require('winston');

var logger = new (winston.Logger)({
    level:'info',
    transports: [
      new (winston.transports.Console)({datePattern: '.yyyy-MM-ddTHH-mm',colorize: true,level: 'verbose'}),
      new (winston.transports.File)({ filename: 'translate-info.log' ,handleExceptions: true,
      maxsize: 52000, maxFiles: 1,level:'info',colorize: true}
    )
    ]
  });

module.exports = {logger}