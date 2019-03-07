import React  from 'react';
import Fetch from '../../../Base/base';
import { GetApi } from '../../../Base/api';
import { Message, Form, Input, Button, Breadcrumb, Layout, Tree, Card, Select, Spin } from 'antd';
import BasicDataController from '../BasicDataController';
import Common from '../../../Base/common';

const FormItem = Form.Item;
const { Content } = Layout;
const { TextArea } = Input;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

class RoleEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            title: "添加角色",
            roleJsonDataList: [],
            checkedKeys: [],
            treeDataJson: [],
            loading: false,
            disible: Common.getUrlParam(this.props.location.search, 'operate') === 'edit' ? false : true,
        }
        this.editTarget = null;
    }
    componentDidMount() {
        this.setState({ loading: true });
        BasicDataController.QueryRole(this._initRoleList.bind(this));
        BasicDataController.QueryFunction(this._InitFunctionTree.bind(this));
    }
    //初始化角色信息
    _initRoleInfo() {
        let roleId = Common.getUrlParam(this.props.location.search, "roleId");
        const { form } = this.props;
        if (roleId) {
            this.setState({ title: this.state.disible ? "查看角色" : "修改角色" });
            Fetch(GetApi('GetFunctionByRoleID'), { roleid: roleId }, { method: 'GET' }).then((data) => {
                if (data.Code === '0') {
                    this.editTarget = data.Result;
                    // //构建角色下的用户列表
                    if (this.editTarget.UserList) {
                        this.editTarget.UserNameList = '';
                        this.editTarget.UserList.map((obj) => {
                            this.editTarget.UserNameList += obj.StaffName + ';'
                        });
                    }
                    //this.editTarget.UserNameList = userNameList.join(',');
                    if (this.editTarget.RoleRoleMap) {
                        //构建角色对弈的角色
                        let roleJsonList = [];

                        this.editTarget.RoleRoleMap.map((obj) => {
                            if (obj.RoleID !== '') roleJsonList.push(obj.RoleID);
                        });
                        this.editTarget.RoleJsonList = roleJsonList;
                    }
                    if (this.editTarget.RoleFunctionMap) {
                        //构建角色对应的权限
                        let roleFunctionList = [];
                        this.editTarget.RoleFunctionMap.map((obj) => {
                            roleFunctionList.push(obj.FunctionID);
                        });

                        this.setState({ checkedKeys: roleFunctionList });
                    }
                    form.setFieldsValue(this.editTarget);
                }
                else {
                    Message.error(data.Message)
                }
                this.setState({ loading: false });
            })
        }
        else {
            this.setState({ loading: false });
        }
    }
    //初始化角色集合
    _initRoleList(roleList) {
        this.setState({ roleJsonDataList: roleList });
    }
    //初始化权限树
    _InitFunctionTree(functionTree) {
        this.setState({ treeDataJson: functionTree }, () => {
            this._initRoleInfo();
        });
    }  
    //保存
    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.RoleFunctionMap = [];
                this.state.checkedKeys.map((item) => {
                    values.RoleFunctionMap.push({ RoleID: this.editTarget ? this.editTarget.Id : '', FunctionID: item });
                })
                console.log('this.editTarget: ', this.editTarget);
                //添加的时候默认本角色可以指派自己
                values.RoleRoleMap = this.editTarget ? [] : [{ RoleID: '', ParentRoleID: '' }];
                //当前角色可以指派当前角色
                if (values.RoleList) {
                    values.RoleList.map((item) => {
                        values.RoleRoleMap.push({ RoleID: item, ParentRoleID: this.editTarget ? this.editTarget.Id : '' });
                    })
                }
                if (this.editTarget) {
                    values.Id = this.editTarget.Id;
                }
                console.log('Received values of form: ', values);
                Fetch(GetApi('AddOrUpdateRole'), values
                ).then((data) => {
                    if (data.Code === "0") {
                        Message.success('保存角色成功');
                        this.props.history.push('/Main/BasicData/Role/RoleList');
                    }
                    else {
                        Message.error(data.Message);
                    }
                    this.setState({ loading: false });
                });
            }
        });
    }
    handleBack = (e) => {
        this.props.history.push('/Main/BasicData/Role/RoleList');
    }
    //树节点选择
    handleCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }
    //树控件渲染
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.Children) {
                return (
                    <TreeNode title={item.Text} key={item.Id}>
                        {this.renderTreeNodes(item.Children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 20 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        return (
            <Content style={{ padding: '0 10px 10px' }}>
                <Breadcrumb style={{ margin: '16px 0', fontWeight: 'bold' }}>
                    <Breadcrumb.Item style={{ color: '#cf1322' }}>{this.state.title}</Breadcrumb.Item>
                </Breadcrumb>
                <Spin spinning={this.state.loading}>
                    <Form onSubmit={this.handleSubmit} style={{ background: '#fff', padding: 24 }}>
                        <FormItem {...formItemLayout} label="角色名称" hasFeedback>
                            {getFieldDecorator('RoleName', {
                                rules: [{
                                    required: true, message: '请输入您的角色名称!',
                                }],
                            })(
                                <Input autoComplete="off" type="text" placeholder="请输入角色名称" readOnly={this.state.disible} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="角色描述">
                            {getFieldDecorator('RoleDescribe', {
                                rules: [{
                                    required: false,
                                }],
                            })(
                                <TextArea rows={4} readOnly={this.state.disible} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户列表">
                            {getFieldDecorator('UserNameList', {
                                rules: [{
                                    required: false,
                                }],
                            })(
                                <TextArea autosize={{ minRows: 2, maxRows: 6 }} readOnly />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="可指派角色">
                            {getFieldDecorator('RoleList', {
                                initialValue: this.editTarget ? this.editTarget.RoleJsonList : null,
                                rules: [{
                                    required: false, message: '至少指定一个角色!',
                                }],
                            })(
                                <Select mode="multiple" placeholder="请选择角色" disabled={this.state.disible}>
                                    {this.state.roleJsonDataList.map(item => <Option key={item.Id} value={item.Id}>{item.RoleName}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="功能授权">
                            {getFieldDecorator('functionList', {
                                rules: [{
                                    required: false,
                                }],
                            })(
                                <Card>
                                    <Tree showLine disabled={this.state.disible}
                                        checkable
                                        checkedKeys={this.state.checkedKeys}
                                        onCheck={this.handleCheck}
                                    >
                                        {this.renderTreeNodes(this.state.treeDataJson)}
                                    </Tree>
                                </Card>
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" disabled={this.state.disible}>保存</Button>
                            <Button type="ghost" onClick={this.handleBack}>返回</Button>
                        </FormItem>
                    </Form>
                </Spin>
            </Content>
        );
    }
}

RoleEditor = Form.create()(RoleEditor);

export default RoleEditor;