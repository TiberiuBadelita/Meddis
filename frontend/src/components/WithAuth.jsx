import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function WithAuth(Component) {
  return function AuthenticatedComponent(props) {
    const isAuthenticated = Cookies.get('jwtToken') !== undefined;

    if (isAuthenticated) {
      return <Component {...props} />;
    } else {
      return <Navigate to="/login" />;
    }
  }
}

export default WithAuth;