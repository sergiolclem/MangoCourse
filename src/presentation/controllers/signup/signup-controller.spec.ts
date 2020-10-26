import { SignUpController } from './signup-controller'
import { EmailInUseError, InvalidParamError, ServerError } from '../../errors'
import { AccountModel, AddAccount, AddAccountModel, Validation, Authentication, AuthenticationModel } from './signup-controller-protocols'
import { HttpRequest } from '../../protocols'
import { badRequest, ok, serverError, forbidden } from '../../helpers/http/http-helper'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccountStub()
  const validationStub = makeValidationStub()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return { sut, addAccountStub, validationStub, authenticationStub }
}

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new AddAccountStub()
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
    passwordConfirmation: 'valid_password'
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      throw new ServerError('any_stack')
    })
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  test('Should call AddAccount with correct params', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenLastCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct params', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenLastCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an Error', async () => {
    const { sut, validationStub } = makeSut()
    const anyError = new InvalidParamError('any_param')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(anyError)
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(anyError))
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct params', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const fakeRequest = makeFakeHttpRequest()
    await sut.handle(fakeRequest)
    expect(authSpy).toHaveBeenCalledWith({ email: fakeRequest.body.email, password: fakeRequest.body.password })
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
})
