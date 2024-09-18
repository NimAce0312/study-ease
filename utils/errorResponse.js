class ErrorResponse extends Error {
  constructor(message, statusCode) {
    // Call parent class constructor
    super(message);
    // Set status code
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
