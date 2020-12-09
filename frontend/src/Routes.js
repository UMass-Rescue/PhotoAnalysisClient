import React from 'react';
import {Switch, Redirect} from 'react-router-dom';

import {RouteWithLayout} from './components';
import {Main as MainLayout, Minimal as MinimalLayout} from './layouts';

import {
    Import as ImportView,
    Review as ReviewView,
    NotFound as NotFoundView,
    Login as LoginView,
    Home as HomeView
} from './views';

const Routes = () => {
    return (
        <Switch>
            <Redirect
                exact
                from="/"
                to="/home"
            />
            <RouteWithLayout
                component={HomeView}
                exact
                layout={MainLayout}
                useAuth={true}
                permissions={['admin', 'investigator', 'researcher']}
                path="/home"
            />
            <RouteWithLayout
                component={LoginView}
                exact
                layout={MinimalLayout}
                useAuth={false}
                path="/login"
            />
            <RouteWithLayout
                component={ImportView}
                exact
                layout={MainLayout}
                useAuth={true}
                permissions={['admin', 'researcher']}
                path="/import"
            />
            <RouteWithLayout
                component={ReviewView}
                exact
                layout={MainLayout}
                useAuth={true}
                permissions={['admin', 'investigator', 'researcher']}
                path="/review"
            />
            <RouteWithLayout
                component={NotFoundView}
                exact
                layout={MinimalLayout}
                useAuth={true}
                permissions={['admin', 'investigator', 'researcher']}
                path="/not-found"
            />
            <Redirect to="/not-found"/>
        </Switch>
    );
};

export default Routes;
