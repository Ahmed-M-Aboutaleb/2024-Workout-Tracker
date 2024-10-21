import { IProfile } from 'src/profiles/interfaces/profiles.interface';

export interface IAuthResponse {
  access_token: string;
  profile: IProfile;
}
