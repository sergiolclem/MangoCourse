import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/criptography/token-generator'
import { JwtAdapter } from './jwt-adapter'

const secret = 'secret'
jest.mock('jsonwebtoken', () => ({
  sign: (): string => {
    return 'any_jwt'
  }
}))

interface SutTypes {
  sut: Encrypter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter(secret)
  return { sut }
}

describe('Jwt Adapter', () => {
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
})
