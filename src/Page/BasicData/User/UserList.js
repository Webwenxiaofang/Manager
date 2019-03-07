import React from 'react';
import Fetch from '../../../Base/base';
import { GetApi } from '../../../Base/api';
import { Message, Table, Button, Popconfirm } from 'antd';
import UserView from './UserView';
import '../BasicData.css';

class UserList extends React.Component {
  static defaultProps = {
    staffList: [],
    total: 0,
    pagesize: 20
  }
  constructor(props) {
    super(props);
    //console.log(this.props.aaa);
    this.state = {
      history: this.props.history,
      visible: false,
      userObj: {},
      //pagination: {},
    };
  }
  //查看按钮
  handleView = (obj) => {
    this.setState({ userObj: obj, visible: true });
  }
  //关闭按钮
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleEdit(obj) {
    let path = "/Main/BasicData/User/UserEditor";
    let url = {
      pathname: path,
      state: {
        editTarget: { obj },
      }
    }
    this.state.history.push(url);
  }
  handleDel(user) {
    Fetch(GetApi('DeleteUser'), { id: user.Id }, { method: 'GET' })
      .then((data) => {
        if (data.Code === '0') {
          Message.success('删除用户成功');
          if (this.props.onRefresh) {
            this.props.onRefresh();
          }
        }
        else {
          Message.error(data.Message);
        }
      })
  }
  render() {
    console.log(this);
    let { buttonDisabled } = this.props;
    let pagination = {
      total: this.props.total,
      defaultCurrent: 1,
      pageSize: this.props.pagesize,
      current: this.props.current,
      // showSizeChanger: true,
      onChange: (current, pageSize) => {
        this.props.onRefresh({ current: current, pagesize: pageSize })
      },
      showTotal: (total) => {
        return `共 ${total} 条数据`;
      },
    };
    const columns = [
      {
        title: 'ID',
        key: 'SId',
        dataIndex: 'SId'

      },
      {
        title: '真实姓名',
        key: 'StaffName',
        dataIndex: 'StaffName'

      },
      {
        title: '用户名',
        key: 'StaffNO',
        dataIndex: 'StaffNO',
        render: (index, item) => {
          if (buttonDisabled["view"]) {
            return (<a className='text-active' onClick={this.handleView.bind(this, item)}>{item.StaffNO}</a>)
          }
          else {
            return item.StaffNO;
          }
        }
      },
      {
        title: '所属部门',
        key: 'DeptName',
        dataIndex: 'DeptName'
      },
      {
        title: '性别',
        key: 'Sex',
        dataIndex: 'Sex'
      },
      {
        title: '联系方式',
        key: 'Mobile',
        dataIndex: 'Mobile'
      },
      {
        title: 'ZIY码',
        key: 'StaffID',
        dataIndex: 'StaffID'
      },
      {
        title: '最后登录',
        key: 'LastLoginTime',
        dataIndex: 'LastLoginTime',
        render: (index, item) => {
          return item.LastLoginTime ? item.LastLoginTime.replace("T", " ") : '';
        }
      },
      {
        title: '访问次数',
        key: 'LoginCount',
        dataIndex: 'LoginCount'
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Button.Group type="ghost">
              <Button disabled={!buttonDisabled["edit"]} icon="edit" type="primary" onClick={() => this.handleEdit(record)}></Button>
              {
                buttonDisabled["delete"] ?
                  <Popconfirm disabled={false} title="确定要删除吗？" onConfirm={() => this.handleDel(record)}>
                    <Button disabled={false} icon="delete" type="dashed" ></Button>
                  </Popconfirm>
                  : <Button disabled={true} icon="delete" type="dashed" ></Button>
              }
            </Button.Group>
          );
        }
      }
    ]
    return (
      <div>
        <Table columns={columns} dataSource={this.props.staffList} pagination={pagination}
          loading={this.state.loading} rowKey={row => row.Id} size='small' />
        <UserView
          onOk={this.handleCancel}
          userObj={this.state.userObj}
          visible={this.state.visible}
        />
      </div>

    );
  }
}

export default UserList;