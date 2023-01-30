import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import "./Specialty.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { getAllSpecialty } from '../../../services';

class Specialty extends Component {
    constructor(props){
        super(props);
        this.state={
            specialties:''
        }
    }

    async componentDidMount(){
        let res = await getAllSpecialty();
        if(res && res.errCode===0){
            this.setState({
                specialties: res.data
            })
        }
    }

    handleViewDetailSpecialty = (item)=>{
        if(this.props.history){
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let {specialties}= this.state;
        return (
            <div className='section-share'>
                <div className='section-title'>
                    <h3><FormattedMessage id="home-page.specialty-popular"/></h3>
                    <button><FormattedMessage id="home-page.more-info"/></button>
                </div>
                <div className='section-content'>
                    <Slider {...this.props.settings}>
                        {
                            specialties.length>0 &&
                            specialties.map((item,index)=>{
                                return(
                                    <div className='section-body' key={index}  onClick={()=> this.handleViewDetailSpecialty(item)}>
                                        <div 
                                            className='section-img section-specialty'
                                            style={{ backgroundImage: `url(${item.image? item.image:''})` }}
                                        ></div>
                                        <h3>{item.name}</h3>
                                    </div>
                                )
                            })
                        }

                    </Slider>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
