import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Button, Col, Row, Space, Table, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import * as ENDPOINTS from '../../../shared/constants/settings';
import { Link } from 'react-router-dom';
import axios from 'axios';

class ManageApiLogs extends Component {
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
            const clientUrl = ENDPOINTS.URL + 'api_logs';
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
                title: 'Device Type',
                dataIndex: 'device_type',
                key: "device_type"
            },
            {
                title: 'Endpoint',
                dataIndex: 'endpoint',
                key: "endpoint"
            },
            {
                title: 'IP Address',
                dataIndex: 'remote_ip',
                key: "remote_ip"
            },
            {
                title: 'Client Type',
                dataIndex: 'client_type',
                key: "client_type"
            },
            {
                title: 'Created At',
                dataIndex: 'created_at',
                key: "created_at"
            }
        ]
        const dataSource = this.state.clients;
        return(
            <Container>
                <Row>
                    <Col lg={12}>
                        <Typography>
                            <Title>Manage API Logs</Title>
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
                            scroll={{ y: 550 }}
                            size="middle"
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

export default ManageApiLogs;