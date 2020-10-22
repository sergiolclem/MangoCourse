export interface UpdateAccessToken {
  update: (id: string, token: string) => Promise<void>
}
