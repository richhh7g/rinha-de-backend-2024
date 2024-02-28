import { HttpError } from "routing-controllers";
import { ErrorType } from "./error.type";

export class UnprocessableError extends HttpError {
  name = "UnprocessableError";

  constructor(message?: string) {
    super(ErrorType.Unprocessable);
    Object.setPrototypeOf(this, UnprocessableError.prototype);

    if (message) this.message = message;
  }
}
