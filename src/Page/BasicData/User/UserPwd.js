import React from "react";
import { Modal, Form, Input, Message } from 'antd';
import Common from '../../../Base/common';
import Fetch from '../../../Base/base'
import { GetApi } from '../../../Base/api'


const FormItem = Form.Item;

class UserPwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    //检查原密码是否正确
    handleCheckPwd = (e) => {
        let value = e.target.value;
        Fetch(GetApi('GetUserInfoByUserID'), { UserID: Common.Id }, { method: 'GET' }).then((res) => {
            if (res.Code === '0') {
                console.log(res);
                if (res.Result.PWD !== value) {
                    Message.error('原密码输入不正确');
                    this.props.form.setFieldsValue({ oldPwd: '' });
                }
            }

        })
    }
    //保存密码
    handleSavePwd = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.UserID = Common.Id;
                console.log('Received values of form: ', values);
                Fetch(GetApi('UpdatePassWord'), { Id: Common.Id, PWD: values.PWD }).then((res) => {
                    if (res.Code === '0') {
                        Message.success('修改密码成功');
                        if (this.props.onCancel) {
                            this.props.onCancel();
                        }
                    }
                    else {
                        Message.eror(res.Message);
                    }
                });
            }
        });
    }
    //输入原始密码
    handleOldPwdChange = (e) => {
        this.setState({ oldPwd: this.state.oldPwd });
    }
    handleConfirmBlur = (e) => {
        let value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('PWD')) {
            callback('两次输入的密码不一致!');
        } else {
            callback();
        }
    }
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    render() {
        const { onCancel, form, visible } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        return (
            <Modal
                visible={visible}
                title='修改密码'
                okText="确认"
                onCancel={onCancel}
                onOk={this.handleSavePwd}
                closable={false}
            >
                <Form className="card-info" layout="horizontal">
                    <FormItem label="原密码："  {...formItemLayout}>
                        {getFieldDecorator('oldPwd', {
                            rules: [{
                                required: true, message: '请输入原密码!',
                            }],
                        })(
                            <Input autoComplete="off" type="password" onBlur={this.handleCheckPwd}></Input>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="新密码：" >
                        {getFieldDecorator('PWD', {
                            rules: [{
                                required: true, message: '请输入新密码!',
                            }, {
                                validator: this.validateToNextPassword,
                            }],
                        })(
                            <Input autoComplete="off" type="password" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="密码确认：">
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true, message: '请确认密码!',
                            }, {
                                validator: this.compareToFirstPassword,
                            }],
                        })(
                            <Input autoComplete="off" type="password" onBlur={this.handleConfirmBlur} />
                        )}
                    </FormItem>

                </Form>
            </Modal>
        );
    }
}
UserPwd = Form.create()(UserPwd);
export default UserPwd;