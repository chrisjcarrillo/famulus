import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Button, Col, Divider, Form, Input, Row, Typography, Select, Upload, Switch } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Widget } from '../../../shared/components/Widget/Widget';
import { openNotificationWithIcon } from '../../../shared/components/Alert/Alert';
import { fileChecksum } from '../../../shared/utils/checksum';
import * as ENDPOINTS from '../../../shared/constants/settings';
import axios from 'axios';
import './Form.scss';

class ManageClientsForm extends Component {
    formRef = React.createRef();
    
    state = {
        isEditing: false,
        clientData: [],
        apiList: [],
        loading: false,
        disabledSwitch: true,
        showWidget: false,
        groupId: "",
        clientProfileLog: ""
    }

    setLoading = (type) => {
		this.setState({ 
            loading: type 
        });
	}
    // Get Current API
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

    // Get Current Client Settings
    getClient = async (client) => {
        try {
            this.setLoading(true)
            const clientUrl = ENDPOINTS.URL + ENDPOINTS.GET_CLIENT + client;
            let response = await axios.get(
                clientUrl
            );
            let responseData = await response.data;
            this.setState({
                clientData: responseData,
            })
            let clientStateData = this.state.clientData.client_setting;
            let has_widget = clientStateData !== undefined ? clientStateData.has_widget : true;
            let clientImage = clientStateData.client_logo !== undefined ? clientStateData.client_logo : null;

            const groupId = this.state.clientData.group_id;
            if(has_widget && groupId){
                this.setState({
                    showWidget: has_widget,
                    disabledSwitch: false,
                    groupId: groupId
                })
            }
            if(this.state.isEditing){
                this.formRef.current.setFieldsValue({
                    client:{
                        client_name: this.state.clientData.client_name,
                        group_id: this.state.clientData.group_id,
                        client_site_url: this.state.clientData.client_site_url,
                        email: this.state.clientData.email,
                        phone_number: this.state.clientData.phone_number,
                    },
                    api_setting: this.state.clientData.api_setting.name,
                    client_setting: {
                        has_widget: has_widget,
                        client_logo: clientImage
                    }
                }) 
            }
        } catch (error) {
            alert('There was an error', error.message)
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    // Submit API Settings
    updateApiSettings = async (client, api_setting) => {
        try {
            this.setLoading(true)
            const clientUrl = ENDPOINTS.URL + 'client_api_settings';
            const clients = {
                client_api_setting: {
                    api_setting_id: api_setting,
                    client_id: client
                }
            }
            let response = await axios.post(
                clientUrl, clients
            );
            let responseData = await response.data;
            console.log(responseData)
        } catch (error) {
            alert('There was an error', error.message)
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }
    
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = () => {
          callback(reader.result);
        };
        reader.onerror = (error) => {
          console.log('Error: ', error);
        };
    }

    beforeUpload = (file) => {
        return false;
    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              loading: false,
              clientProfileLogo: imageUrl
            })
          );
        }
    };

    // Submit Form
    onFinish = async (values) => {
        this.setLoading(true)
        try {
            console.log(values)
            const clientUrl = ENDPOINTS.URL + ENDPOINTS.GET_CLIENT;
            let checkFile = await fileChecksum(values.file.file);
            let urlRequest =  ENDPOINTS.URL + "presigned_url";
            let fileBody = {
                file: {
                    filename: values.file.file.name,
                    byte_size: values.file.file.size,
                    checksum: checkFile,
                    content_type: values.file.file.type,
                    metadata: {                        
                        "message": "Image for parsing"
                    }
                }
            };

            let fileRequest = await axios.post(urlRequest, fileBody);
            console.log(fileRequest.data)        
            
            if(fileRequest.data){
                let s3Request = await axios.put(fileRequest.data.direct_upload.url, values.file.file, {
                    headers: fileRequest.data.direct_upload.headers
                })
            }
            
            let client = {
                client: {
                    user_id: 1,
                    ...values.client,
                    client_setting_attributes: {
                        has_widget: values.client_setting.has_widget,
                        widget_client_logo: fileRequest.data.blob_signed_id
                    }
                },
            }
            let response = await axios.post(
                clientUrl, client
            );
            let responseData = await response.data;
            this.updateApiSettings(responseData.id, values.api_setting);

        } catch (error) {
            openNotificationWithIcon('error', 'Client Error', error.message);
        } finally {
            this.setLoading(false);
            this.props.history.push("/clients");
            openNotificationWithIcon('success', 'Client Created', 'Client was Created Succesfully')
        }
    };

    hasGroupId = (value, e) => {
        if(value.target.value.length > 2 && value.target.value !== ""){
            this.setState({
                disabledSwitch: false,
                groupId: value.target.value
            })
        } else {
            this.setState({
                disabledSwitch: true,
                showWidget: false
            })
        }
    }

    showOrHideWidget = (value, e) => {
        this.setState({
            showWidget: value
        })
    }

    async componentDidMount(){
        let id = this.props.match.params.id;
        if (id) {
            this.getClient(id);
            this.setState({
                isEditing: true
            })
        }
        this.getApi();
    }

    render(){
        const { Item } = Form;
        const { Title } =  Typography;
        const { Option } = Select;
        const { apiList, clientData, loading, disabledSwitch, showWidget, groupId, isEditing } = this.state;
       
        return(
            <Container>
                <Loading loadingState={loading}>
                    <Form 
                        initialValues={{
                            client_name: clientData.client_name || ""
                        }}
                        ref={this.formRef}
                        layout={'vertical'}
                        onFinish={this.onFinish}
                        scrollToFirstError
                        name="control-ref"
                    >
                        <Row gutter={[24, 24]} type="flex" justify="space-between">
                            <Col lg={8}>
                                <Title level={2}>Basic Information</Title>                            
                                <Item
                                    name={['client', 'client_name']}
                                    label="Client Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input Client Company Name',
                                        },
                                    ]}
                                    hasFeedback
                                    required 
                                    tooltip="This is a required field"
                                >
                                    <Input  placeholder="Client Name" />
                                </Item>
                                <Item 
                                    label="Client Group ID"
                                    name={['client', 'group_id']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input the Group ID that will be used by this client',
                                        },
                                    ]}
                                    hasFeedback
                                    required 
                                    tooltip="This is a required field"
                                >
                                    <Input onChange={this.hasGroupId} placeholder="Group ID" disabled={ clientData.group_id ? true : false} />
                                </Item>
                                <Item 
                                    label="Website URL" 
                                    name={['client', 'client_site_url']}
                                    tooltip={{ title: 'Clients Website', icon: <InfoCircleOutlined /> }}
                                >
                                    <Input value={clientData.client_site_url} placeholder="Website URL" />
                                </Item>
                                <Item 
                                    label="Email"
                                    name={['client', 'email']}
                                    required 
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input Client email!',
                                        },
                                    ]}
                                    hasFeedback
                                    required 
                                    tooltip="This is a required field"    
                                >
                                    <Input value={clientData.email} placeholder="Email" />
                                </Item>
                                <Item 
                                    label="Phone Number"
                                    name={['client', 'phone_number']}
                                    required 
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input Client phone number!',
                                        },
                                    ]}
                                    hasFeedback
                                    required 
                                    tooltip="This is a required field"    
                                >
                                    <Input value={clientData.phone_number} placeholder="Phone Number" />
                                </Item>   
                            </Col>
                            <Col lg={16}>
                                <Title level={2}>API</Title>
                                <Item 
                                    name="api_setting"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input the API that will be used by this client',
                                        },
                                    ]}
                                    hasFeedback
                                    required 
                                    tooltip="This is a required field"
                                    label="Select an API"
                                >
                                    <Select
                                        loading={loading}
                                        allowClear
                                        autoClearSearchValue
                                        showSearch
                                        placeholder="Select API"
                                        optionFilterProp="children" 
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {apiList.map((option, index) => {
                                            return <Option value={option.id} key={option.id}>{option.name}</Option>
                                        })}
                                    </Select>
                                </Item>
                                <Item label="Enable Widget" name={['client_setting', 'has_widget']}>
                                    <Switch onChange={this.showOrHideWidget} checked={showWidget} disabled={disabledSwitch}/>
                                </Item>
 
                                { showWidget ? <Widget groupId={groupId}/> : null}
                            </Col>
                            <Col lg={16}>
                                <Title level={2}>Branding</Title>
                                <Item label="Client Logo" name="file">
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        beforeUpload={this.beforeUpload}
                                        onChange={this.handleChange}
                                    >
                                        { clientData.client_setting && !clientData.client_setting.logo ? (
                                            <img src={clientData.client_setting.client_logo} alt="avatar" style={{ maxWidth: '75px' }} />
                                        ) : ( <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>) }
                                    </Upload>
                                </Item>
                            </Col>
                            <Col sm={24}>
                                <Item>
                                    <Button type="primary" htmlType="submit">
                                        { isEditing ? "Edit Client" : "Save Client" }
                                    </Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Loading>
            </Container>
        )
    }
}

export default ManageClientsForm;