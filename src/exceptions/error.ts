// src/exceptions/error.ts
// Purpose: Contains custom error classes.

/**
 * Represents a "Not Found" error.
 */
export class NotFound extends Error {
  statusCode: number

  /**
   * Creates a new instance of the NotFound class.
   * @param message - The error message.
   */
  constructor(message = 'Not found') {
    super(message)
    this.statusCode = 404
  }
}

/**
 * Represents a Conflict error.
 * This error is thrown when there is a conflict in the application's state.
 */
export class Conflict extends Error {
  statusCode: number

  /**
   * Creates a new instance of the Conflict error.
   * @param message The error message.
   */
  constructor(message = 'Conflict') {
    super(message)
    this.statusCode = 409
  }
}

/**
 * Represents an Unauthorized error.
 */
export class Unauthorized extends Error {
  statusCode: number

  /**
   * Creates a new instance of the Unauthorized class.
   * @param message - The error message.
   */
  constructor(message = 'Unauthorized') {
    super(message)
    this.statusCode = 401
  }
}

/**
 * Represents a BadRequest error.
 */
export class BadRequest extends Error {
  statusCode: number

  /**
   * Creates a new instance of the BadRequest class.
   * @param message - The error message.
   */
  constructor(message = 'Bad Request') {
    super(message)
    this.statusCode = 400
  }
}

/**
 * Represents a Forbidden error.
 */
export class Forbidden extends Error {
  statusCode: number

  /**
   * Creates a new instance of the Forbidden error.
   * @param message The error message.
   */
  constructor(message = 'Forbidden') {
    super(message)
    this.statusCode = 403
  }
}
