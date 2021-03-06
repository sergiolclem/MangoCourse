import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-fields-validation'
import { Validation } from '../../presentation/protocols'

const makeSut = (): Validation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
  test('Should return MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ other_field: 'field_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'field_value' })
    expect(error).toBeFalsy()
  })
})
