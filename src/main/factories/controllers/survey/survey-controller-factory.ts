import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSurveyValidation } from './survey-validation-factory'
import { makeDbAddSurvey } from '../../usecases/add-survey/db-add-survey-factory'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeSurveyValidation(), makeDbAddSurvey())
  return new LogControllerDecorator(addSurveyController, new LogMongoRepository())
}
