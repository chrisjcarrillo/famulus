import React, { Component } from 'react';
import './Widget.scss';
import { Button, Col, Row, Typography, Tooltip } from 'antd';

const { Paragraph, Text } = Typography;

export const Widget = (props) => {
    const headerTag = '<link rel="stylesheet" href="https://famulus.s3.us-east-2.amazonaws.com/famulus-widget/dist/famulus-widget.css">';
    const middleTag = '<div id="famulus-widget"' + 'group-id="' + props.groupId +'">' + '</div>';
    const footerTagFirst = '<script src="https://famulus.s3.us-east-2.amazonaws.com/famulus-widget/dist/famulus-widget.js"></script>';
    const footerTagSecond = '<script src="https://famulus.s3.us-east-2.amazonaws.com/famulus-widget/dist/1.famulus-widget.js"></script>';
    
    return(
        <div className="widget code_containter">
            {/* Header */}
            <Row >
                <Col lg={16}>
                    <Tooltip title="This link should be used before the closing <head> tag">
                        <h4>Widget Header Link</h4>
                        <Paragraph copyable>This Code should be used before the closing HEAD tag</Paragraph>
                    </Tooltip>
                </Col>
                <Col lg={8} style={{ textAlign: "right" }} >
                    <Button
                        type="primary"
                    >
                        Copy Header Link
                    </Button>
                </Col>
                <Col lg={24} style={{ paddingTop: "0.2rem" }}>
                    <pre className="widget--header">
                        <code>
                            <span className="header-tag">{headerTag}</span>
                        </code>
                    </pre>
                </Col>
            </Row>
            
            {/* Widget Code */}
            <Row>
                <Col lg={16}>
                    <Tooltip title="This link should be used before the closing <head> tag">
                        <h4>Widget Body Code</h4>
                        <Paragraph copyable>This Code should be used inside the body wherever the widget should be rendered</Paragraph>
                    </Tooltip>
                </Col>
                <Col lg={8} style={{
                    textAlign: "right"
                }} >
                    
                    <Button
                        type="primary"
                    >
                        Copy Body Code
                    </Button>
                </Col>
                <Col 
                    lg={24} 
                    style={{
                        paddingTop: "0.2rem"
                    }}
                >
                    <pre className="widget--header">
                        <code>
                            <span className="header-tag">{middleTag}</span>
                        </code>
                    </pre>
                </Col>
            </Row>
            {/* Widget Code */}

            <Row >
                <Col lg={16}>
                    <Tooltip title="This link should be used before the closing <head> tag">
                        <h4>Widget Footer Scripts</h4>
                        <Paragraph copyable>This Code should be before the closing BODY tag</Paragraph>
                    </Tooltip>
                </Col>
                <Col lg={8} style={{
                    textAlign: "right"
                }} >
                    
                    <Button
                        type="primary"
                    >
                        Copy Footer Scripts
                    </Button>
                </Col>
                <Col 
                    lg={24} 
                    style={{
                        paddingTop: "0.2rem"
                    }}
                >
                    <pre className="widget--footer">
                        <code>
                            <span className="header-tag">{footerTagFirst}</span>
                        </code>
                        <br />
                        <code>
                            <span className="header-tag">{footerTagSecond}</span>
                        </code>
                    </pre>
                </Col>
            </Row>
            {/* Footer Code */}
        </div>
    )
}
