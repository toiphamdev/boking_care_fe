import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import { USER_ROLE } from '../utils';

import Header from '../containers/Header/Header';
import UserInfo from '../containers/System/UserInfo';

const bcrypt = require('bcryptjs');


class Patient extends Component {
    render() {
        const { isLoggedIn ,patientMenuPath,userInfo } = this.props;
        let patient = bcrypt.compareSync(USER_ROLE.PATIENT,userInfo.roleId);
        return (
            <Fragment>
                {isLoggedIn && <Header />}
                < div className="system-container" >
                    <div className="system-list">
                        {
                            patient && 
                            <Switch>
                                <Route path="/patient/profile" component={UserInfo} />
                                <Route component={() => { return (<Redirect to={patientMenuPath} />) }} />
                            </Switch>
                        }
                    </div>
                </div >
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
       started: state.app.started,
        patientMenuPath: state.app.patientMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Patient);
