import { createContext } from 'react';
type LoginType = undefined | boolean;

export const LoginContext = createContext<LoginType>(true);
