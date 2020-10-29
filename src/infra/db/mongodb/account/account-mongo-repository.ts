import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    return result && MongoHelper.map(result)
  }

  async updateAccessToken (_id: string, accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id },
      { $set: { accessToken } }
    )
  }

  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    const surveyCollection = await MongoHelper.getCollection('accounts')
    const account = await surveyCollection.findOne({
      accessToken,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    return account && MongoHelper.map(account)
  }
}
