import jwt from 'jsonwebtoken'

import { Encrypter } from '../../../data/protocols/criptography/token-generator'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) { }

  encrypt (value: string): string {
    return jwt.sign({ id: value }, this.secret)
  }
}
