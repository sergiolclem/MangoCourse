import { ValidationComposite, RequiredFieldValidation } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols'
import { MinimumArraySizeValidation } from '../../../../../validation/validators/minimum-answers-validation'

export const makeSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new MinimumArraySizeValidation('answers', 2))
  return new ValidationComposite(validations)
}
