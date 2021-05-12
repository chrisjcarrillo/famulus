import React, { Component } from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import { Container } from 'react-bootstrap';
import { Button, Col, Divider, Form, Input, Row, Typography, Select, Upload } from 'antd';
import * as ENDPOINTS from '../../../shared/constants/settings';
import axios from 'axios';
import './Form.css'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import utils from '../../../shared/services/utils';

class ManageClientsForm extends Component {

    state = {
        clientData: [],
        apiList: [],
        loading: false,
        displayColorPicker: false,
        color: {
          r: '241',
          g: '112',
          b: '19',
          a: '1',
        },
    }

    setLoading = (type) => {
		this.setState({ 
            loading: type 
        });
	}

    getApi = async () => {
        try {
            this.setLoading(true)
            const apiUrl = ENDPOINTS.URL + ENDPOINTS.GET_API_SETTINGS;
            let response = await axios.get(
                apiUrl
            );
            let responseData = await response.data;
            this.setState({
                apiList: responseData
            })
        } catch (error) {
            alert('There was an error', error.message)
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    getClient = async (client) => {
        try {
            this.setLoading(true)
            const clientUrl = ENDPOINTS.URL + ENDPOINTS.GET_CLIENT + client;
            let response = await axios.get(
                clientUrl
            );
            let responseData = await response.data;
            this.setState({
                clientData: responseData
            })
        } catch (error) {
            alert('There was an error', error.message)
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
      };
    
      handleClose = () => {
        this.setState({ displayColorPicker: false })
      };
    
      handleChange = (color) => {
        this.setState({ color: color.rgb })
      };

    componentDidMount(){
        const id = this.props.match.params.id;
        if(id){
            console.log(id);
            this.getClient(id);
        }
        this.getApi();
    }

    render(){
        const { Item } = Form;
        const { Title } =  Typography;
        const { apiList, clientData, loading } = this.state;
        const uploadButton = (
            <div>
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          );       
          const styles = reactCSS({
            'default': {
              color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
              },
              swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
              },
              popover: {
                position: 'absolute',
                zIndex: '2',
              },
              cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
              },
            },
          });
       
          return(
            <Container>
               <Form 
                    layout={'vertical'}
                >
                    <Row gutter={[24, 24]} type="flex" justify="space-between">
                        <Col lg={12}>
                            <Title level={2}>Basic Information</Title>                            
                                <Item label="Client Name"  required tooltip="This is a required field">
                                    <Input value={clientData.client_name} placeholder="Client Name" />
                                </Item>
                                <Item label="Group ID" required tooltip="This is a required field">
                                    <Input value={clientData.group_id} placeholder="Group ID" disabled={clientData.group_id ? true : false} />
                                </Item>
                                <Item label="Website URL" required tooltip="This is a required field">
                                    <Input value={clientData.client_site_url} placeholder="Website URL" />
                                </Item>
                                <Item label="Email" required tooltip="This is a required field">
                                    <Input value={clientData.email} placeholder="Email" />
                                </Item>
                                <Item label="Phone Number">
                                    <Input value={clientData.phone_number} placeholder="Phone Number" />
                                </Item>
                            
                        </Col>
                        <Col lg={12}>
                                <Title level={2}>API</Title>
                                <Select
                                    defaultValue={clientData.name}
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="Select API"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {apiList.map((option, index) => {
                                        return(<Select.Option value={option.name} key={option.id}>{option.name}</Select.Option>)
                                    })}
                                </Select>
                                <Divider />
                                <Title level={2}>Branding</Title>
                                <Item label="Client Logo" required tooltip="This is a required field">
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                    >
                                        {uploadButton}
                                    </Upload>
                                </Item>
                                <Row gutter={[24, 24]} type="flex">
                                    <Col lg={8}>
                                        <Item label="Client Color" required tooltip="This is a required field">
                                            <div style={ styles.swatch } onClick={ this.handleClick }>
                                                <div style={ styles.color } />
                                            </div>
                                            { this.state.displayColorPicker ? <div style={ styles.popover }>
                                            <div style={ styles.cover } onClick={ this.handleClose }/>
                                                <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
                                            </div> : null }
                                        </Item>
                                    </Col>
                                    <Col lg={8}>
                                        <Item label="Widget Text Color" required tooltip="This is a required field">
                                            <div style={ styles.swatch } onClick={ this.handleClick }>
                                                <div style={ styles.color } />
                                            </div>
                                        </Item>
                                    </Col>
                                    <Col lg={8}>
                                        <Item label="Widget Button Color" required tooltip="This is a required field">
                                            <div style={ styles.swatch } onClick={ this.handleClick }>
                                                <div style={ styles.color } />
                                            </div>
                                        </Item>
                                    </Col>
                                </Row>

                                <Row gutter={[24, 24]} type="flex">
                                    <Col lg={8}>
                                        <Item label="Search Engine Background Color" required tooltip="This is a required field">
                                        <div style={ styles.swatch } onClick={ this.handleClick }>
                                            <div style={ styles.color } />
                                        </div>
                                        </Item>                    
                                    </Col>
                                    <Col lg={8}>
                                        <Item label="Search Engine Button Color" required tooltip="This is a required field">
                                        <div style={ styles.swatch } onClick={ this.handleClick }>
                                            <div style={ styles.color } />
                                        </div>
                                        </Item>
                                    </Col>
                                    <Col lg={8}>
                                        <Item label="Search Engine Result Text Color" required tooltip="This is a required field">
                                        <div style={ styles.swatch } onClick={ this.handleClick }>
                                            <div style={ styles.color } />
                                        </div>
                                        </Item>
                                    </Col>
                                </Row>
                                


                        </Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

export default ManageClientsForm;