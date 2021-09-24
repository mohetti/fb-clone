import { createContext } from 'react';
type UserType =
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

export const UserContext = createContext<UserType>(undefined);
