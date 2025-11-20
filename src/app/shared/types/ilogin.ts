import { Iuser } from "./iuser";

export interface Ilogin {
  token: string;
  user?: Iuser;
}
