import React from 'react';
import { Modal } from 'antd';

export default function UserView({ onOk, ...props }) {
    let { visible, userObj } = props;
    return (
        <Modal onCancel={onOk} visible={visible} title='用户详情'
            footer={null}>
            <div>
                <dl className="basicdata-detail">
                    <dt>用户名:</dt>
                    <dd>{userObj.StaffNO}</dd>
                </dl>
                <dl className="basicdata-detail">
                    <dt>ZIY码</dt>
                    <dd>{userObj.StaffID}</dd>
                </dl>
                <dl className="basicdata-detail">
                    <dt>真实姓名:</dt>
                    <dd>{userObj.StaffName}</dd>
                </dl>
                <dl className="basicdata-detail">
                    <dt>性别:</dt>
                    <dd>{userObj.Sex}</dd>
                </dl>
                <dl className="basicdata-detail">
                    <dt>联系方式:</dt>
                    <dd>{userObj.Mobile}</dd>
                </dl>
                <dl className="basicdata-detail">
                    <dt>所属部门:</dt>
                    <dd>{userObj.DeptName}</dd>
                </dl>
                <dl className="basicdata-detail">
                    <dt>分公司标识:</dt>
                    <dd>{userObj.BranchID}</dd>
                </dl>
                <dl className="basicdata-detail">
                    <dt>分公司名称:</dt>
                    <dd>{userObj.BranchNote}</dd>
                </dl>
                <dl className="basicdata-detail">
                    <dt>对应角色:</dt>
                    <dd>{userObj.RoleName}</dd>
                </dl>
            </div>
        </Modal>
    )
}