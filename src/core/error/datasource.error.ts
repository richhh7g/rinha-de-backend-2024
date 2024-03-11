import { HttpError } from "routing-controllers";
import { ErrorType } from "./error.type";

export class DataSourceError extends HttpError {
  name = "DataSourceError";

  constructor(message?: string) {
    super(ErrorType.DataSourceError);
    Object.setPrototypeOf(this, DataSourceError.prototype);

    if (message) this.message = message;
  }
}
