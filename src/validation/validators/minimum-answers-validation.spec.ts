import { InvalidParamError } from '../../presentation/errors'
import { MinimumArraySizeValidation } from './minimum-answers-validation'
import { Validation } from '../../presentation/protocols'

const makeSut = (): Validation => {
  return new MinimumArraySizeValidation('answers', 2)
}

describe('MinimumAnswers Validation', () => {
  test('Should return InvalidParamError if Validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      question: 'any_question',
      answers: [
        {
          image: 'img_1',
          answer: 'answer_1'
        }
      ]
    })
    expect(error).toEqual(new InvalidParamError('answers'))
  })

  test('Should not return if Validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      question: 'any_question',
      answers: [
        {
          image: 'img_1',
          answer: 'answer_1'
        },
        {
          image: 'img_2',
          answer: 'answer_2'
        }
      ]
    })
    expect(error).toBeFalsy()
  })
})
