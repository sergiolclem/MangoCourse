export class ServerError extends Error {
  constructor () {
    super('Something went wrong, try again in a few minutes')
    this.name = 'ServerError'
  }
}
