import { InvalidParamError } from '../../presentation/errors'
import { HttpRequest } from '../../presentation/protocols'
import { EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'

interface SutTypes {
  sut: EmailValidation
  emailValidationStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidationStub = makeEmailValidatorStub()
  const sut = new EmailValidation('email', emailValidationStub)
  return { sut, emailValidationStub }
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com'
  }
})

describe('Email Validation', () => {
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidationStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidationStub, 'isValid')
    const httpRequest = makeFakeRequest()
    sut.validate(httpRequest.body)
    expect(isValidSpy).toHaveBeenCalledWith<[string]>(httpRequest.body.email)
  })

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidationStub } = makeSut()
    jest.spyOn(emailValidationStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })

  test('Should return error if EmailValidator returns false', () => {
    const { sut, emailValidationStub } = makeSut()
    jest.spyOn(emailValidationStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const error = sut.validate(httpRequest.body)
    expect(error).toEqual(new InvalidParamError('email'))
  })
})
