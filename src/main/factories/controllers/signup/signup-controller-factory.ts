import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignupController = (): Controller => {
  const signUpController = new SignUpController(makeAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
