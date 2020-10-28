import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { UnauthorizedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { HttpRequest } from '../protocols'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return { sut, loadAccountByTokenStub }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (): Promise<AccountModel> {
      return makeFakeAccount()
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
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadAccountSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest = makeFakeRequest()
    await sut.auth(httpRequest)
    expect(loadAccountSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'], role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(null)
    const httpResponse = await sut.auth(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new UnauthorizedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.auth(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: makeFakeAccount().id }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.auth(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
