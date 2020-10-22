export interface Authentication {
  auth: (authentication: AuthenticationModel) => Promise<AuthenticationResponse>
}

export interface AuthenticationModel {
  email: string
  password: string
}

export interface AuthenticationResponse {
  accessToken: string
}
