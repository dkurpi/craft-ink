export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super("You must be logged in to view this content");
    this.name = "AuthenticationError";
  }
}

export class TokenExpiredError extends PublicError {
  constructor() {
    super("Token has expired");
    this.name = "TokenExpiredError";
  }
}

export class EmailInUseError extends PublicError {
  constructor() {
    super("Email is already in use");
    this.name = "EmailInUseError";
  }
}

export class LoginError extends PublicError {
  constructor() {
    super("Invalid email or password");
    this.name = "LoginError";
  }
}

export class NotFoundError extends PublicError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends PublicError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends PublicError {
  constructor() {
    super("Something went wrong");
    this.name = "DatabaseError";
  }
} 