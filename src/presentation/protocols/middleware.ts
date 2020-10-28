import { HttpRequest, HttpResponse } from './http'

export interface Middleware {
  auth: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
