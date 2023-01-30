import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { languages } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { getExtraInfor } from '../../../services/userService';
import NumberFormat from 'react-number-format';

import './DoctorExtraInfor.scss';




class DoctorExtraInfor extends Component {
    constructor(props){
        super(props);
        this.state={
            isShowDetailInfor: false,
            extraInfor:{}
        }
    }
    async componentDidMount(){
        if(this.props.detailDoctorId && this.props.detailDoctorId !== -1){
            let res = await getExtraInfor(this.props.detailDoctorId);
            if(res && res.errCode === 0){
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }


    async componentDidUpdate(prevProps,prevState){
        if(prevProps.detailDoctorId !== this.props.detailDoctorId){
            let res = await getExtraInfor(this.props.detailDoctorId);
            if(res && res.errCode === 0){
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }
    
    handleShowDetailInfor = ()=>{
        this.setState({
            isShowDetailInfor:!this.state.isShowDetailInfor
        })
    }


    render() {
        let {isShowDetailInfor,extraInfor} = this.state;
        let {language} = this.props;
        return(
            <div className='doctor-extra-infor-container'>
                <div className='content-up>'>
                    <h3 className='content-title'><FormattedMessage id="admin.manage-doctor.extra-infor.price"/></h3>
                    <h3 className='content-subtitle'>{extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic:'' }</h3>
                    <p>{extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic:'' }</p>
                </div>
                <div className={isShowDetailInfor?'content-down':'content-down d-flex'}>
                    <h3 className='content-title'>
                       <FormattedMessage id="admin.manage-doctor.extra-infor.price"/>
                        {
                            !isShowDetailInfor && 
                            <span>
                                {   
                                    extraInfor && extraInfor.priceData &&
                                    (language === languages.VI ? 
                                    <NumberFormat 
                                        value={+extraInfor.priceData.valueVi} 
                                        displayType={'text'} 
                                        thousandSeparator={true} 
                                        suffix={' VNĐ'} 
                                    />:
                                    <NumberFormat 
                                        value={+extraInfor.priceData.valueEn} 
                                        displayType={'text'} 
                                        thousandSeparator={true} 
                                        suffix={'$'} 
                                    />)
                                }
                            </span>
                        } 
                    </h3>
                    {
                        isShowDetailInfor && 
                        <div className='detail-price'>
                            <div className='price-wrapper'>
                                <div className='price'>
                                    <span> <FormattedMessage id="admin.manage-doctor.extra-infor.price"/></span>
                                    <span>
                                        {   
                                            extraInfor && extraInfor.priceData &&
                                            (language === languages.VI ? 
                                            <NumberFormat 
                                                value={+extraInfor.priceData.valueVi} 
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                suffix={'VNĐ'} 
                                            />:
                                            <NumberFormat 
                                                value={+extraInfor.priceData.valueEn} 
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                suffix={'$'} 
                                            />)
                                        }
                                    </span>
                                </div>
                                <div className='note'>
                                    {extraInfor && extraInfor.note ? extraInfor.note : ''}
                                </div>
                            </div>

                            <div className='detail-content'>
                                <p>
                                    <FormattedMessage id="admin.manage-doctor.extra-infor.price-content"/>
                                    <span>{extraInfor && extraInfor.paymentData ?(language === languages.VI ? extraInfor.paymentData.valueVi:extraInfor.paymentData.valueEn):'' }</span>
                                </p>
                            </div>
                        </div>
                    }
                    <span className='btn-display' onClick={()=>this.handleShowDetailInfor()}>
                        {
                            isShowDetailInfor ? <FormattedMessage id="admin.manage-doctor.extra-infor.detail-none"/>:
                            <FormattedMessage id="admin.manage-doctor.extra-infor.detail-display"/>
                        }
                    </span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
