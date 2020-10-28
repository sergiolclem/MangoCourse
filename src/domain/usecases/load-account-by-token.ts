import { AccountModel } from '../models/account'

export interface LoadAccountByToken {
  load: (accesToken: string, role?: string) => Promise<AccountModel>
}
