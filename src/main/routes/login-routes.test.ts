import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { hash } from 'bcrypt'

let accounCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accounCollection = await MongoHelper.getCollection('accounts')
    await accounCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 an account on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('any_password', 12)
      await accounCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password,
        passwordConfirmation: 'any_password'
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password'
        })
        .expect(200)
    })

    test('Should return 401 if user not found', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password'
        })
        .expect(401)
    })
  })
})
