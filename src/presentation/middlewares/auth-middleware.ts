import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { UnauthorizedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) { }

  async auth (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken)
        if (account) { return ok({ accountId: account.id }) }
      }
      return forbidden(new UnauthorizedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
