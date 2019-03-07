import React  from 'react';
import Fetch from '../../../Base/base';
import { GetApi } from '../../../Base/api';
import BasicDataController from '../BasicDataController'
import { Message, Form, Input, Select, Button, Breadcrumb, Layout, Row, Col, AutoComplete, Spin } from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { Content } = Layout;

class UserEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            title: this.props.location.state ? "修改用户" : '添加用户',
            deptJsonDataList: [],
            roleJsonDataList: [],
            autoCompleteResult: [],
            autoBranchCompleteResult: [],
            editTarget: null,
            loading: false,
        }
        this.editTarget = {};
        this.title = '添加用户';
        this.branchId = '';
        this.branchName = '';
        this.ziyCode = '';
    }
    componentDidMount() {
        //注册回调函数
        BasicDataController.QueryDept(this._initDeptList.bind(this));
        BasicDataController.QueryRole(this._initRoleList.bind(this));
        //判断是新增还是编辑
        this.editTarget = this.props.location.state ? this.props.location.state.editTarget.obj : null;
        const { form } = this.props;
        if (this.editTarget) {
            this.title = '修改用户';
            form.setFieldsValue(this.editTarget);
            this.ziyCode = this.editTarget.StaffID;
            this.branchName = this.editTarget.BranchNote;
            this.branchId = this.editTarget.BranchID;
        }
    }
    //初始化部门列表json数据
    _initDeptList(deptList) {
        this.setState({ deptJsonDataList: deptList });
    }
    //初始化角色列表json数据
    _initRoleList(roleList) {
        this.setState({ roleJsonDataList: roleList });
    }
    //保存用户
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(this.branchId);
                if (this.branchId === '') {
                    Message.warning('请选择分公司备注');
                    return;
                }
                if (this.ziyCode !== values.StaffID) {
                    Message.warning('ZIY码不正确');
                    return;
                }
                if (this.branchName !== values.BranchNote) {
                    Message.warning('分公司备注不正确');
                    return;
                }
                this.setState({ loading: true });
                values.BranchID = this.branchId;
                //构建用户对应的角色对象
                values.RoleUserMap = [];
                //编辑状态把Id付给values
                if (this.editTarget) {
                    values.Id = this.editTarget.Id;
                    values.PWD = this.editTarget.PWD;
                    values.LoginCount = this.editTarget.LoginCount;
                    values.LastLoginTime = this.editTarget.LastLoginTime;
                    values.RoleUserMap.push({ RoleID: values.RoleId, UserID: values.Id });
                }
                else {                   //密码给默认值
                    values.PWD = '123456';
                    values.RoleUserMap.push({ RoleID: values.RoleId, UserID: '' });
                }
                Fetch(GetApi('AddOrUpdateUser'), values
                ).then((data) => {
                    if (data.Code === "0") {
                        Message.success('保存用户成功');
                        this.props.history.push('/Main/BasicData/User/UserMain');
                    }
                    else {
                        Message.error(data.Message);
                    }
                    this.setState({ loading: false });
                });
            }
        });
    }
    //返回到列表页面
    handleBack = () => {
        this.props.history.push('/Main/BasicData/User/UserMain')
    }
    handleStaffChange = (value) => {
        let autoCompleteValue = [];
        if (!value) {
            autoCompleteValue = [];
            this.setState({ autoCompleteResult: autoCompleteValue });
        } else {
            //远程根据ZIY码获取HR人员信息
            Fetch(GetApi('QueryHRStaffName'), { userziy: value }, { method: 'GET' }).then((data) => {
                autoCompleteValue = data.Result;
                this.setState({ autoCompleteResult: autoCompleteValue });
                //判断如果选择了ZIY码，则带出真实姓名
                if (data.Result.length === 1) {
                    this.props.form.setFieldsValue({ StaffName: data.Result[0].NAME });
                    this.props.form.setFieldsValue({ Mobile: data.Result[0].PHONE1 });
                    this.props.form.setFieldsValue({ Sex: data.Result[0].SEX });
                    this.ziyCode = data.Result[0].EMPLID;
                }
            })
        }
    }
    handleBranchChange = (value) => {
        let autoCompleteValue = [];
        if (!value) {
            autoCompleteValue = [];
            this.setState({ autoBranchCompleteResult: autoCompleteValue });
        } else {
            //远程根据ZIY码获取HR人员信息
            Fetch(GetApi('QueryErpBranchName'), { Abbr: value }, { method: 'GET' }).then((data) => {
                autoCompleteValue = data.Result;
                this.setState({ autoBranchCompleteResult: autoCompleteValue });
                //判断如果选择了ZIY码，则带出真实姓名
                if (data.Result.length === 1) {
                    this.branchId = data.Result[0].BRANCHID;
                    this.branchName = data.Result[0].ORGNAME;
                }
            })
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult, autoBranchCompleteResult } = this.state;
        const staffOptions = autoCompleteResult.map(item => (
            <AutoCompleteOption key={item.EMPLID} value={item.EMPLID}>{item.EMPLID}
                <span className="certain-search-item-count"><span style={{ 'fontWeight': 'bold' }}>[名字]</span> {item.NAME}<span style={{ 'fontWeight': 'bold' }}>[分公司]</span>{item.DESCR}</span>
            </AutoCompleteOption >
        ));

        const branchOptions = autoBranchCompleteResult.map(item => (
            <AutoCompleteOption key={item.ORGNAME}>{item.ORGNAME}</AutoCompleteOption>
        ));

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
                    span: 20,
                    offset: 8,
                },
                sm: {
                    span: 20,
                    offset: 8,
                },
            },
        };
        return (
            <Content style={{ padding: '0 10px 10px' }}>
                <Breadcrumb style={{ margin: '16px 0', fontWeight: 'bold' }}>
                    <Breadcrumb.Item className="basic-titleFont">用户</Breadcrumb.Item>
                    <Breadcrumb.Item className="basic-titleFont">{this.state.title}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ background: '#fff' }}>
                    <Row type="flex" justify="center">
                        <Col span={20}>
                            <Spin spinning={this.state.loading}>
                                <Form onSubmit={this.handleSubmit} style={{ padding: 24 }}>
                                    <FormItem {...formItemLayout} label="用户名" hasFeedback>
                                        {getFieldDecorator('StaffNO', {
                                            rules: [{
                                                required: true, message: '请输入您的用户名!',
                                            }],
                                        })(
                                            <Input autoComplete="off" type="text" />
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="ZIY码" hasFeedback>
                                        {getFieldDecorator('StaffID', {
                                            rules: [{
                                                required: true, message: '请输入ZIY码!',
                                            }],
                                        })(
                                            <AutoComplete
                                                optionLabelProp="value"
                                                dataSource={staffOptions}
                                                onChange={this.handleStaffChange}
                                                placeholder="请输入ZIY码"
                                            >
                                                <Input />
                                            </AutoComplete>
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="真实姓名" hasFeedback>
                                        {getFieldDecorator('StaffName', {
                                            rules: [{
                                                required: true, message: '请输入您的真实姓名!',
                                            }],
                                        })(
                                            <Input readOnly />
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="性别" hasFeedback>
                                        {getFieldDecorator('Sex', {
                                            initialValue: this.editTarget ? (this.editTarget.Sex + '') : undefined,
                                            rules: [{
                                                required: true, message: '请输入性别!',
                                            }],
                                        })(
                                            <Select>
                                                <Option value="男" key="男">男</Option>
                                                <Option value="女" key="女">女</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="联系方式">
                                        {getFieldDecorator('Mobile')(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="所属部门" hasFeedback>
                                        {getFieldDecorator('DeptID', {
                                            initialValue: this.editTarget ? (this.editTarget.DeptID + '') : null,
                                            rules: [{
                                                required: true, message: '请选择所属部门!',
                                            }],
                                        })(
                                            <Select showSearch
                                                optionFilterProp="children">
                                                {
                                                    this.state.deptJsonDataList.map(function (item, i) {
                                                        return (
                                                            <Option value={item.Id} key={item.Id}>{item.DeptName}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="分公司备注">
                                        {getFieldDecorator('BranchNote', {
                                            rules: [{
                                                required: true, message: '请选择分公司备注!',
                                            }]
                                        })(
                                            <AutoComplete
                                                dataSource={branchOptions}
                                                onChange={this.handleBranchChange}
                                                placeholder="请输入公司名称或分公司标识"
                                            >
                                                <Input />
                                            </AutoComplete>
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="角色" hasFeedback>
                                        {getFieldDecorator('RoleId', {
                                            initialValue: this.editTarget ? (this.editTarget.RoleId + '') : null,
                                            rules: [{
                                                required: true, message: '请选择角色!',
                                            }],
                                        })(
                                            <Select showSearch
                                                optionFilterProp="children">
                                                {
                                                    this.state.roleJsonDataList.map(function (item) {
                                                        return (
                                                            <Option value={item.Id} key={item.Id}>{item.RoleName}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit">保存</Button>
                                        <Button type="ghost" onClick={this.handleBack}>返回</Button>
                                    </FormItem>
                                </Form>
                            </Spin>
                        </Col>


                    </Row>
                </div>

            </Content >
        );
    }
}

UserEditor = Form.create()(UserEditor);

export default UserEditor;