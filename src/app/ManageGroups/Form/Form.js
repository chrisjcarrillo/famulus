import React, { Component } from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import { Container } from 'react-bootstrap';
import { Button, Col, Divider, Form, Input, Row, Typography, Select, Upload } from 'antd';
import * as ENDPOINTS from '../../../shared/constants/settings';
import axios from 'axios';
import utils from '../../../shared/services/utils';

class ManageGroupsForm extends Component {

    state = {
        groupData: [],
        clientList: [],
        loading: false,
    }

    setLoading = (type) => {
		this.setState({ 
            loading: type 
        });
	}

    getClients = async () => {
        try {
            this.setLoading(true)
            const apiUrl = ENDPOINTS.URL + ENDPOINTS.GET_CLIENTS;
            let response = await axios.get(
                apiUrl
            );
            let responseData = await response.data;
            this.setState({
                clientList: responseData
            })
        } catch (error) {
            alert('There was an error', error.message)
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    getGroup = async (client) => {
        try {
            this.setLoading(true)
            const clientUrl = ENDPOINTS.URL + ENDPOINTS.GET_CLIENT_GROUP + client;
            let response = await axios.get(
                clientUrl
            );
            let responseData = await response.data;
            this.setState({
                groupData: responseData
            })
        } catch (error) {
            alert('There was an error', error.message)
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    componentDidMount(){
        const id = this.props.match.params.id;
        if(id){
            console.log(id);
            this.getGroup(id);
        }
        this.getClients();
    }

    render(){
        const { Item } = Form;
        const { Title } =  Typography;
        const { clientList, groupData, loading } = this.state;     
          return(
            <Container>
               <Form 
                    layout={'vertical'}
                >
                    <Row gutter={[24, 24]} type="flex" justify="space-between">
                        <Col lg={12}>
                            <Title level={2}>Basic Information</Title>                            
                                <Item label="Client Name"  required tooltip="This is a required field">
                                    <Input value={groupData.group_name} placeholder="Client Name" />
                                </Item>
                                <Item label="Group ID" required tooltip="This is a required field">
                                    <Input value={groupData.group_id} placeholder="Group ID" disabled={groupData.group_id ? true : false} />
                                </Item>
                                <Item label="Website URL" required tooltip="This is a required field">
                                    <Input value={groupData.group_site_url} placeholder="Website URL" />
                                </Item>
                                <Item label="Email" required tooltip="This is a required field">
                                    <Input value={groupData.email} placeholder="Email" />
                                </Item>
                                <Item label="Phone Number">
                                    <Input value={groupData.phone_number} placeholder="Phone Number" />
                                </Item>
                            
                        </Col>
                        <Col lg={12}>
                                <Title level={2}>Parent Client</Title>
                                <Select
                                    defaultValue={clientList.client_name}
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="Select API"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {clientList.map((option, index) => {
                                        return(<Select.Option value={option.client_name} key={option.id}>{option.client_name}</Select.Option>)
                                    })}
                                </Select>
                        </Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

export default ManageGroupsForm;