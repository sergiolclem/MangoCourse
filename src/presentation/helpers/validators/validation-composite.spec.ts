import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: Validation
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  class ValidationStub implements Validation {
    validate (): Error {
      return null
    }
  }
  const validationStub = new ValidationStub()
  const sut = new ValidationComposite([validationStub])
  return { sut, validationStub }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('any_param'))
  })

  test('Should not return if all tests pass', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
