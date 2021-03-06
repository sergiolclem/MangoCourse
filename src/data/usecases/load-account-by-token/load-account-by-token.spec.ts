import { DbLoadAccountByToken } from './load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenStub)
  return { sut, decrypterStub, loadAccountByTokenStub }
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt (value: string): string {
      return 'any_decrypted_value'
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByToken = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_access_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_access_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const account = await sut.load('any_access_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadAccountByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.load('any_access_token', 'any_role')
    expect(loadAccountByTokenSpy).toHaveBeenCalledWith('any_access_token', 'any_role')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(null)
    const account = await sut.load('any_access_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_access_token', 'any_role')
    expect(account).toEqual(makeFakeAccount())
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.load('any_access_token', 'any_role')
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.load('any_access_token', 'any_role')
    await expect(promise).rejects.toThrow(new Error())
  })
})
