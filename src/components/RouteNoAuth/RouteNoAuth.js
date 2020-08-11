import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Auth } from 'api'

const RouteNoAuth = props => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => (
        Auth.isAuthenticated === true ?
        <Redirect to='/import' /> :
        <Layout>
          <Component {...matchProps} />
        </Layout>

      )}
    />
  );
};

RouteNoAuth.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteNoAuth;
