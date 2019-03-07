import React, { Component } from "react";
import { Icon } from 'antd';
import { GetApi } from '../../Base/api';
import Fetch from '../../Base/base';

class HistoryRecord extends Component {
    static defaultProps = {
        id: '',
    }
    constructor(props) {
        super(props);
        this.state = {
            arrowDown: true,
            plus: true,
            historyArr: [],
            id: "",
        }
    }
    componentDidMount() {
        this.setState({ id: this.props.Id }, () => {
            this._initHistoryData();
        })
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps);
    //     this.setState({ id: nextProps.Id }, () => {
    //         this._initHistoryData()
    //     });
    // }
    //初始化历史数据

    _initHistoryData() {
        Fetch(GetApi('GetEntityHistory'), { ID: this.state.id }, { method: 'GET' }).then((res) => {
            if (res.Code === '0') {
                console.log("_initHistory", res.Result);
                this.setState({ historyArr: res.Result });
            }
        })
    }

    _initHistoryHtml(item, index) {
        let note1 = '创建'
        if (index > 0 && item.propertyid !== 'Note') {
            note1 = '修改'
        }
        if (item.propertyid === 'Note') {

        }
    }
    // _removeHTMLTag(str) {
    //     str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    //     str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //     //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    //     str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
    //     return str;
    // }
    // _html2Escape(sHtml) {
    //     return sHtml.replace(/[<>&"]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]; });
    // }
    // _htmlEncode(html) {
    //     var temp = document.createElement("div");
    //     (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    //     var output = temp.innerHTML;
    //     temp = null;
    //     return output;
    // }
    // 点击箭头
    handleSortArrow = () => {
        this.setState({
            arrowDown: !this.state.arrowDown,
            historyArr: this.state.historyArr.reverse()
        })

    }
    // 点击+展开
    handleExpandPlus = () => {
        this.setState({
            plus: !this.state.plus
        })
    }


    render() {
        return (
            <div style={{ border: "1px solid #ccc", padding: 5 }}>
                <h4>历史记录 <Icon type={this.state.arrowDown ? 'arrow-down' : 'arrow-up'} theme="outlined" className="test-history-icon" onClick={this.handleSortArrow} /> <Icon className="test-history-icon" type={this.state.plus ? 'plus' : 'minus'} onClick={this.handleExpandPlus} theme="outlined" /></h4>
                <ul>
                    {this.state.historyArr.map((item, index) => {
                        return (
                            <li key={index}>
                                {this.state.arrowDown ? index + 1 : this.state.historyArr.length - index}.{item.changeTime},由 <span style={{ fontWeight: "bold" }}>{item.name}</span>
                                {
                                    item.note ? (
                                        < span>
                                            <span>添加备注</span> <span dangerouslySetInnerHTML={{ __html: item.note.substring(3, item.note.length - 4) }}></span>
                                        </span>
                                    ) : (< span >{index === 0 ? '创建' : '修改'} </span>)}

                                < div className={this.state.plus ? 'test-history-div-plus' : 'test-history-div-plus test-history-div-minus'}>
                                    {item.historyList.map((val, i) => {
                                        return (<p key={i} style={{ textIndent: "5px" }}>修改了 <span style={{ fontWeight: "bold", fontStyle: "italic" }}>{val.propertyname}</span>
                                            <p style={{ color: '#32CD32' }}>旧值为:</p>
                                            <span dangerouslySetInnerHTML={{ __html: val.oldtext }}></span>
                                            <p style={{ color: '#FF8C00' }}>新值为:</p>
                                            <span dangerouslySetInnerHTML={{ __html: val.newtext }}></span></p>)
                                    })}
                                </div>

                            </li>
                        )
                    })}
                </ul>
            </div >
        )
    }
}
export default HistoryRecord