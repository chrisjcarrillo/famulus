import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ManageClients from '../../../app/ManageClients/List/List';
import ManageGroups from '../../../app/ManageGroups/List/List';
import ManageApiSettings from '../../../app/ManageApiSettings/List/List';
import ManageClientsForm from '../../../app/ManageClients/Form/Form';
import ManageGroupsForm from '../../../app/ManageGroups/Form/Form';


const Router = () => (
    <div>
      <Switch>
        <Route exact path={'/clients'} component={ManageClients} />
        <Route exact path={'/clients/new'} component={ManageClientsForm} />
        <Route exact path={'/clients/:id'} component={ManageClientsForm} />
        <Route exact path={'/api-settings'} component={ManageApiSettings} />
        <Route exact path={'/groups'} component={ManageGroups} />
        <Route exact path={'/groups/new'} component={ManageGroupsForm} />
        <Route exact path={'/groups/:id'} component={ManageGroupsForm} />

      </Switch>
    </div>
);

export default Router;