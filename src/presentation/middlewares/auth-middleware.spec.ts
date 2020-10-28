import { forbidden } from '../helpers/http/http-helper'
import { UnauthorizedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()
  return { sut }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in heades', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.auth({})
    expect(httpResponse).toEqual(forbidden(new UnauthorizedError()))
  })
})
