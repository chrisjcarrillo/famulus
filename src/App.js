import {
	Layout
} from 'antd';

import LinkRouter from './shared/components/LinkRouter/LinkRouter'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import NavigationBar from './shared/components/NavigationBar/NavigationBar'

function App() {
	const {  Content } = Layout;
	return (
		<Layout>
			<Router>
				<NavigationBar />
				<Content style={{ padding: '100px 75px' }}>	
					<Redirect exact from="/" to="/clients" />
					<Route
						path={'/clients'}
						component={LinkRouter}	
					/>
					<Route
						path={'/api-settings'}
						component={LinkRouter}	
					/>
					<Route
						path={'/api-logs'}
						component={LinkRouter}	
					/>
					<Route
						path={'/groups'}
						component={LinkRouter}	
					/>
		
				</Content>			
			</Router>	
		</Layout>
  	);
}

export default App;
