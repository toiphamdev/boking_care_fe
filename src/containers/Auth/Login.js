import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";


import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services';
import { userLoginFail, userLoginSuccess } from '../../store/actions';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errMessage: '',
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value,
        })
    }
    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value,
        })
    }
    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            } else {
                this.props.userLoginSuccess(data.user);
                console.log('login success')
            }
        } catch (e) {
            this.setState({
                errMessage: e.response.data.message
            })
        }
    }

    handleKeyDown = (e)=>{
        if(e.key === 'Enter'){
            this.handleLogin();
        }
    }


    render() {
        return (
            <div className='loginBackground'>
                <div className='loginContainer'>
                    <div className='container'>
                        <div className='loginContent raw'>
                            <div className='col-12 textLogin'>Login</div>
                            <div className='col-12 form-group loginInput'>
                                <label>User name</label>
                                <input
                                    value={this.state.username}
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter your username ...'
                                    onChange={event => this.handleOnChangeUsername(event)}
                                />
                            </div>
                            <div className='col-12 form-group loginInput'>
                                <label>Password</label>
                                <input
                                    value={this.state.password}
                                    type='password'
                                    className='form-control'
                                    placeholder='Enter your password ...'
                                    onChange={event => this.handleOnChangePassword(event)}
                                    onKeyDown={e=>this.handleKeyDown(e)}
                                />
                            </div>
                            <div className='col-12' style={{ color: 'red' }}>
                                {this.state.errMessage}
                            </div>
                            <button className='btnLogin mt-3' onClick={this.handleLogin}>Login</button>
                            <div className='col-12'>
                                <span>Forgot your password</span>
                            </div>
                            <div className='col-12 text-center mt-3'>
                                <span>Or login with</span>
                                <div className='socialLogin d-flex'>
                                    <div className='iconLogin'>
                                        <i className="fab fa-google-plus-g google"></i>
                                    </div>
                                    <div className='iconLogin'>
                                        <i className="fab fa-facebook-f facebook"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
        userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
