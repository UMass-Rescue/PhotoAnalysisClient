import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Auth } from 'api';

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, useAuth: boolean, permissions: array, ...rest } = props;


  function getRouteToRender(matchProps) {
    if (props.useAuth && Auth.isAuthenticated) {
      Auth.validateCredentials();
    }

    if (!props.useAuth ||       // If no authentication is requried to access page
      (Auth.isAuthenticated && props.permissions.includes('*')) ||      // If user is logged in, and the permission type allows all users to access page
      (Auth.isAuthenticated && props.permissions.some(item => Auth.getRoles().includes(item)))       // If user logged in and has page permissions 
      ) {
      return (
        <Layout>
          <Component {...matchProps} />
        </Layout>
      );
    } else {
      // If user does not meet criteria, reroute to login page
      if (Auth.isAuthenticated) {
        return (<Redirect to='/home' />)
      } else {
        return (<Redirect to='/login' />)
      }
    }
  }
  

  return (
    <Route
      {...rest}
      render={matchProps => (
        getRouteToRender(matchProps)
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
  useAuth: PropTypes.bool,
  permissions: PropTypes.array,
};

export default RouteWithLayout;
