import { DbAddAccount } from '../../../data/usecases/db-add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { makeLoginValidation } from './login-validation'

export const makeLoginController = (): Controller => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const accountMongoRepostory = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, accountMongoRepostory)
  const sigUpController = new SignUpController(addAccount, makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(sigUpController, logMongoRepository)
}
