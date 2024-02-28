export enum StatusCode {
  BadRequest = 400,
  NotFound = 404,
  Unprocessable = 422,
  ServerError = 500,
}

export enum ErrorType {
  NotFoundError = StatusCode.NotFound,
  ServerError = StatusCode.ServerError,
  DataSourceError = StatusCode.ServerError,
  InvalidDataError = StatusCode.BadRequest,
  Unprocessable = StatusCode.Unprocessable,
}
