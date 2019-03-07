
import Common from './common';  

/**
 * fetch超时处理 由于原生的Fetch API 并不支持timeout属性，如果项目中需要控制fetch请求的超时时间，可以对fetch请求进一步封装实现timeout功能
 * 让fetch也可以timeout
 *  timeout不是请求连接超时的含义，它表示请求的response时间，包括请求的连接、服务器处理及服务器响应回来的时间
 * fetch的timeout即使超时发生了，本次请求也不会被abort丢弃掉，它在后台仍然会发送到服务器端，只是本次请求的响应内容被丢弃而已
 * @param {Promise} fetch_promise    fetch请求返回的Promise
 * @param {number} [timeout=60000]   单位：毫秒，这里设置默认超时时间为1fenzhong
 * @return 返回Promise
 */
function timeout_fetch(fetch_promise, timeout = 60000) {
    let timeout_fn = null;

    //这是一个可以被reject的promise
    let timeout_promise = new Promise(function (resolve, reject) {
        timeout_fn = function () {
            reject('连接超时');
        };
    });

    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    let abortable_promise = Promise.race([
        fetch_promise,
        timeout_promise
    ]);

    setTimeout(function () {
        timeout_fn();
    }, timeout);

    return abortable_promise;
}

/**
 * @param {string} url 接口地址
 * @param {string} method 请求方法：GET、POST，只能大写
 * @param {JSON} [params=''] body的请求参数，默认为空
 * @param {object} setting 扩展参数
 * @return 返回Promise
 */
function fetchRequest(path, params = '', setting) {
    if (!localStorage.getItem('Common'))
    {
        localStorage.clear();  
        window.location.href="#/Login"  
    }
    let url = path;

    let options = Object.assign({
        //credentials: 'include',
        method: 'POST',
        Authorization: true,
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json;charset=UTF-8"
        }
    }, setting);

    let paramsArray = [];
    if (params) {//如果网络请求中带有参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + (typeof params[key] == 'string' ? params[key] : JSON.stringify(params[key]))));
    }

    if (options.method.toUpperCase() === 'GET') {
        if (params) {//如果网络请求中带有参数
            url += (url.search(/\?/) === -1 ? '?' : '&') + paramsArray.join('&');
        }
        console.log(options.method.toUpperCase(), 'request url:', url);  //打印请求参数
    }
    else {
        if (!options.body) {
            if (options.formData) {
                options.body = paramsArray.join('&');
            }
            else {
                options.body = JSON.stringify(params);
            }
        }
        console.log(options.method.toUpperCase(), 'request url:', url, options.body);  //打印请求参数
    }

    if (options.Authorization) {
        const userInfoState = JSON.parse(localStorage.getItem('Common'));
        const pass = userInfoState && userInfoState.timestamp && (new Date().getTime() - userInfoState.timestamp) <=  24*60 * 60 * 1000;
 
        if (pass === false) {
            localStorage.clear();  
            window.location.href="#/Login"  
        }
        if (Common.Token.access_token) {
            options.headers.Authorization = Common.Token.token_type + " " + Common.Token.access_token
        }
    }


    return new Promise(function (resolve, reject) {
        let sendTime = new Date();
        timeout_fetch(fetch(url, options))
            .then((response) => {   
                console.log('request 耗时' + ((new Date()).getTime() - sendTime.getTime()) / 1000 + '秒！');
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    let text = '', textStatus = response.statusText, status = response.status;
                    if (textStatus === 'timeout') {
                        text = '服务器连接超时,请稍后重试！';
                    } else if (textStatus === 'error') {
                        text = '服务器连接错误，请联系管理员！[' + response.state + ']';
                    } else if (textStatus === 'parsererror') {
                        text = '服务器解析错误，请联系管理员！';
                    } else if (textStatus === 'abort') {
                        console.log('服务器,中止请求');
                    } else if (status === '404') {
                        text = '服务器无法回应且不知原因(' + status + ')';
                    } else {
                        try {
                            return response.json();
                        }
                        catch (err) {
                            text = '请求服务器异常[' + response.status + (textStatus ? '---' + textStatus : '') + ']';
                        }
                    }
                    throw text;
                }
            })
            .then((responseData) => {
                console.log('request success:', url, responseData);   //网络请求成功返回的数据

                if (responseData) { resolve(responseData); }

            })
            .catch((err) => {                 
                console.log('request err:', url, err);   //网络请求失败返回的数据         
                reject(err);
                if (err.toString() === "TypeError: Failed to fetch")
                {
                    localStorage.clear();  
                    window.location.href="#/Login"  
                }
            })

    });
}



export default fetchRequest;