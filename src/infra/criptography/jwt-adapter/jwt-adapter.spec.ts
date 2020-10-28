import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const secret = 'secret'
jest.mock('jsonwebtoken', () => ({
  sign: (): string => {
    return 'any_jwt'
  },
  verify: (): string => {
    return 'any_value'
  }
}))

interface SutTypes {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter(secret)
  return { sut }
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', () => {
      const { sut } = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
    })

    test('Should return a token on sign success', () => {
      const { sut } = makeSut()
      const accessToken = sut.encrypt('any_id')
      expect(accessToken).toBe('any_jwt')
    })

    test('Should throw if sign throws', () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      expect(sut.encrypt).toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', () => {
      const { sut } = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', secret)
    })

    test('Should return a value on verify success', () => {
      const { sut } = makeSut()
      const value = sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })

    test('Should throw if verify throws', () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })
      expect(sut.encrypt).toThrow()
    })
  })
})
