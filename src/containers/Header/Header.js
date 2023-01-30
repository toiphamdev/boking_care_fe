import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu, patientMenu } from './menuApp';
import './Header.scss';
import { languages,USER_ROLE  } from '../../utils';
import _ from 'lodash';

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);


class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            menuApp:[]
        }
    }

    async componentDidMount(){
        let {userInfo} = this.props;
        if(userInfo && !_.isEmpty(userInfo)){
            let admin = await bcrypt.compareSync(USER_ROLE.ADMIN,userInfo.roleId);
            let doctor = await bcrypt.compareSync(USER_ROLE.DOCTOR,userInfo.roleId);
            let patient = await bcrypt.compareSync(USER_ROLE.PATIENT,userInfo.roleId);
            if(admin){
                this.setState({
                    menuApp: adminMenu
                })
            }
            if(doctor){
                this.setState({
                    menuApp: doctorMenu
                })
            }
            if(patient){
                 this.setState({
                    menuApp: patientMenu
                })
            }
        }
    }

    changeLaguage = (lang) => {
        this.props.changeLaguageAppRedux(lang)
    }

    render() {
        const { processLogout, userInfo } = this.props;
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>


                {/* nút logout */}
                <div className='languages'>
                    <span className='welcome'>
                        <FormattedMessage id="home-header.welcome" />
                        {
                            userInfo ?
                                ((userInfo.firstName && userInfo.lastName) ? userInfo.firstName + ' ' + userInfo.lastName :
                                    ((userInfo.firstName && !userInfo.lastName) ? userInfo.firstName :
                                        ((!userInfo.firstName && userInfo.lastName) ? userInfo.lastName : ""))) : ""
                        }
                    </span>
                    <span className={this.props.language == languages.EN ? 'language-en active' : 'language-en'} onClick={() => this.changeLaguage(languages.EN)}>EN</span>
                    <span className={this.props.language == languages.VI ? 'language-vi active' : 'language-vi'} onClick={() => this.changeLaguage(languages.VI)}>VN</span>
                    <div className="btn btn-logout" onClick={processLogout} title="Log out">
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLaguageAppRedux: (lang) => dispatch(actions.changeLaguageApp(lang))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
