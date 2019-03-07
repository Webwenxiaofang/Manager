import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import PmpRouter from './Page/Router';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';



ReactDOM.render(<LocaleProvider locale={zh_CN}><PmpRouter ></PmpRouter></LocaleProvider>,document.getElementById('root'));

serviceWorker.unregister();
