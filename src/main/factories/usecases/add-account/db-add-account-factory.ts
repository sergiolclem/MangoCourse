import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account'
import { AddAccount } from '../../../../domain/usecases/add-account'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'

export const makeAddAccount = (): AddAccount => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const accountMongoRepostory = new AccountMongoRepository()
  return new DbAddAccount(encrypter, accountMongoRepostory)
}
