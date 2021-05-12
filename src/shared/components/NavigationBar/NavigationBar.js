import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu} from 'antd';
import { SettingOutlined,UserOutlined } from '@ant-design/icons';
import Logo from '../../../images/good-root.png';
import './NavigationBar.scss';

const { Header } = Layout;
const { SubMenu } = Menu;
const NavigationBar = () => {
    return(
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <img
                src={Logo}
                width="170"
                height="55"
                className="logo"
                alt="Logo"
            />
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={['ClientMenu']}>
                <SubMenu key="ClientMenu" icon={<UserOutlined />} title="Manage Clients">
                    <Menu.Item key="clients:1">
                        <Link to="/clients">Clients</Link>
                    </Menu.Item>
                    <Menu.Item key="clients:2">
                        <Link to="/groups">Groups</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="SettingsMenu" icon={<SettingOutlined />} title="Settings">
                    <Menu.Item key="setting:1">
                        <Link to="/api-settings">API Settings</Link>
                    </Menu.Item>
                    <Menu.Item key="setting:2">
                        Settings
                    </Menu.Item>
                </SubMenu>
            </Menu>
        </Header>

    )
}

export default NavigationBar;