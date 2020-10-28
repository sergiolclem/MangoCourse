import { UnauthorizedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  async auth (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new UnauthorizedError())
  }
}
