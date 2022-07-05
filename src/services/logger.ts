import { createLogger, transports, format } from 'winston'

const transportDefinitions = {
  file: {
    level: 'info',
    filename: 'app.log',
    dirname: './logs/',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 1,
  },
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
}

const logger = createLogger({
  transports: [new transports.File(transportDefinitions.file), new transports.Console(transportDefinitions.console)],
  format: format.combine(
    format.simple(),
    format.timestamp({
      format: () =>
        new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Amsterdam',
        }),
    }),
    format.printf((logObject) => {
      return `[${logObject.timestamp}] ${logObject.level}: ${logObject.message.trim()}`
    })
  ),
  exitOnError: false,
})

export default logger
