export class Response<T> {
  data: T;
  succeeded: boolean;
  errors: string[];
  message: string;
  
  constructor(data: T, succeeded: boolean, errors: string[], message: string) {
    this.data = data;
    this.succeeded = succeeded;
    this.errors = errors;
    this.message = message;
  }
}