export class NotFoundError extends Error {
  code = 'NOT_FOUND';

  constructor(message: string) {
    super(message);

    this.name = 'NotFoundError';
    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}

export class ValidationError extends Error {
  code = 'VALIDATION';
  extensions: Record<string, Record<string, string>>;

  constructor(message: string, properties: Record<string, string>) {
    super(message);

    this.name = 'Validation';
    Object.defineProperty(this, 'name', { value: 'Validation' });

    this.extensions = {
      properties
    };
  }
}
