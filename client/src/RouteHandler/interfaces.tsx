import { ReactElement } from 'react';

export interface AuthProps {
  children: ReactElement;
  exact: boolean;
  path: string;
}
