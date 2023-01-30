import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { getAllClinic } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import './MedicalFacility.scss'
import _ from 'lodash';

class Medicalfacility extends Component {

    constructor (props){
        super(props);
        this.state={
            clinics:[]
        }
    }

    async componentDidMount(){
        let res = await getAllClinic();
        this.setState({
            clinics: res.data
        })
    }

    render() {
        let {clinics} = this.state;
        return (
            <div className='section-share'>
                <div className='section-title'>
                    <h3><FormattedMessage id="home-page.medical-facility" /></h3>
                    <button><FormattedMessage id="home-page.more-info" /></button>
                </div>
                <div className='section-content'>
                    <Slider {...this.props.settings}>
                        {
                            clinics && !_.isEmpty(clinics)&&
                            clinics.map((item,index)=>{
                                return(
                                    <Link to={`/detail-clinic/${item.id}`} key={index}>
                                        <div className='section-body'>
                                            <div 
                                                className='section-img section-medical-facility'
                                                style={{ backgroundImage: `url(${item.image? item.image:''})` }}
                                            ></div>
                                            <h3>{item.name}</h3>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </Slider>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Medicalfacility);
