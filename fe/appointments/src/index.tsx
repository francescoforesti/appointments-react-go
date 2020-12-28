import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {HashRouter, Link} from "react-router-dom";
import Layout, {Content, Footer, Header} from "antd/es/layout/layout";
import {Menu} from "antd";

ReactDOM.render(
    <React.StrictMode>
        <HashRouter>
            <Layout>
                <Header style={{background: '#001529', height: '6vh'}}>
                    <Menu mode="horizontal" theme="dark">
                        <Menu.Item key="list">
                            <Link to="/table">
                                Table
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="calendar">
                            <Link to="/calendar">
                                Calendar
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{height: '88vh'}}>
                    <App/>
                </Content>
                <Footer style={{background: '#001529', height: '6vh', color: 'white'}}>Footer</Footer>
            </Layout>
        </HashRouter>

    </React.StrictMode>,
    document.getElementById('root')
)
;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
