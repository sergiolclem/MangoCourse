import { DbLoadAccountByToken } from './load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return { sut, decrypterStub }
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt (value: string): string {
      return 'any_decrypted_value'
    }
  }
  return new DecrypterStub()
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter wit correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_access_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_access_token')
  })
})
