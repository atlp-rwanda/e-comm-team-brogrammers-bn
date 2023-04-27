/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import { createLogger, format, transports } from 'winston';
import colors from 'colors';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      )
    })
  ]
});

export default logger;
