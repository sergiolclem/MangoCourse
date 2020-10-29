import { AddSurveyRepository } from '../../../../data/protocols/db/account/add-survey-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const account = await surveyCollection.findOne({ accessToken, role })
    return account && MongoHelper.map(account)
  }
}
