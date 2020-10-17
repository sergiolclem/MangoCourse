import { DbAddAccount } from '../../data/usecases/db-add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignupController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const encrypter = new BcryptAdapter(salt)
  const accountMongoRepostory = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, accountMongoRepostory)
  const sigUpController = new SignUpController(emailValidatorAdapter, addAccount)
  return new LogControllerDecorator(sigUpController)
}
