import React from 'react';
import UserList from '../User/UserList';
import Fetch from '../../../Base/base';
import { GetApi } from '../../../Base/api';
import { Layout, Input, Button, Icon, Breadcrumb, Divider, Card, List, Row } from 'antd';
import '../BasicData.css';
import BasicDataController from '../BasicDataController';
import Common from '../../../Base/common';

const Search = Input.Search;
const { Sider, Content } = Layout;
const buttonAuths = { displayName: 'staff', arr: ['view', 'create', 'edit', 'delete'] };//按钮初始化

class UserMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            width: 0,
            deptJsonDataList: [{ Id: '', DeptName: '全部' }],
            staffList: [],
            deptCurrent: '',
            buttonDisabled: Common.getButtonJurisdiction(buttonAuths),
        };
        this.pagination = {
            pagesize: 20, current: 1
        }
    }
    componentDidMount() {
        sessionStorage.setItem('deptId', '')
        this.setState({ deptCurrent: '' })
        //注册回调函数
        BasicDataController.QueryDept(this._initDeptList.bind(this));
        if (sessionStorage.getItem('userAbbr') && sessionStorage.getItem('userAbbr') !== "undefined") {
            this.setState({ searchText: sessionStorage.getItem('userAbbr') });
        }
        this._queryUserList();
        //window.addEventListener('keypress', this.handleKeyPress)
    }
    componentWillUnmount() {
        //window.removeEventListener('keypress', this.onKeyPress)
    }
    //初始化部门列表json数据
    _initDeptList(deptList) {
        this.setState({ deptJsonDataList: this.state.deptJsonDataList.concat(deptList) });
    }
    _queryUserList(pagination) {
        console.log('pagination', pagination)
        const userAbbr = sessionStorage.getItem('userAbbr');
        const deptId = sessionStorage.getItem('deptId');
        let apiUrl = GetApi("QueryUser");
        //第一次查询需要初始化分页
        if (!pagination) {
            pagination = { ...this.pagination };
        }
        else {
            this.pagination.current = pagination.current
        }
        //拼接分页查询
        apiUrl = `${apiUrl}&isPaged=true&pageIndex=${pagination.current}&pageSize=${pagination.pagesize}`;
        //获取用户列表
        Fetch(apiUrl, [{ "Name": "Abbr", "Value": userAbbr }, { "Name": "DeptID", "Value": deptId }]
        ).then((data) => {
            if (data.Code === '0') {
                this.total = data.Result.RecordCount;
                this.setState({ staffList: data.Result.ResultSet });
            }
        })
    }
    // handleKeyPress = (e) => {
    //     if (e.keyCode == 13) {
    //         this.handleSearchClick();
    //     }
    // }
    //查询按钮事件
    handleSearchClick = (val) => {
        sessionStorage.setItem('userAbbr', val);
        this._queryUserList({ pagesize: 20, current: 1 });
    }
    handleSearchChange = (event) => {
        this.setState({ searchText: event.target.value });
    }
    //添加用户事件
    handleAddClick = () => {
        this.props.history.push("../User/UserEditor");
    }
    //点击部门查询事件
    handleDeptClick = (deptId) => {
        //清空快速查询文本框
        sessionStorage.setItem('userAbbr', '');
        this.setState({ searchText: '' })
        sessionStorage.setItem('deptId', deptId);
        this.setState({ deptCurrent: deptId })
        this._queryUserList({ pagesize: 20, current: 1 });
    }
    //部门列表隐藏控制
    handerSiderClick = () => {
        if (this.state.width === 200) {
            this.state.width = 0;
        } else {
            this.state.width = 200;
        }
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        return (
            <Content className="basic-content">
                <Breadcrumb style={{ margin: '10px 0' }}>
                    <Breadcrumb.Item className="basic-titleFont">用户</Breadcrumb.Item>
                </Breadcrumb>
                <div className="base-nav">
                    <Row>
                        <div style={{ float: "right", display: "inline" }}>
                            <Button disabled={!this.state.buttonDisabled["create"]} type="primary" size="large" icon="user-add" onClick={this.handleAddClick}>添加用戶</Button>
                        </div>
                        <div style={{ float: "right", display: "inline", marginRight: '10px' }}>
                            <Search
                                placeholder="input search text"
                                enterButton="查询"
                                size="large"
                                value={this.state.searchText}
                                onSearch={this.handleSearchClick}
                                onChange={this.handleSearchChange.bind(this)}
                            />
                        </div>
                    </Row>
                    <Row>
                        <Divider style={{ marginTop: 10, marginBottom: 10 }}></Divider>
                    </Row>
                    <Row>
                        <Layout style={{ background: "#fff" }}>
                            <Sider
                                style={{ borderLeft: "none", background: "#fff" }}
                                collapsedWidth={this.state.width}
                                trigger={null}
                                collapsible
                                collapsed={this.state.collapsed} >
                                <Card title="组织架构" type="inner" style={{ display: this.state.collapsed ? 'none' : 'block' }}>
                                    <List
                                        size="small"
                                        itemLayout="horizontal"
                                        dataSource={this.state.deptJsonDataList}
                                        renderItem={(item, index) => (<List.Item className={this.state.deptCurrent === item.Id ? 'text-active' : ''} key={item.Id}><a onClick={this.handleDeptClick.bind(this, item.Id)}>{item.DeptName}</a></List.Item>)}
                                    />
                                </Card>
                            </Sider>
                            <Icon className="test-trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.handerSiderClick} />
                            <Content style={{ paddingLeft: 5, minHeight: 280 }}>
                                <UserList history={this.props.history} pagesize={this.pagination.pagesize} current={this.pagination.current}
                                    buttonDisabled={this.state.buttonDisabled}
                                    staffList={this.state.staffList} total={this.total}
                                    onRefresh={this._queryUserList.bind(this)}></UserList>
                            </Content>
                        </Layout>
                    </Row>
                </div>

            </Content>
        );
    }
}

export default UserMain;