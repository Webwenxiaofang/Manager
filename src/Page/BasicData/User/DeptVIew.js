import React from 'react';
import { Modal} from 'antd';

export default function UserView({ onOk, ...props }) {
    let { visible, deptObj } = props;
    return (
        <Modal onCancel={onOk} visible={visible} title='部门详情'
            footer={null}>
            <div>
                <dl className="basicdata-detail">
                    <dt>部门名称:</dt>
                    <dd>{deptObj && deptObj.DeptName}</dd>
                </dl>
                <dl className="basicdata-detail">
                    <dt>分公司名称:</dt>
                    <dd>{deptObj && deptObj.BranchName}</dd>
                </dl>
                <dl className="basicdata-detail">
                    <dt>分公司标识:</dt>
                    <dd>{deptObj && deptObj.BranchID}</dd>
                </dl>
            </div>
        </Modal>
    )
}