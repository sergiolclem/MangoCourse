import { ValidationComposite, RequiredFieldValidation } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols'
import { makeSurveyValidation } from './add-survey-validation-factory'
import { MinimumArraySizeValidation } from '../../../../../validation/validators/minimum-answers-validation'

jest.mock('../../../../../validation/validators/validation-composite')

describe('SurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new MinimumArraySizeValidation('answers', 2))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
