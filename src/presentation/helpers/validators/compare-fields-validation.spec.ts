import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'
import { Validation } from './validation'

const makeSut = (): Validation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareField Validation', () => {
  test('Should return InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'field_value',
      fieldToCompare: 'another_field_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'field_value',
      fieldToCompare: 'field_value'
    })
    expect(error).toBeFalsy()
  })
})
