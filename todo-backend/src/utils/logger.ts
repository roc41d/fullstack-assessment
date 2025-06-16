import winston from "winston";

const logger = winston.createLogger({
  level: "info", // Default log level, messages below this level will be ignored
  format: winston.format.combine(
    winston.format.timestamp(), // Adds a timestamp to each log message
    winston.format.simple() // Use simple log format for readability
  ),
  transports: [
    // Console transport logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Adds color to log messages for console
        winston.format.simple()
      ),
    }),
    // File transport logs to a file
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

export default logger;
