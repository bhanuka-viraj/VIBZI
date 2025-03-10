import React from 'react';
import {useAuthCheck} from '../hooks/useAuthCheck';

export const withAuth = (
  Component: React.ComponentType<any>,
  screenName: string,
) => {
  return (props: any) => {
    const isAuthenticated = useAuthCheck(screenName);
    return isAuthenticated ? <Component {...props} /> : null;
  };
};
