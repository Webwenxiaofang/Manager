import React, { Component } from 'react';
import { Input, Button, message, Checkbox } from 'antd';
import './login.css';
import Api, { GetApi, GetToken } from '../../Base/api';
import Fetch from '../../Base/base';
import Common from '../../Base/common';
import LogoUrl from './moo-01.png';


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Loading: false,
      Data: {
        username: '',
        password: ''
      },
      rememberPwd: false
    }
    this.Upload = null;
  }


  componentDidMount() {
    window.addEventListener('keypress', this.onKeyPress)
    let host;
    if (Api.ReleaseModel) { host = Api.Host_Formal }
    else { host = Api.Host_Test }
    if (Api.InnerNetwork) { Api.Host = host.Inner }
    else { Api.Host = host.Outer }
    this.setState({
      'Data': {
        username: localStorage.getItem("loginId") ? localStorage.getItem("loginId") : '',
        password: localStorage.getItem("loginPassword") ? this.uncompile(localStorage.getItem("loginPassword")) : ''
      }, 'rememberPwd': localStorage.getItem('rememberPwd')
    })
  }

  componentWillUpdate(props) {
    //window.removeEventListener('keypress',this.onKeyPress)
  }

  /**
   *自定义加密
   *
   * @param {*} code 待加密字符串
   * @memberof Login
   */
  compile(code) {
    var c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (var i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return escape(c);
  }
  /**
   *自定义解密
   *
   * @param {*} code 待解密字符串
   * @returns
   * @memberof Login
   */
  uncompile(code) {
    code = unescape(code);
    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (var i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
  }

  submit = (e) => {
    this.setState({ Loading: true });
    let param = { username: this.state.Data.username, password: this.state.Data.password, grant_type: 'password', client_id: 'JZT', client_secret: 'JZT', };
    Fetch(GetToken(), param, {
      formData: true,
      headers: {
        'Accept': 'application/json;charset=UTF-8',
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(res => {
      if (!res.error) {
        Common.Token = res;

        Fetch(GetApi("GetUser"), null, { method: 'GET', Authorization: true }).then(res => {
          console.log('GetUser', res);
          if (res.Code === '0') {
            var data = res.Result;
            Common.BranchId = data.BranchID;
            Common.Id = data.Id;
            Common.Sex = data.Sex;
            Common.StaffId = data.StaffID;
            Common.StaffNo = data.StaffNO;
            Common.StaffName = data.StaffName;
            Common.OrgName = data.BranchNote;
            Common.Mobile = data.Mobile;
            Common.DeptId = data.DeptID;
            Common.DeptName = data.DeptName;
            Common.LastLoginTime = data.LastLoginTime;
            Common.LoginCount = data.LoginCount;
            Common.FunctList = data.FunctList ? data.FunctList : [];
            Common.RoleList = data.RoleList ? data.RoleList : [];
            Common.UserList = data.UserList ? data.UserList : [];
            window.removeEventListener('keypress', this.onKeyPress)
            const userInfoState = localStorage.getItem('Common');
            if (userInfoState) {
              localStorage.removeItem('Common');
            }
            localStorage.setItem('Common', JSON.stringify({
              Common,
              timestamp: new Date().getTime()
            }));
            if (this.state.rememberPwd) {
              //如果选择了记住密码，则把用户名和密码存入本地缓存中
              localStorage.setItem('loginId', this.state.Data.username)
              localStorage.setItem('loginPassword', this.compile(this.state.Data.password))
              localStorage.setItem('rememberPwd', this.state.rememberPwd)
            }
            else {
              localStorage.removeItem('loginId')
              localStorage.removeItem('loginPassword')
              localStorage.removeItem('rememberPwd')
            }

            this.setState({ Loading: false });
            let path = {};
            if (Common.Referrer) {
              path = { ...Common.Referrer }
              Common.Referrer = null
            }
            else {
              path = { pathname: '/Main' }
            }
            this.props.history.push(path);
          }
          else {
            message.error("获取用户信息失败"); this.setState({ Loading: false });
          }


        }).catch(err => { message.error("获取用户信息失败"); this.setState({ Loading: false }); });


      }
      else { message.error(res.error_description); this.setState({ Loading: false }); }
    }).catch(err => { message.error("获取token失败") });

  }

  onKeyPress = (e) => { if (e.keyCode === 13) { this.submit(); } }

  render() {
    return (
      <div className='container-fill-bg ng-scope'>
        <div className='single-card-wrapper'>
          <div className='logo ng-isolate-scope' style={{ height: '80px', width: '500px' }}>
            <div title="Worktile">
              <img alt="Worktile" src={LogoUrl} />
            </div>
          </div>
          <div className='single-card' >
            <div className='card-header ng-binding'>
              登录
</div>
            <div className='card-body ng-scope'></div>
            <div className='form-group'>
              <label className="control-label ng-scope" translate="user.ENTER_LOGIN_DOMAIN">输入你登录的账号</label>
              <div style={{ marginTop: 5 }} className="input-group">

                <Input autoComplete="off" className='form-control' placeholder="账号" data-id="username" value={this.state.Data.username}
                  onChange={(e) => {
                    //console.log(e.target.getAttribute("data-id"))
                    let data = Object.assign({}, this.state.Data, { username: e.target.value })
                    this.setState({ Data: data })


                  }} />
              </div>
            </div>

            <div className='form-group'>
              <label className="control-label ng-scope" translate="user.ENTER_LOGIN_DOMAIN">输入你设置的密码</label>
              <div style={{ marginTop: 5 }} className="input-group">

                <Input autoComplete="off" className='form-control' placeholder="密码" data-id="password" type="password" value={this.state.Data.password}
                  onChange={(e) => {
                    let data = Object.assign({}, this.state.Data, { password: e.target.value })
                    this.setState({ Data: data })
                  }} />
              </div>
            </div>
            <div className='form-group'>
              <Checkbox checked={this.state.rememberPwd} onChange={(e) => { this.setState({ 'rememberPwd': e.target.checked }) }}>记住密码</Checkbox>
            </div>

            <div className='form-group'>
              <Button style={{ height: 45, fontSize: 20 }} type="primary" block loading={this.state.Loading} onClick={this.submit}>登  录</Button>
            </div>


          </div>

        </div>
      </div >
    );
  }
}

export default Login;
