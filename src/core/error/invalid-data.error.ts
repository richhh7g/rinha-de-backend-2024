import { HttpError } from "routing-controllers";
import { ErrorType } from "./error.type";

export class InvalidDataError extends HttpError {
  name = "InvalidDataError";

  constructor(message?: string) {
    super(ErrorType.InvalidDataError);
    Object.setPrototypeOf(this, InvalidDataError.prototype);

    if (message) this.message = message;
  }
}
