import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Button, Col, Divider, Form, Input, Row, Typography, Select, Upload, Switch } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Widget } from '../../../shared/components/Widget/Widget';
import { openNotificationWithIcon } from '../../../shared/components/Alert/Alert';
import { fileChecksum } from '../../../shared/utils/checksum';
import { ColorPicker } from '../../../shared/components/ColorPicker/ColorPicker';
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

        displayClientColorPicker: false,
        displayTextColorPicker: false,
        displayButtonColorPicker: false,
        displaySearchEngineBackgroundPicker: false,
        displaySearchEngineButtonPicker: false,
        displayResultPharmacyTextPicker: false,
        displayDiscountColorPicker: false,
        displayResultButtonPicker: false,
        displayCouponTextPicker: false,
        displayCouponSectionBackgroundPicker: false,

        clientColor: '#3171b9',
        textColor: '#666',
        buttonColor: '#0071b9',
        searchEngineBackgroundColor: '#fff',
        searchEngineButtonColor: '#0071b9',
        resultPharmacyTextColor: '#000',
        discountColor: '#008000',
        resultButtonColor: '#2b20d1',
        couponTextColor: '#000',
        couponSectionBackgroundColor: '#e6e6e6',

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
            const clientStateData = this.state.clientData.client_setting;
            let has_widget = clientStateData !== undefined ? clientStateData.has_widget : true;
            let clientImage = clientStateData.hasOwnProperty('client_logo') ? clientStateData.client_logo : null;
            const groupId = this.state.clientData.group_id;
            if(has_widget && groupId){
                this.setState({
                    showWidget: has_widget,
                    disabledSwitch: false,
                    groupId: groupId
                })
            }else if(!has_widget && groupId) {
                this.setState({
                    showWidget: false,
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
                    api_setting: this.state.clientData.api_setting.id,
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
    
    // Submit Client Settings
    updateClientSettings = async (client, body, file) => {
        try {
            const clientSettingUrl = ENDPOINTS.URL + 'client_settings/' + client;
            let urlRequest =  ENDPOINTS.URL + "presigned_url";
            let checkFile = await fileChecksum(file.file);
            let fileBody = {
                file: {
                    filename: file.file.name,
                    byte_size: file.file.size,
                    checksum: checkFile,
                    content_type: file.file.type,
                    metadata: {                        
                        "message": "Image for parsing"
                    }
                }
            };
            let fileRequest = await axios.post(urlRequest, fileBody);    
            if(fileRequest.data){
                let s3Request = await axios.put(fileRequest.data.direct_upload.url, file.file, {
                    headers: fileRequest.data.direct_upload.headers
                })
            }
            let clientSetting = {
                client_setting: {
                    ...body,
                    widget_client_logo: fileRequest.data.blob_signed_id ? fileRequest.data.blob_signed_id : ""
                }
            }
            let response = await axios.patch(
                clientSettingUrl, clientSetting
            );
            let responseData = await response.data;
        } catch (error) {
            alert('There was an error', error.message)
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    // Submit API Settings
    updateApiSettings = async (client, api_setting) => {
        const { isEditing } = this.state;
        let id = this.props.match.params.id;
        try {
            if(!isEditing){
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
            } else {
                this.setLoading(true)
                const clientUrl = ENDPOINTS.URL + 'client_api_settings/' + client;
                const clients = {
                    client_api_setting: {
                        api_setting_id: api_setting,
                    }
                }
                let response = await axios.patch(
                    clientUrl, clients
                );
                let responseData = await response.data;
            }
            
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
        const { isEditing } = this.state;
        let id = this.props.match.params.id;
        let client, client_colors;
        client_colors = {
            client_color: this.state.clientColor,
            text_color: this.state.textColor,
            button_color: this.state.buttonColor,
            search_engine_background_color: this.state.searchEngineBackgroundColor,
            search_engine_button_color: this.state.searchEngineButtonColor,
            result_pharmacy_text_color: this.state.resultPharmacyTextColor,
            discount_color: this.state.discountColor,
            result_button_color: this.state.resultButtonColor,
            coupon_text_color: this.state.couponTextColor,
            coupon_section_background_color: this.state.couponSectionBackgroundColor
        }
        console.log(values)
        try {
            if (!isEditing){
                console.log(values)
                const clientUrl = ENDPOINTS.URL + ENDPOINTS.GET_CLIENT;
                if(values.file !== undefined ){
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
                    client = {
                        client: {
                            user_id: 1,
                            ...values.client,
                            client_setting_attributes: {
                                has_widget: values.client_setting.has_widget,
                                widget_client_logo: fileRequest.data.blob_signed_id
                            }
                        },
                    }
                }
                if(values.file == undefined){
                    client = {
                        client: {
                            user_id: 1,
                            ...values.client,
                            client_setting_attributes: {
                                has_widget: values.client_setting.has_widget,
                                ...client_colors,
                            }
                        },
                    }
                }
                let response = await axios.post(
                    clientUrl, client
                );
                let responseData = await response.data;
                if (values.api_setting !== undefined) this.updateApiSettings(responseData.id, values.api_setting);
            } else {
                console.log(values)
                const clientUrl = ENDPOINTS.URL + ENDPOINTS.GET_CLIENT + id ;
                if(values.client) delete values.client.group_id
                let client = {
                    client: {
                        ...values.client,
                    }
                }
                let client_setting = {
                    ...values.client_setting,
                    ...client_colors
                }
                let response = await axios.patch(
                    clientUrl, client
                );
                let responseData = await response.data;
                if (values.file !== undefined) this.updateClientSettings(responseData.id, client_setting, values.file)
                if (values.api_setting) this.updateApiSettings(responseData.id, values.api_setting);
            }
            this.props.history.push("/clients");
            openNotificationWithIcon('success', 'Client Created', 'Client was Created Succesfully');
        } catch (error) {
            openNotificationWithIcon('error', 'Client Error', error.message);
        } finally {
            this.setLoading(false);
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
    // Color Picker Functions
    handleClientColorPickerClick = () => {this.setState({ displayClientColorPicker: !this.state.displayClientColorPicker })}
    handleClientColorPickerClose = () => {this.setState({ displayClientColorPicker: false })}
    handleClientColorPickerChange = (color) => {this.setState({ clientColor: color.hex})}
    handleTextColorPickerClick = () => {this.setState({ displayTextColorPicker: !this.state.displayTextColorPicker })}
    handleTextColorPickerClose = () => {this.setState({ displayTextColorPicker: false })}
    handleTextColorPickerChange = (color) => {this.setState({ textColor: color.hex})}
    handleButtonColorPickerClick = () => {this.setState({ displayButtonColorPicker: !this.state.displayButtonColorPicker })}
    handleButtonColorPickerClose = () => {this.setState({ displayButtonColorPicker: false })}
    handleButtonColorPickerChange = (color) => {this.setState({ buttonColor: color.hex})}
    
    handleSearchEngineBgPickerClick = () => {this.setState({ displaySearchEngineBackgroundPicker: !this.state.displaySearchEngineBackgroundPicker })}
    handleSearchEngineBgPickerClose = () => {this.setState({ displaySearchEngineBackgroundPicker: false })}
    handleSearchEngineBgPickerChange = (color) => {this.setState({ searchEngineBackgroundColor: color.hex})}

    handleSearchEngineButtonPickerClick = () => {this.setState({ displaySearchEngineButtonPicker: !this.state.displaySearchEngineButtonPicker })}
    handleSearchEngineButtonPickerClose = () => {this.setState({ displaySearchEngineButtonPicker: false })}
    handleSearchEngineButtonPickerChange = (color) => {this.setState({ searchEngineButtonColor: color.hex})}

    handlePharmacyTextPickerClick = () => {this.setState({ displayResultPharmacyTextPicker: !this.state.displayResultPharmacyTextPicker })}
    handlePharmacyTextPickerClose = () => {this.setState({ displayResultPharmacyTextPicker: false })}
    handlePharmacyTextPickerChange = (color) => {this.setState({ resultPharmacyTextColor: color.hex})}

    handleDiscountPickerClick = () => {this.setState({ displayDiscountColorPicker: !this.state.displayDiscountColorPicker })}
    handleDiscountPickerClose = () => {this.setState({ displayDiscountColorPicker: false })}
    handleDiscountPickerChange = (color) => {this.setState({ discountColor: color.hex})}

    handleResultButtonPickerClick = () => {this.setState({ displayResultButtonPicker: !this.state.displayResultButtonPicker })}
    handleResultButtonPickerClose = () => {this.setState({ displayResultButtonPicker: false })}
    handleResultButtonPickerChange = (color) => {this.setState({ resultButtonColor: color.hex})}

    handleCouponTextPickerClick = () => {this.setState({ displayCouponTextPicker: !this.state.displayCouponTextPicker })}
    handleCouponTextPickerClose = () => {this.setState({ displayCouponTextPicker: false })}
    handleCouponTextPickerChange = (color) => {this.setState({ couponTextColor: color.hex})}

    handleCouponBackgroundPickerClick = () => {this.setState({ displayCouponSectionBackgroundPicker: !this.state.displayCouponSectionBackgroundPicker })}
    handleCouponBackgroundPickerClose = () => {this.setState({ displayCouponSectionBackgroundPicker: false })}
    handleCouponBackgroundPickerChange = (color) => {this.setState({ couponSectionBackgroundColor: color.hex})}
    
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
        const { 
            apiList, 
            clientData, 
            loading, 

            clientColor,
            textColor,
            buttonColor,
            searchEngineBackgroundColor,
            searchEngineButtonColor,
            resultPharmacyTextColor,
            discountColor,
            resultButtonColor,
            couponTextColor,
            couponSectionBackgroundColor,

            displayClientColorPicker,
            displayTextColorPicker,
            displayButtonColorPicker,
            displaySearchEngineBackgroundPicker,
            displaySearchEngineButtonPicker,
            displayResultPharmacyTextPicker,
            displayDiscountColorPicker,
            displayResultButtonPicker,
            displayCouponTextPicker,
            displayCouponSectionBackgroundPicker,

            disabledSwitch, showWidget, groupId, isEditing } = this.state;
       
        return(
            <Container>
                <Loading loadingState={loading}>
                    <Form 
                        ref={this.formRef}
                        layout={'vertical'}
                        onFinish={this.onFinish}
                        scrollToFirstError
                        name="control-ref"
                    >
                        <Row gutter={[24, 24]} type="flex" justify="space-between">
                            <Col lg={7}>
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
                            <Col lg={17}>
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
                                <Col lg={6}>
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
                                <Row gutter={[8, 2]} type="flex" justify="space-between">
                                    <Col sm={8}>
                                        <Item label="Client Color">
                                            <ColorPicker 
                                                mainColor={clientColor}
                                                displayColorPicker={displayClientColorPicker}
                                                handleClick={this. handleClientColorPickerClick}
                                                handleClose={this.handleClientColorPickerClose}
                                                handleChange={this.handleClientColorPickerChange}
                                            />
                                        </Item>     
                                    </Col>
                                    <Col sm={8}>
                                        <Item label="Text Color">
                                            <ColorPicker 
                                                mainColor={textColor}
                                                displayColorPicker={displayTextColorPicker}
                                                handleClick={this.handleTextColorPickerClick}
                                                handleClose={this.handleTextColorPickerClose}
                                                handleChange={this.handleTextColorPickerChange}
                                            />
                                        </Item>     
                                    </Col>
                                    <Col sm={8}>
                                        <Item label="Button Color">
                                            <ColorPicker 
                                                mainColor={buttonColor}
                                                displayColorPicker={displayButtonColorPicker}
                                                handleClick={this.handleButtonColorPickerClick}
                                                handleClose={this.handleButtonColorPickerClose}
                                                handleChange={this.handleButtonColorPickerChange}
                                            />
                                        </Item>     
                                    </Col>
                                    <Col sm={8}>
                                        <Item label="Search Engine Background Color">
                                            <ColorPicker 
                                                mainColor={searchEngineBackgroundColor}
                                                displayColorPicker={displaySearchEngineBackgroundPicker}
                                                handleClick={this.handleSearchEngineBgPickerClick}
                                                handleClose={this.handleSearchEngineBgPickerClose}
                                                handleChange={this.handleSearchEngineBgPickerChange}
                                            />
                                        </Item>     
                                    </Col>
                                    <Col sm={8}>
                                        <Item label="Search Engine Button Color">
                                            <ColorPicker 
                                                mainColor={searchEngineButtonColor}
                                                displayColorPicker={displaySearchEngineButtonPicker}
                                                handleClick={this.handleSearchEngineButtonPickerClick}
                                                handleClose={this.handleSearchEngineButtonPickerClose}
                                                handleChange={this.handleSearchEngineButtonPickerChange}
                                            />
                                        </Item>     
                                    </Col>
                                    <Col sm={8}>
                                        <Item label="Pharmacy Text Color">
                                            <ColorPicker 
                                                mainColor={resultPharmacyTextColor}
                                                displayColorPicker={displayResultPharmacyTextPicker}
                                                handleClick={this.handlePharmacyTextPickerClick}
                                                handleClose={this.handlePharmacyTextPickerClose}
                                                handleChange={this.handlePharmacyTextPickerChange}
                                            />
                                        </Item>     
                                    </Col>
                                    <Col sm={8}>
                                        <Item label="Discount Text Color">
                                            <ColorPicker 
                                                mainColor={discountColor}
                                                displayColorPicker={displayDiscountColorPicker}
                                                handleClick={this.handleDiscountPickerClick}
                                                handleClose={this.handleDiscountPickerClose}
                                                handleChange={this.handleDiscountPickerChange}
                                            />
                                        </Item>     
                                    </Col>
                                    <Col sm={8}>
                                        <Item label="Result Button Color">
                                            <ColorPicker 
                                                mainColor={resultButtonColor}
                                                displayColorPicker={displayResultButtonPicker}
                                                handleClick={this.handleResultButtonPickerClick}
                                                handleClose={this.handleResultButtonPickerClose}
                                                handleChange={this.handleResultButtonPickerChange}
                                            />
                                        </Item>     
                                    </Col>
                                    <Col sm={8}>
                                        <Item label="Coupon Text Color">
                                            <ColorPicker 
                                                mainColor={couponTextColor}
                                                displayColorPicker={displayCouponTextPicker}
                                                handleClick={this.handleCouponTextPickerClick}
                                                handleClose={this.handleCouponTextPickerClose}
                                                handleChange={this.handleCouponTextPickerChange}
                                            />
                                        </Item>     
                                    </Col>
                                    <Col sm={8}>
                                        <Item label="Coupon Branding Background Color">
                                            <ColorPicker 
                                                mainColor={couponSectionBackgroundColor}
                                                displayColorPicker={displayCouponSectionBackgroundPicker}
                                                handleClick={this.CouponBackgroundPickerClick}
                                                handleClose={this.CouponBackgroundPickerClose}
                                                handleChange={this.CouponBackgroundPickerChange}
                                            />
                                        </Item>     
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={24}>
                                <Item>
                                    <Button type="primary" htmlType="submit" loading={loading}>
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