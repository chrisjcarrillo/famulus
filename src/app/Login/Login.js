import React, { Component } from "react";
import { Container } from 'react-bootstrap';
import {
    Col,
    Button,
    Form,
    Input,
    Row
} from 'antd';
import * as ENDPOINTS from '../../shared/constants/settings';
import axios from 'axios';


class Login extends Component{
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        }
        this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
    }
    
    handleSuccessfulAuth(data, response) {
        this.props.handleLogin(data, response);
        this.props.history.push("/clients");
    }

    handleSubmit = async (values) => {
        try {
            const URL = ENDPOINTS.URL + "auth/users/sign_in"
            let response = await axios.post(
                URL,
                {
                    email: values.email,
                    password: values.password
                }
            )
            this.handleSuccessfulAuth(response.data.data, response);
        } catch (error) {
            if (error.response) console.log(error.response.data.errors[0]);
        } finally {        
        }
    }

    render(){
        return(
            <Container>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={16} xl={16} style={{ 
                        margin: "0 auto"
                    }}>
                        <Form
                            ref={this.formRef}
                            scrollToFirstError
                            name="control-ref"
                            onFinish={this.handleSubmit}
                        >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                            Login
                            </Button>
                        </Form.Item>                        
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Login;