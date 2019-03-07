import React, { Component } from "react";
import { Icon, Spin, Button, Message } from 'antd';
import { GetApi } from '../../Base/api';
import Fetch from '../../Base/base';
import Editor from '../../Components/Editor'
import Common from "../../Base/common";

class NewHistoryRecord extends Component {
    static defaultProps = {
        dataSource: [],
    }
    constructor(props) {
        super(props);
        this.state = {
            arrowDown: true,
            plus: true,
            historyArr: [],
            loading: true,
            indexClick: '',
            indexList: [],
            iconTitle: 'edit',
            isShowEdit: true,//点击+号不显示文本框，点击编辑才显示文本框
        }
        this.isAllPlus = true;
        this.EditorNote = null;
    }
    componentDidMount() {
        if (this.props.dataSource) {
            this.props.dataSource.forEach(function (item, index) {
                item.plus = true
                item.index = index
            })
        }

        this.setState({ historyArr: this.props.dataSource, loading: false });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.dataSource !== nextProps.dataSource) {

            if (nextProps.dataSource) {
                nextProps.dataSource.forEach(function (item, index) {
                    item.plus = true
                    item.index = index
                })
            }
            this.setState({ historyArr: nextProps.dataSource, loading: false });
        }

    }
    //历史记录详细信息
    _historyDetailInfo(item, index) {
        return (
            <div className='showHistoryDetail'>
                {item.historyList.map((val, i) => {
                    return (<div key={i} style={{ textIndent: "2px" }}>修改了 <span style={{ fontWeight: "bold", fontStyle: "italic" }}>{val.propertyname}</span>
                        <p style={{ color: '#32CD32' }}>旧值为:</p>
                        <span style={{ wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: val.oldtext }}></span>
                        <p style={{ color: '#FF8C00' }}>新值为:</p>
                        <span style={{ wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: val.newtext }}></span></div>)
                })}
            </div>
        )
    }
    //获取关键字操作
    _getKeyOperate(item) {
        for (let history of item.historyList) {
            if (history.propertyid === 'BugStatus' && history.newtext === '已解决') {
                return '解决，解决方案为' + this._getItemHistoryByProperty(item, 'Solution')
            }
            else if (history.propertyid === 'ReleaseState' && history.newvalue === '1') {
                return '发布'
            }
            else if (history.propertyid === 'ProductState' && history.newvalue === '2') {
                return '关闭'
            }
            else if (history.propertyid === 'ProductState' && history.newvalue === '1') {
                return '激活'
            }
            else if (history.propertyid === 'AssignmentState' && history.newvalue === '2') {
                return '开始'
            }
            else if (history.propertyid === 'AssignmentState' && history.newvalue === '3') {
                return '完成'
            }
            else if (history.newtext === '激活' || history.newtext === '关闭' || history.newtext === '发布'
                || history.newtext === '延期' || history.newtext === '挂起' || history.newtext === '完成' ||
                history.newtext === '开始' || history.newtext === '挂起' || history.newtext === '发布') {
                return history.newtext
            }
            else if (history.newtext === '有待确认') {
                return '记录评审结果，结果为有待确认'
            }
            else if (history.newtext === '评审驳回') {
                return '记录评审拒绝，结果为 驳回拒绝'
            }
            else if (history.newtext === '评审通过') {
                return '记录评审通过，结果为 确认通过'
            }
        }
        //指派人最后匹配
        for (let history of item.historyList) {
            if (history.propertyname === '指派人') {
                return '指派给 ' + history.newtext
            }
        }
        return "修改"
    }
    /**
     *根据属性获取对应的值
     *
     * @param {*} item 某一条历史记录
     * @param {*} propertyid  历史记录详情里面的属性
     * @returns
     * @memberof NewHistoryRecord
     */
    _getItemHistoryByProperty(item, propertyid) {
        for (let history of item.historyList) {
            if (history.propertyid === propertyid) {
                return history.newtext;
            }
        }
        return '';
    }
    /**
     *显示备注描述
     *
     * @param {*} item历史记录单个对象
     * @param {*} index当前索引
     * @memberof NewHistoryRecord
     */
    _initNoteDesc(item, index) {
        return (item.note && item.note !== '<p></p>') ? (
            <span>
                <span>添加备注：</span> <span style={{ wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: item.note.substring(3, item.note.length - 4) }}></span>
                {
                    (index === (this.state.historyArr.length - 1) && item.name === Common.StaffName) ?
                        <Button type='danger' icon={this.state.iconTitle} size='small' style={{ height: 20, float: "right" }} onClick={this.handleEditNote.bind(this, item)}></Button>
                        : null
                }
            </span>
        ) : (<span style={{ display: 'inline' }}>{index === 0 ? '创建' : this._getKeyOperate(item)}</span>)
    }
    // 点击+展开
    handleExpandPlus = () => {
        this.isAllPlus = !this.isAllPlus;
        let isAllPlus = this.isAllPlus
        this.state.historyArr.forEach(function (cItem, index) {
            cItem.plus = isAllPlus;
        })
        this.setState({ isShowEdit: false, plus: this.isAllPlus, historyArr: this.state.historyArr })
    }

    // 点击每行+展开
    handleIndexExpandPlus = (item, e) => {
        this.setState({ iconTitle: 'edit' });
        this.state.historyArr.forEach(function (cItem, index) {
            if (item['index'] === index) {
                cItem.plus = !cItem.plus;
            }
        })
        this.setState({ isShowEdit: false, historyArr: this.state.historyArr });
    }
    /**
     *修改备注
     *
     * @memberof NewHistoryRecord
     */
    handleEditNote = (item, e) => {
        this.setState({ isShowEdit: true, historyArr: this.state.historyArr }, function () {
            //修改备注
            if (this.state.iconTitle === 'edit') {
                this.setState({ iconTitle: 'save' })
                this.EditorNote && this.EditorNote.setValue(item.note)
            }
            //保存备注
            else {
                this.setState({ iconTitle: 'edit' })
                item.note = this.EditorNote.getValue()
                Fetch(GetApi('UpdateEntityHistoryNote'), item).then(res => {
                    if (res.Code !== '0') {
                        Message.error(res.Message);
                    }
                })
            }
            this.state.historyArr.map((cItem, index) => {
                if (item['index'] === index) {
                    cItem.plus = !cItem.plus;
                }
            })
        });
    }

    render() {
        return (
            <Spin spinning={this.state.loading}>
                <div style={{ border: "1px solid #C8C8C8", padding: 5, lineHeight: '22px' }}>
                    <h4>历史记录 <Icon className="test-history-icon" type={this.state.plus ? 'plus' : 'minus'} onClick={this.handleExpandPlus} theme="outlined" /></h4>
                    <ul>
                        {this.state.historyArr.map((item, index) => {
                            return (
                                <li key={index}>
                                    {this.state.arrowDown ? index + 1 : this.state.historyArr.length - index}.{item.changeTime},由 <span style={{ fontWeight: "bold" }}>{item.name}</span>
                                    {this._initNoteDesc(item, index)}
                                    <div style={{ display: 'inline' }} key={index + 1}
                                        className={this.state.historyArr[index].plus ? 'test-history-div-plus' : 'test-history-div-plus test-history-div-minus'}>
                                        {
                                            item.historyList.length > 0 ? <Icon className="test-history-icon" type={this.state.historyArr[index].plus ? 'plus' : 'minus'}
                                                onClick={this.handleIndexExpandPlus.bind(this, item)} theme="outlined" />
                                                : null
                                        }
                                        {
                                            (item.note && item.note !== '<p></p>' && this.state.isShowEdit) ?
                                                <div className='editHistoryDetail'>
                                                    <Editor Style={{ height: "200px" }} ref={(m) => { this.EditorNote = m; }}></Editor>
                                                    <Button style={{ marginTop: 5, marginBottom: 5 }} type='primary' onClick={this.handleEditNote.bind(this, item)}>保存</Button>
                                                    <Button type='primary' style={{ marginTop: 5, marginBottom: 5, marginLeft: 10 }} onClick={this.handleIndexExpandPlus.bind(this, item)}>返回</Button>
                                                </div> : this._historyDetailInfo(item)
                                        }
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div >
            </Spin>

        )
    }
}
export default NewHistoryRecord