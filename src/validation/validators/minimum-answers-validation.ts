import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'

export class MinimumArraySizeValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly arraySize: number
  ) { }

  validate (input: any): Error {
    if (input[this.fieldName].length < this.arraySize) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
