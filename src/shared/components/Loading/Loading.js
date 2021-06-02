import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const customIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export const Loading = (props) => {
    return (
        <div className={'loadingDisplay'}>
            <Spin indicator={customIcon} spinning={props.loadingState} className={'loader'}>
                {props.children}
            </Spin>
        </div>
    )
}
