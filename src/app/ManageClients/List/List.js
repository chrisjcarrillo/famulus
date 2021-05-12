import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Button, Col, Row, Space, Table, Typography } from 'antd';
import { UserAddOutlined, UserDeleteOutlined, EditOutlined} from '@ant-design/icons';
import * as ENDPOINTS from '../../../shared/constants/settings';
import { Link } from 'react-router-dom';
import axios from 'axios';

class ManageClients extends Component {
    state = {
        clients: [],
        loading: false
    }

    setLoading = (type) => {
		this.setState({ 
            loading: type 
        });
	}

    getClients = async () => {
        try {
            this.setLoading(true)
            const clientUrl = ENDPOINTS.URL + ENDPOINTS.GET_CLIENTS;
            let response = await axios.get(
                clientUrl
            );
            let responseData = await response.data;
            this.setState({
                clients: responseData
            })
            console.log(responseData);
        } catch (error) {
            alert('There was an error', error.message)
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    componentDidMount(){
        this.getClients();
    }

    render(){
        const { Title } = Typography;
        
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: "id"
            },
            {
                title: 'Name',
                dataIndex: 'client_name',
                key: "client_name"
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: "email"
            },
            {
                title: 'Site URL',
                dataIndex: 'client_site_url',
                key: "client_site_url"
            },
            {
                title: 'Affiliate ID',
                dataIndex: 'group_id',
                key: "group_id"
            },
            {
                title: 'Actions',
                render: (text, record) => (
                    <Space size="middle">
                        <Link to={`/clients/${record.group_id}`}><EditOutlined /></Link>
                        <Link to={`/clients/${record.group_id}`}><UserDeleteOutlined /></Link>
                    </Space>
                ),
            }
        ]
        const dataSource = this.state.clients;
        return(
            <Container>
                <Row>
                    <Col lg={12}>
                        <Typography>
                            <Title>Manage Clients</Title>
                        </Typography>
                    </Col>
                    <Col lg={12} style={{
                        textAlign: 'right',
                        alignSelf: 'center'
                    }}>
                        <Link to="clients/new">
                            <Button type="primary" icon={
                                <UserAddOutlined />
                            }> Add a Client</Button>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col lg={24}>
                        <Table 
                            className="components-table-demo-nested"
                            dataSource={dataSource} 
                            columns={columns}
                            loading={this.state.loading} 
                        />
                    </Col>
                </Row>
            </Container>
        )
    }


}

export default ManageClients;