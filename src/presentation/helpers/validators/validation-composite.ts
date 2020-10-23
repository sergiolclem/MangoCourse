import { Validation } from '../../protocols/validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validators: Validation[]) { }

  validate (input: any): Error {
    for (const validator of this.validators) {
      const error = validator.validate(input)
      if (error) {
        return error
      }
    }
  }
}
