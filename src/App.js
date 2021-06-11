import React, { Component } from 'react';

import {
	Layout
} from 'antd';

import { LinkRouter } from './shared/components/LinkRouter/LinkRouter'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import NavigationBar from './shared/components/NavigationBar/NavigationBar';
import * as ENDPOINTS from './shared/constants/settings';
import Login from './app/Login/Login';
import ManageClients from './app/ManageClients/List/List';
import ManageGroups from './app/ManageGroups/List/List';
import ManageApiSettings from './app/ManageApiSettings/List/List';
import ManageApiLogs from './app/ManageApiLogs/List/List';
import ManageClientsForm from './app/ManageClients/Form/Form';
import ManageGroupsForm from './app/ManageGroups/Form/Form';


class App extends Component {
	constructor() {
		super();
		this.state = {
			loading: false,
			isAuthenticated: false,
			user: {},
			uid: null,
			client: null,
			accessToken: null,
			expiry: null,
		}
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
	}

	checkLoginStatus = async () =>{
		try {
			let URL = "https://apiprod.famulushealth.com/api/v1/";
			let response = await axios.get(
				URL, 
				{
					headers:{
						"access-token": this.state.accessToken,
						"token-type": "Bearer",
						"uid": this.state.uid,
						"expiry": this.state.expiry,
						"client": this.state.client	
					}
				}
			)	
			this.handleLogin(response.data.data, response);
			this.props.history.push("/clients");
		} catch (error) {
			if (error.response) console.log(error.response.data.errors[0]);
		} finally {

		}
	}

	handleLogout() {
		this.setState({
		  isAuthenticated: false,
		  user: {},
		  uid: null,
		  client: null,
		  accessToken: null,
		  expiry: null,
		});
	}

	handleLogin(data, header) {
		const uid = header.headers['uid']
		const client = header.headers['client']
		const accessToken = header.headers['access-token']
		const expiry = header.headers['expiry']
		this.setState({
			isAuthenticated: true,
			id: data.id,
			user: data,
			uid: uid,
			client: client,
			accessToken: accessToken,
			expiry: expiry,
		});
	}

	componentDidMount(){
		this.checkLoginStatus();
	}

	render(){
		const {  Content } = Layout;
		const { isAuthenticated, user } = this.state;
		return (
			<Layout>
				<BrowserRouter>
					<NavigationBar 
						isAuthenticated={isAuthenticated}
						currentUser={user}
					/>
					<Content style={{ padding: '100px 75px' }}>	
						{
							isAuthenticated ?  <Redirect exact from="/" to="/clients" /> : <Redirect exact from="/" to="/login" />
						}
						<Route
							path="/login"
							render={
								props => (
									<Login
										handleLogin={this.handleLogin}
										handleLogout={this.handleLogout}
										loggedInStatus={this.state.loggedInStatus}
									/>
								)
							}
						/>
						<Switch>
							<LinkRouter isAuthenticated={isAuthenticated} exact path={'/clients'} component={ManageClients} />
							<LinkRouter isAuthenticated={isAuthenticated} exact path={'/clients/new'} component={ManageClientsForm} />
							<LinkRouter isAuthenticated={isAuthenticated} exact path={'/clients/:id'} component={ManageClientsForm} />
							{/* API */}
							<LinkRouter isAuthenticated={isAuthenticated} exact path={'/api-settings'} component={ManageApiSettings} />
							<LinkRouter isAuthenticated={isAuthenticated} exact path={'/api-logs'} component={ManageApiLogs} />

							{/* Groups */}
							<LinkRouter isAuthenticated={isAuthenticated} exact path={'/groups'} component={ManageGroups} />
							<LinkRouter isAuthenticated={isAuthenticated} exact path={'/groups/new'} component={ManageGroupsForm} />
							<LinkRouter isAuthenticated={isAuthenticated} exact path={'/groups/:id'} component={ManageGroupsForm} />
						</Switch>
					</Content>			
				</BrowserRouter>	
			</Layout>
		);
	}
}
export default App;
