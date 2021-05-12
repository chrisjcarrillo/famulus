import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Button, Col, Row, Space, Table, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import * as ENDPOINTS from '../../../shared/constants/settings';
import { Link } from 'react-router-dom';
import axios from 'axios';

class ManageApiSettings extends Component {
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
            const clientUrl = ENDPOINTS.URL + ENDPOINTS.GET_API_SETTINGS;
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
                dataIndex: 'name',
                key: "name"
            },
            {
                title: 'API Secret',
                dataIndex: 'api_secret',
                key: "api_secret"
            },
            {
                title: 'Affiliate Code',
                dataIndex: 'api_affiliate_code',
                key: "api_affiliate_code"
            },
            {
                title: 'Updated At',
                dataIndex: 'updated_at',
                key: "updated_at"
            },
            {
                title: 'Created At',
                dataIndex: 'created_at',
                key: "created_at"
            },
            {
                title: 'Actions',
                render: (text, record) => (
                    <Space size="middle">
                      <a>Edit {record.client_name}</a>
                      <a>Delete</a>
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
                            <Title>Manage API's</Title>
                        </Typography>
                    </Col>
                    <Col lg={12} style={{
                        textAlign: 'right',
                        alignSelf: 'center'
                    }}>
                        <Link to="/clients/new">
                            <Button type="primary" icon={
                                <UserAddOutlined />
                            }> Add an API</Button>
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

export default ManageApiSettings;