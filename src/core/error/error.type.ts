export enum StatusCode {
  BadRequest = 400,
  Unprocessable = 422,
  ServerError = 500,
}

export enum ErrorType {
  DataSourceError = StatusCode.ServerError,
  InvalidDataError = StatusCode.BadRequest,
  Unprocessable = StatusCode.Unprocessable,
  ServerError = StatusCode.ServerError,
}
