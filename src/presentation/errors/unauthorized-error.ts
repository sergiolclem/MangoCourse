export class UnauthorizedError extends Error {
  constructor () {
    super('Could not authorize user')
    this.name = 'Unauthorized'
  }
}
