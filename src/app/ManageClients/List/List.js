import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Button, Col, Row, Space, Table, Typography } from 'antd';
import { UserAddOutlined, UserDeleteOutlined, EditOutlined} from '@ant-design/icons';
import * as ENDPOINTS from '../../../shared/constants/settings';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { openNotificationWithIcon } from '../../../shared/components/Alert/Alert'

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
            openNotificationWithIcon('error', 'Error', error.message)
        } finally {
            this.setLoading(false);
        }
    }

    componentDidMount(){
        this.getClients();
    }

    render(){
        const { Title} = Typography;
        const { loading, clients } = this.state;

        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: "id",
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Client Name',
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
                title: 'Group ID',
                dataIndex: 'group_id',
                key: "group_id"
            },
            {
                title: 'Actions',
                render: (text, record) => (
                    <Space size="middle">
                        <Link to={`/clients/${record.group_id}`}><EditOutlined /></Link>
                    </Space>
                ),
            }
        ]

        const columnsGroup = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: "id"
            },
            {
                title: 'Group Name',
                dataIndex: 'group_name',
                key: "group_name"
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: "email"
            },
            {
                title: 'Site URL',
                dataIndex: 'group_site_url',
                key: "group_site_url"
            },
            {
                title: 'Group ID',
                dataIndex: 'group_id',
                key: "group_id"
            }
        ]
        
        return(
            <Container>
                <Loading loadingState={loading}>
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
                                expandable={{  
                                    expandedRowRender: record => (
                                        <Table columns={columnsGroup} dataSource={record.client_groups} rowKey='id'/>
                                    ),
                                }}
                                dataSource={clients} 
                                columns={columns}
                                size="middle"
                                rowKey='id'
                                scroll={{ y: 550 }}
                            />
                        </Col>
                    </Row>
                </Loading>
            </Container>
        )
    }
}

export default ManageClients;