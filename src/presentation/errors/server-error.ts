export class ServerError extends Error {
  constructor (stack: string) {
    super('Something went wrong, try again in a few minutes')
    this.name = 'ServerError'
    this.stack = stack
  }
}
