import React from 'react';
import { Switch, Route, Redirect} from 'react-router-dom';



export const LinkRouter = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/login',
          }}/>
        )
    )}/>
);