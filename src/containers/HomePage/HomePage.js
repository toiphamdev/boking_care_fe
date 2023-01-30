import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/MedicalFacility';
import OutStandingDoctor from './Section/OutStandingDoctor';
import Handbook from './Section/HandBook';
import HomeFooter from './HomeFooter';
import About from './Section/About';
import './HomePage.scss'

class HomePage extends Component {

    render() {
        let settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
        };
        return (
            <Fragment>
                <HomeHeader isShowBanner={true} />
                <Specialty
                    settings={settings}
                />
                <MedicalFacility
                    settings={settings}
                />
                <OutStandingDoctor
                    settings={settings}
                />
                <Handbook
                    settings={{
                        ...settings,
                        slidesToScroll: 2
                    }} />
                <About />
                <HomeFooter />
            </Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
