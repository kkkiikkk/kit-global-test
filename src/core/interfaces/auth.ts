export interface IJwtPayload {
  username: string;
}

export interface IJwtPayloadRefresh extends IJwtPayload {
  refreshToken?: string;
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}
