import { createContext } from 'react';
type UserType =
  | undefined
  | {
      userInfo:
        | undefined
        | {
            _id: string;
            email: string;
            firstName: string;
            surName: string;
            friends: [string];
            friendsRequest: [string];
            img: string;
          };
      setUserInfo: Function;
    };

export const UserContext = createContext<any>({
  userInfo: undefined,
  setUserInfo: () => {},
});
