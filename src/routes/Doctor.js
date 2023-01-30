import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import Header from '../containers/Header/Header';
import UserInfo from '../containers/System/UserInfo';
import { USER_ROLE } from '../utils';

const bcrypt = require('bcryptjs');

class Doctor extends Component {
    render() {
        const { isLoggedIn,doctorMenuPath,userInfo } = this.props;
        let doctor = bcrypt.compareSync(USER_ROLE.DOCTOR,userInfo.roleId);
        return (
            <Fragment>
                {isLoggedIn && <Header />}
                < div className="system-container" >
                    <div className="system-list">
                        <Switch>
                                <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                        {
                            doctor &&
                            <>
                                <Route path="/doctor/manage-patient" component={ManagePatient} />
                                <Route path="/doctor/profile" component={UserInfo} />
                                <Route component={() => { return (<Redirect to={doctorMenuPath} />) }} />
                            </>
                        }
                        </Switch>
                    </div>
                </div >
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        doctorMenuPath: state.app.doctorMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
