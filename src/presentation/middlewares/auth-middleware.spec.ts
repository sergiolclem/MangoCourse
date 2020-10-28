import { forbidden } from '../helpers/http/http-helper'
import { UnauthorizedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { HttpRequest } from '../protocols'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return { sut, loadAccountByTokenStub }
}

const makeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (): Promise<AccountModel> {
      return makeAccount()
    }
  }
  return new LoadAccountByTokenStub()
}

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in heades', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.auth({})
    expect(httpResponse).toEqual(forbidden(new UnauthorizedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest = makeFakeRequest()
    await sut.auth(httpRequest)
    expect(loadAccountSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'])
  })
})
