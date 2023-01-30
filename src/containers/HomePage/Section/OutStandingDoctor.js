import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { languages } from '../../../utils';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';


class OutStandingDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: []
        }

    }

    componentDidMount() {
        this.props.loadTopDoctors()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.topDoctorRedux !== this.props.topDoctorRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorRedux
            })
        }

    }

    handleViewDetailDoctor = (item)=>{
        if(this.props.history){
            this.props.history.push(`/detail-doctor/${item.id}`);
        }
    }

    render() {
        let language = this.props.language;
        let arrDoctors = this.state.arrDoctors;
        return (
            <Fragment>
                <div className='section-share'>
                    <div className='section-title'>
                        <h3><FormattedMessage id="home-page.outstanding-doctor" /></h3>
                        <button><FormattedMessage id="home-page.more-info" /></button>
                    </div>
                    <div className='section-content'>
                        <Slider {...this.props.settings}>
                            {
                                arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {
                                    let imageBase64 = ''
                                    if (item.image) {
                                        imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                    }
                                    return (
                                        <div key={index} className='section-body section-outstanding-doctor' onClick={()=> this.handleViewDetailDoctor(item)}>
                                            <div className='section-img section-outstanding-doctor' style={{ backgroundImage: `url(${imageBase64})` }}></div>
                                            <div className='text-center section-sub-title'>
                                                <h3>{language === languages.EN ? `${item.positionData.valueEn},${item.lastName} ${item.firstName}` : `${item.positionData.valueVi},${item.firstName} ${item.lastName}`}</h3>
                                                <h4>
                                                    <span>{item.DoctorInfor && item.DoctorInfor.specialtyData ? item.DoctorInfor.specialtyData.name :''}</span>
                                                </h4>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </Slider>
                    </div>
                </div>
            </Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorRedux: state.admin.topDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fechTopDoctors())
    };
};

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
