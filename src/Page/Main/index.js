import React, { Component } from 'react';
import { Layout, Menu, Icon, Dropdown, Select} from 'antd';
import {
  HashRouter as Router,//   BrowserRouter
  Route, Switch
} from 'react-router-dom';

import Login from '../Login'
import UserEditor from '../BasicData/User/UserEditor';
import UserMain from '../BasicData/User/UserMain';
import DeptList from '../BasicData/User/DeptList';
// import DictitemList from '../BasicData/Other/DictitemList';
// import Dictitem from '../BasicData/Other/Dictitem';
// import SqlList from '../BasicData/Other/SqlList';
// import SqlEditor from '../BasicData/Other/SqlEditor';
// import ApiAuthIndex from '../BasicData/AccessAuth/ApiAuthIndex';
// import ApiAuthConfig from '../BasicData/AccessAuth/ApiAuthConfig';

import Common from '../../Base/common';
import OrgUserList from '../BasicData/User/OrgUserList'
import SqlScriptList from '../BasicData/SqlHandle/SqlScriptList'
import SqlScriptAdd from '../BasicData/SqlHandle/SqlScriptAdd'
import SqlScriptEdit from '../BasicData/SqlHandle/SqlScriptEdit'

import RoleList from '../BasicData/Role/RoleList';
import RoleEditor from '../BasicData/Role/RoleEditor';
import LogoUrl from './logo3.png';

import UserPwd from '../BasicData/User/UserPwd';
import Fetch from '../../Base/base';
import { GetApi } from '../../Base/api';

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: this.props.location.pathname.replace('/', '') || 'Main',
      quickQueryKey: sessionStorage.getItem('quickQueryKey') ? sessionStorage.getItem('quickQueryKey') : 'Demand',
      // main_input_No_value: "",
    };

  }

  componentDidMount() {
    Common.Referrer = this.props.location
    this.Aauthority(this.props);
    // let tmpvalue = localStorage.getItem('main_input_No') ? localStorage.getItem('main_input_No') : "";
    // this.setState({ main_input_No_value: tmpvalue });
  }

  componentWillUpdate(nextProps) {
    //console.log(nextProps)
    this.Aauthority(nextProps);
  }

  Aauthority = (props) => {


  }
  //设置弹出的Form
  _saveFormRef = (form) => {
    this.userPwdForm = form;
  }

  // 隐藏弹出框
  handleCancel = () => {
    this.setState({
      userVisible: false
    })
  }

  handleClick = (e) => {
    this.setState({ current: e.key, });
    this.props.history.push("/" + e.key);

  }

  TitleClick = (name,e) => {
    this.setState({
      current: e.key
    });
    this.props.history.push("/" + e.key);
  }

  handleMenuClick = (e) => {
    if (e.key == "1") {
      localStorage.removeItem('Common');
      this.props.history.push("/Login");
    }
  }

  // //回车按键支持跳转
  // inputkey = (e) => { if (e.keyCode == 13) { this.handleQuickQuery(); } }

  urlArr = {
    'Main': ['Main'],
    'Main/User':['Main/BasicData/User/UserMain'],
    'Main/Role':['Main/BasicData/Role/RoleList'],
    'Main/BasicData': ['/Main/BasicData',
     '/Main/BasicData/User/UserEditor',
      '/Main/BasicData/User/DeptList',
       '/Main/BasicData/Role/RoleList',
        '/Main/BasicData/Role/RoleEditor'],
  }

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">登出</Menu.Item>
        <Menu.Item key="2" onClick={() => { this.setState({ userVisible: true }) }}>修改密码</Menu.Item>
      </Menu>
    );
    return (
      <Layout className="layout">
        <Header>
          <div className="logo">
            <img src={LogoUrl} style={{ width: '100%' }} />
          </div>
          <div className="user-option" >
            <Dropdown overlay={menu}  >
              <a className="ant-dropdown-link" >
                <Icon type="user" /> {Common.StaffName} <Icon type="down" />
              </a>
            </Dropdown>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[this.state.current, 'Main/Test']}
            selectedKeys={[this.state.current, 'Main/Test']}
            style={{ lineHeight: '64px' }}
            onClick={this.handleClick}
          >
          {/* {this.menuList()} */}
            <SubMenu onTitleClick={this.TitleClick.bind(this,'User')} 
              key="Main/BasicData/User/UserMain" 
              title={<span>用户</span>} 
              className={this.urlArr['Main/User'] && this.urlArr['Main/User'].indexOf(this.state.current)>-1 ? 'ant-menu-item-selected' : ''} >
            </SubMenu>
            <SubMenu onTitleClick={this.TitleClick.bind(this,'Role')} 
              key="Main/BasicData/Role/RoleList" 
              title={<span>角色</span>} 
              className={this.urlArr['Main/Role'] && this.urlArr['Main/Role'].indexOf(this.state.current)>-1 ? 'ant-menu-item-selected' : ''} >
            </SubMenu>
          </Menu>
        </Header>

        <Router >
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/Login" component={Login} />
            <Route exact path="/Main/BasicData/User/UserMain" component={UserMain} />
            <Route exact path="/Main/BasicData/User/UserEditor" component={UserEditor} />
            <Route exact path="/Main/BasicData/User/DeptList" component={DeptList} />
            <Route exact path="/Main/BasicData/User/OrgUserList" component={OrgUserList} />
            <Route exact path="/Main/BasicData/Role/RoleList" component={RoleList} />
            <Route exact path="/Main/BasicData/Role/RoleEditor" component={RoleEditor} />
            <Route exact path="/Main/SqlHandle/SqlScriptList" component={SqlScriptList} />
            <Route exact path="/Main/SqlHandle/SqlScriptAdd" component={SqlScriptAdd} />
            <Route exact path="/Main/SqlHandle/SqlScriptEdit" component={SqlScriptEdit} />
            {/* <Route exact path="/Main/BasicData/Other/SqlEditor" component={SqlEditor} />
            <Route exact path="/Main/BasicData/Other/DictitemList" component={DictitemList} />
            <Route exact path="/Main/BasicData/Other/Dictitem" component={Dictitem} />
            <Route exact path="/Main/BasicData/Other/SqlList" component={SqlList} /> */}
          </Switch>
        </Router>
        <UserPwd
          ref={(form) => { this._saveFormRef(form) }}
          visible={this.state.userVisible}
          onCancel={this.handleCancel.bind(this)}
        />
      </Layout>
    );
  }
}

export default Main;
