import React, { Component, Fragment } from 'react';
import { Table, Button, Modal, Select, Input, DatePicker, Layout, Divider, Message } from 'antd'
import Fetch from '../../../Base/base'
import { GetApi } from '../../../Base/api';
import SelectUserAll from '../../VersionPlan/SelectUserAll'
import Common from '../../../Base/common'
import '../../../index.css'
import SqlConfirm from './SqlConfirm'
import BasicDataController from '../BasicDataController'

const Option = Select.Option
const Content = Layout.Content
const btnGroup = [
  {
    sendVal: '',
    value: '全部'
  },
  {
    sendVal: '1',
    value: '由我创建'
  },
  {
    sendVal: '2',
    value: '指派给我'
  },
  {
    sendVal: '3',
    value: '审核中',
    itemKey: '1'
  },
  {
    sendVal: '4',
    value: '执行通过',
    itemKey: '2'
  },
  {
    sendVal: '5',
    value: '驳回',
    itemKey: '4'
  }
]
const buttonAuths = { displayName: 'SqlHandle', arr: ['create', 'assign', 'view', 'delete', 'edit'] };//按钮初始化
class SqlScriptList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prodDefaultValue: null,
      prodListJsonData: null,
      btnGroup: btnGroup,//操作按钮
      isShowsearch: false,
      sqlSid: '',//选择的脚本SID
      sourceBranchId: '',
      branchListJsonData: [],
      sqlStatusJsonData: null,
      btnCurrent: '',
      data: {
        list: [],
        pagination: this.pagination
      },
      confirmVisible: false,
      selBranchName: '',//选择的公司
      sqlStatus: null,
      designateId: null,
      creatorId: null,
      startDate: null,
      endDate: null,
      clientHeight: document.getElementById('root').clientHeight - 225,
      buttonEnable: Common.getButtonJurisdiction(buttonAuths),
    }
    this.operate = Common.getUrlParam(this.props.location.search, 'op')//是新打开，创建脚本成功还是返回到该页面
    this.currentRecord = {}//当前选择的记录
  }
  columns = [
    {
      title: 'ID',
      key: 'SId',
      dataIndex: 'SId'
    },
    {
      title: '脚本描述',
      key: 'Desc',
      dataIndex: 'Desc',
      className: 'bug-title-width title-max-width-400',
      render: (item, record) => {
        if (this.state.buttonEnable["view"]) {
          return (<a title={record.Desc} className='text-active' name='view' onClick={this.handleOperate.bind(this, record)}>{record.Desc}</a>)
        }
        else {
          return <span title={record.Desc}>{record.Desc}</span>
        }
      }
    },
    {
      title: '提交人',
      key: 'Creator',
      dataIndex: 'Creator'
    },
    {
      title: '分公司',
      key: 'BranchName',
      dataIndex: 'BranchName'
    },
    {
      title: '指派给',
      key: 'DesignateName',
      dataIndex: 'DesignateName'
    },
    {
      title: '创建时间',
      key: 'CreateTime',
      dataIndex: 'CreateTime',
      render: (index, item) => {
        return item.CreateTime ? item.CreateTime.substring(0, 10) : '';
      }
    },
    {
      title: '状态',
      key: 'StatusName',
      dataIndex: 'StatusName'
    },
    {
      title: '操作',
      key: 'operate',
      render: (text, record) => (
        <Button.Group type="ghost">
          <Button disabled={this._initbuttonDisabled(record, 'edit')} icon='edit' name='edit' title='编辑' onClick={this.handleOperate.bind(this, record)}></Button>
          <Button disabled={this._initbuttonDisabled(record, 'delete')} icon="delete" name='delete' title='删除' onClick={this.handleOperate.bind(this, record)}></Button>
          <Button disabled={this._initbuttonDisabled(record, 'assign')} icon='right-square' name='designate' title='指派' onClick={this.handleOperate.bind(this, record)}></Button>
        </Button.Group>
      )
    }
  ]
  pagination = {
    total: 0,
    current: 1,
    pageSize: 10,
    showTotal: (total) => {
      return `共 ${total} 条数据`;
    },
  }
  componentDidMount() {
    BasicDataController.QueryDictItem(this._initDictItemList.bind(this), { DictCode: 'SqlScriptingType' });
    this._getBranchList();
    if (this.operate !== 'back') {
      sessionStorage.setItem('exactQuery', '')
      sessionStorage.setItem('groupQuery', '')
    }
    else {
      if (sessionStorage.getItem('exactQuery')) {
        let exactQuery = JSON.parse(sessionStorage.getItem('exactQuery'));
        this.setState({
          sqlSid: exactQuery.SId, selBranchId: exactQuery.BranchID,
          sqlStatus: exactQuery.SqlStatus,
          startDate: exactQuery.StartTime, endDate: exactQuery.EndTime,
          creatorId: exactQuery.CreatorID, designateId: exactQuery.DesignateID
        });
      }
      else if (sessionStorage.getItem('groupVal')) {
        this.setState({ btnCurrent: sessionStorage.getItem('groupVal') })
      }
    }
    this._initProdList();
  }
  /**
   *根据前台查询条件拼接成后台查询条件
   *
   * @param {*} newParams
   * @returns
   * @memberof SqlScriptList
   */
  _replaceQueryParams(newParams) {
    let queryParams = [
      { "Name": "ProductID", "Value": null },
      { "Name": "SqlStatus", "Value": null },
      { "Name": "SId", "Value": null },
      { "Name": "BranchID", "Value": null },
      { "Name": "DesignateID", "Value": null },
      { "Name": "CreatorID", "Value": null },
      { "Name": "StartTime", "Value": null },
      { "Name": "EndTime", "Value": null }
    ]
    for (let [key, value] of Object.entries(newParams)) {
      for (let query of queryParams) {
        if (query.Name === key) {
          query.Value = value
        }
      }
    }
    return queryParams
  }
  _initDictItemList(sqlStatusList) {
    if (!sessionStorage.getItem('sqlStatus')) {
      sessionStorage.setItem('sqlStatus', '');
    }
    this.setState({ sqlStatusJsonData: sqlStatusList, sqlStatusDefaultValue: sessionStorage.getItem('sqlStatus') });
  }
  _initbuttonDisabled(item, operate) {
    //创建者自身可以点击编辑按钮
    if (operate === 'delete') {
      return !this.state.buttonEnable[operate] || item.SqlStatus !== '4' || (item.DesignateID && !item.DesignateID.includes(Common.Id))
    }
    //只有拥有查看权限的人都可以点击
    else if (operate === 'view') {
      return !this.state.buttonEnable[operate]
    }
    //指派人和当前登录着不一致按钮变为不可用
    return !this.state.buttonEnable[operate] || (item.DesignateID && !item.DesignateID.includes(Common.Id))
  }
  _getBranchList = () => {
    //远程输入获取公司信息
    Fetch(GetApi('QueryErpBranchName'), null, { method: 'GET' }).then((data) => {
      if (data.Code === '0') {
        this.setState({ branchListJsonData: data.Result })
      }
    })
  }
  /**
   *初始化产品列表
   *
   * @memberof SqlScriptList
   */
  _initProdList() {
    Fetch(GetApi('getteamname'), { Id: Common.Id }, { method: 'GET' }).then((res) => {
      if (res.Result.length > 0) {
        this.setState({
          prodListJsonData: res.Result,
        });
        if (!sessionStorage.getItem('productId')) {
          sessionStorage.setItem('productId', res.Result[0].Id);
        }
        this.setState({
          prodDefaultValue: sessionStorage.getItem('productId')
        }, () => {
          this._querySqlList();
        });

      }
    });
  }
  /**
   *查询sql脚本
   *
   * @memberof SqlScriptList
   */
  _querySqlList() {
    this.setState({ loading: true })
    console.log('_querySqlList', this.pagination)
    let apiUrl = `${GetApi('GetSqlscriptingAll')}&isPaged=true&pageIndex=${this.pagination.current}&pageSize=${this.pagination.pageSize}`
    let params = { 'ProductID': sessionStorage.getItem('productId') }
    if (sessionStorage.getItem('groupQuery') !== '') {
      params = { ...params, ...JSON.parse(sessionStorage.getItem('groupQuery')) }
    }
    if (sessionStorage.getItem('exactQuery') !== '') {
      params = { ...params, ...JSON.parse(sessionStorage.getItem('exactQuery')) }
    }
    params = this._replaceQueryParams(params);
    Fetch(apiUrl, params).then((res) => {
      this.pagination.total = res.Result.RecordCount
      this.setState({
        loading: false,
        data: { list: res.Result.ResultSet, pagination: this.pagination }
      });
    });
  }
  //清空按钮查询条件
  _clearBtnGroup() {
    sessionStorage.setItem('groupQuery', '');
    sessionStorage.setItem('groupVal', '')
    this.setState({ btnCurrent: '' });
  }
  //清空详细查询条件
  _clearTxtQuery() {
    sessionStorage.setItem('exactQuery', '');
    this.setState({
      sqlSid: null, selBranchId: null, startDate: null, endDate: null,
      creatorId: null, designateToId: null, SqlStatus: null
    });
  }
  _deleteSqlScript(id) {
    Fetch(GetApi('DeleteSqlScripting'), { Id: id }).then((res) => {
      if (res.Code === '0') {
        Message.success('脚本删除成功')
        this._querySqlList()
      }
      else {
        Message.error(res.Message);
      }
    })
  }
  /**
   *跳转到详情页面
   *
   * @param {*} record
   * @memberof SqlScriptList
   */
  _viewSqlScript(record) {
    let url = {
      pathname: '/Main/SqlHandle/SqlScriptEdit',
      search: `?sqlId=${record.ID}&isEdit=false`,
      prodListJsonData: this.state.prodListJsonData,
    }
    this.props.history.push(url)
  }
  /**
  *跳转到详情页面
  *
  * @param {*} record
  * @memberof SqlScriptList
  */
  _editSqlScript(record) {
    let url = {
      pathname: '/Main/SqlHandle/SqlScriptEdit',
      search: `?sqlId=${record.ID}&isEdit=true`,
      prodListJsonData: this.state.prodListJsonData,
    }
    this.props.history.push(url)
  }
  /**
   *产品选择后查询sql脚本
   *
   * @memberof SqlScriptList
   */
  handleProdSelectChange = (val) => {
    this.setState({ prodDefaultValue: val })
    this._clearBtnGroup();
    this._clearTxtQuery();
    sessionStorage.setItem('productId', val)
    this._querySqlList();
  }
  /**
   *新增脚本处理
   *
   * @memberof SqlScriptList
   */
  handleAddSql = () => {
    let url = {
      pathname: '/Main/SqlHandle/SqlScriptAdd',
      prodListJsonData: this.state.prodListJsonData,
    }
    this.props.history.push(url)
  }
  handleBtnGroup = (item) => {
    this._clearTxtQuery();
    this.setState({ btnCurrent: item.sendVal })
    sessionStorage.setItem('groupVal', item.sendVal);
    sessionStorage.setItem('groupQuery', '');
    if (item.sendVal === '1') {
      sessionStorage.setItem('groupQuery', JSON.stringify({ 'CreatorID': Common.Id }));
    }
    else if (item.sendVal === '2') {
      sessionStorage.setItem('groupQuery', JSON.stringify({ 'DesignateID': Common.Id }));
    }
    if (item.sendVal === '3' || item.sendVal === '4' || item.sendVal === '5') {
      sessionStorage.setItem('groupQuery', JSON.stringify({ 'SqlStatus': item.itemKey }));
    }
    this._querySqlList();
  }
  /**
   *下拉框选择
   *
   * @memberof SqlScriptList
   */
  handleSelectChange = (operate, val) => {
    this.setState({ [operate]: val })
  }
  //日期选择
  handleDateChange = (operate, date, dateString) => {
    this.setState({ [operate]: dateString })
  }
  handleSearch = () => {
    this._clearBtnGroup();
    sessionStorage.setItem('exactQuery', JSON.stringify({
      'SId': this.state.sqlSid !== '' ? this.state.sqlSid : null, 'BranchID': this.state.selBranchId !== '' ? this.state.selBranchId : null,
      'SqlStatus': this.state.sqlStatus !== '' ? this.state.sqlStatus : null,
      'StartTime': this.state.startDate !== '' ? this.state.startDate : null, 'EndTime': this.state.endDate !== '' ? this.state.endDate : null,
      'CreatorID': this.state.creatorId !== '' ? this.state.creatorId : null, 'DesignateID': this.state.designateId !== '' ? this.state.designateId : null
    }));
    this._querySqlList();
  }
  /**
  *表格分页触发的方法
  *
  * @memberof OrgUserList
  */
  handleTableChange = (pagination, filtersArg, sorter) => {
    // const params = {
    //   currentPage: pagination.current,
    //   pageSize: pagination.pageSize,
    // }
    this.pagination.current = pagination.current
    this.pagination.pageSize = pagination.pageSize
    this._querySqlList()
  }
  handleOperate = (record, e) => {
    let operate = e.target.name
    switch (operate) {
      case "view":
        this._viewSqlScript(record)
        break;
      case "edit":
        this._editSqlScript(record)
        break;
      case "delete":
        Modal.confirm({
          title: '删除脚本',
          content: '确定删除该脚本？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this._deleteSqlScript(record.ID)
        })
        break;
      case "designate":
        this.currentRecord = record
        this.setState({ confirmVisible: true })
        break;
      default:
        console.log('handleOperate', e.target.name);
    }
  };
  /**
  *操作区域
  *
  * @returns
  * @memberof OrgUserList
  */
  renderQuery() {
    const { prodDefaultValue, prodListJsonData, btnGroup, isShowsearch, sqlSid, selBranchId, branchListJsonData, sqlStatusJsonData, sqlStatus } = this.state
    return (
      <Fragment>
        <div className="test-nav">
          <ul style={{ float: "left" }}>
            <li>
              {
                (prodDefaultValue && prodListJsonData) ?
                  <Select value={prodDefaultValue} style={{ width: 150 }} onChange={this.handleProdSelectChange}>
                    {prodListJsonData.map((item) => <Select.Option key={item.Id} value={item.Id}>{item.ProductName}</Select.Option>)}
                  </Select> :
                  <Select style={{ width: 150 }}></Select>
              }

            </li>
            {btnGroup.map((item, index) => {
              return (<li className={this.state.btnCurrent === item.sendVal ? 'text-active' : ''} key={item.sendVal}
                onClick={this.handleBtnGroup.bind(this, item)}><a>{item.value}</a></li>)
            })}
            <li>
              <Button type="primary" shape="circle" icon='search' onClick={() => { this.setState({ isShowsearch: !isShowsearch }) }}></Button>
            </li>
          </ul>
          <div style={{ float: "right", display: "inline" }}>
            <Button type="primary" icon="plus-square" onClick={this.handleAddSql}>创建脚本处理</Button>
          </div>
        </div>
        <div className="test-nav" style={{ display: isShowsearch ? 'block' : 'none' }}>
          <ul style={{ float: "left" }}>
            <li><Input style={{ width: 60 }} placeholder='ID' autoComplete="off" value={sqlSid} onChange={(e) => { this.setState({ sqlSid: e.target.value }) }} /></li>
            <li>
              <Select style={{ width: 250 }} key='selBranchId' placeholder="分公司" allowClear={true}
                value={selBranchId ? selBranchId : undefined} showSearch optionFilterProp="children"
                onChange={this.handleSelectChange.bind(this, "selBranchId")}>
                {branchListJsonData.map((item, i) => {
                  return (
                    <Option key={item.BRANCHID} value={item.BRANCHID}>{item.ORGNAME}</Option>
                  )
                })}
              </Select>
            </li>
            <li>
              {
                sqlStatusJsonData ?
                  <Select style={{ width: 120 }} key='sqlStatus' placeholder="脚本状态" allowClear={true}
                    value={sqlStatus ? sqlStatus : undefined}
                    onChange={this.handleSelectChange.bind(this, 'sqlStatus')}>
                    {sqlStatusJsonData.map((item, i) => {
                      return (
                        <Option key={item.DictitemCode} value={item.DictitemCode}>{item.DictitemName}</Option>
                      )
                    })}
                  </Select> : <Select></Select>
              }

            </li>
            <li>
              <SelectUserAll placeholder="由谁创建" setUserID={this.state.creatorId} onSelectedItem={this.handleSelectChange.bind(this, 'creatorId')} />
            </li>
            <li>
              <SelectUserAll placeholder="指派给" setUserID={this.state.designateId} onSelectedItem={this.handleSelectChange.bind(this, 'designateId')} />
            </li>
            <li><DatePicker placeholder='开始时间' key='startDate' defaultValue={this.state.startDate} onChange={this.handleDateChange.bind(this, 'startDate')} /></li>
            <li><DatePicker placeholder='结束时间' key='endDate' defaultValue={this.state.endDate} onChange={this.handleDateChange.bind(this, 'endDate')} /></li>
            <li><Button type="primary" icon="search" onClick={this.handleSearch}>查询</Button></li>
          </ul>
        </div>
      </Fragment>
    )
  }
  render() {
    const { data: { list, pagination } } = this.state
    const parentMethods = {
      onCancel: () => { this.setState({ confirmVisible: false }) },
      onSubmit: () => { this.setState({ confirmVisible: false }, () => { this._querySqlList() }) },
    };
    const parentInfos = {
      sqlSid: this.currentRecord.SId,
      sqlBranchName: this.currentRecord.BranchName,
      sqlId: this.currentRecord.ID,
    }
    return (
      <Content style={{ padding: '0 10px 10px' }}>
        <h3 style={{ margin: '10px 0' }}>脚本处理</h3>
        {this.renderQuery()}
        <div>
          <Divider style={{ margin: 0 }}></Divider>
        </div>
        <Layout style={{ padding: '10px 5px', background: '#fff' }}>
          {/* 表格 */}
          <Content style={{ minHeight: 280, height: this.state.clientHeight, overflowY: 'auto', overflowX: 'hidden' }}>
            <Table className='productTableName' columns={this.columns} loading={this.state.loading} bordered
              dataSource={list} pagination={pagination}
              size="small"
              rowKey={row => row.ID} onChange={this.handleTableChange} />
          </Content>
        </Layout>
        <SqlConfirm
          visible={this.state.confirmVisible}
          {...parentInfos}
          {...parentMethods}
        />
      </Content>
    );
  }
}

export default SqlScriptList;