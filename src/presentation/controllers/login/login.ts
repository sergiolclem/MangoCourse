import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from '../login/login-protocols'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (authentication: Authentication, validation: Validation) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) { return badRequest(error) }

      const { email, password } = httpRequest.body
      const authorization = await this.authentication.auth(email, password)
      if (!authorization) { return unauthorized() }
      return ok(authorization)
    } catch (error) {
      return serverError(error)
    }
  }
}
