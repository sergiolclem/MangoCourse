
export interface Authentication {
  auth: (email: string, password: string) => Promise<Authorization>
}

export interface Authorization {
  accessToken: string
}
