import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Auth } from 'api'

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;



  return (
    <Route
      {...rest}
      render={matchProps => (
        Auth.isAuthenticated === true ?
        <Layout>
          <Component {...matchProps} />
        </Layout> :
        <Redirect to='/' />
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
