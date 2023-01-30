import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';

import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import UserInfo from '../containers/System/UserInfo';
import { USER_ROLE } from '../utils';

const bcrypt = require('bcryptjs');

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn,userInfo } = this.props;
        let admin = bcrypt.compareSync(USER_ROLE.ADMIN,userInfo.roleId);
        return (
            <Fragment>
                {isLoggedIn && <Header />}
                < div className="system-container" >
                    <div className="system-list">
                        {
                            admin &&
                            <Switch>
                                <Route path="/system/profile" component={UserInfo} />
                                <Route path="/system/user-manage" component={UserManage} />
                                <Route path="/system/user-redux" component={UserRedux} />
                                <Route path="/system/doctor-manage" component={ManageDoctor} />
                                <Route path="/system/manage-specialty" component={ManageSpecialty} />
                                <Route path="/system/manage-clinic" component={ManageClinic} />
                                <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                            </Switch>
                        }
                    </div>
                </div >
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        started: state.app.started,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
