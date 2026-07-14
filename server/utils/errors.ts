export interface ApiError {
  message: string
  code: string
  statusCode: number
}

export function createApiError(message: string, code: string, statusCode: number = 500): Error {
  const error = createError({
    statusCode,
    statusMessage: message,
  })
  // @ts-ignore
  error.data = {
    message,
    code,
  }
  return error
}
