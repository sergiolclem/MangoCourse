import { InvalidParamError, MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: Validation
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]
  const sut = new ValidationComposite(validationStubs)
  return { sut, validationStubs }
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (): Error {
      return null
    }
  }
  return new ValidationStub()
}
describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('any_param'))
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new InvalidParamError('any_param'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('any_param'))
  })

  test('Should not return if all tests pass', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
