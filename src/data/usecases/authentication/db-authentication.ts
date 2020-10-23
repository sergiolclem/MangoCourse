import { Authentication, AuthenticationModel, UpdateAccessTokenRepository, HashComparer, Encrypter, LoadAccountByEmailRepository } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAcessToken: UpdateAccessTokenRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer, encrypter: Encrypter, updateAcessToken: UpdateAccessTokenRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAcessToken = updateAcessToken
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = this.encrypter.encrypt(account.id)
        await this.updateAcessToken.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
