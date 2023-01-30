import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { getDoctorProfile } from '../../../services/userService';
import { languages } from '../../../utils';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { Link } from 'react-router-dom';
import localization from 'moment/locale/vi';
import './ProfileDoctor.scss'
import _ from 'lodash';





class ProfileDoctor extends Component {
    constructor(props){
        super(props);
        this.state={
            doctorProfile:{},
            isShowPrice:false,
            isShowProvince:false,
        }
    }
    async componentDidMount(){
        let data = await this.getDoctorInfo(this.props.doctorId)
        this.setState({
            doctorProfile: data
        })
        if(this.props.isShowPrice){
            this.setState({
                isShowPrice : true
            })
        }
        if(this.props.isShowProvince){
            this.setState({
                isShowProvince:true
            })
        }
    }


    async componentDidUpdate(prevProps,prevState){
        if(prevProps.doctorId !== this.props.doctorId){
            let data = await this.getDoctorInfo(this.props.doctorId)
            this.setState({
                doctorProfile: data
            })
        }
    }
    
    getDoctorInfo = async(id)=>{
        let result = {}
       if(id){
            let res = await getDoctorProfile(id);
            if(res && res.errCode === 0){
                result = res.data
            }
        }
        return result;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    renderTimeBooking = (dataTime)=>{
        let {language} = this.props;
        if(dataTime && !_.isEmpty(dataTime)){
            let date = language === languages.VI ?  
            moment(new Date(dataTime.date)).format('dddd - DD/MM/YYYY'):
            moment(new Date(dataTime.date)).locale('en').format('ddd - DD/MM/YYYY');
            let timeSchedule = language === languages.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            return (
                <>
                    <div>{timeSchedule} - {this.capitalizeFirstLetter(date)}</div>
                    <span><FormattedMessage id="patient.booking-modal.book-fee"/></span>
                </>
            )
        }
        return <></>
    }

    render() {
        let {doctorProfile} = this.state;
        let {language,isShowDescription,dataTime,isShowLinkDetail,doctorId} = this.props;
        let nameVi = '';
        let nameEn = '';
        if(doctorProfile && doctorProfile.positionData){
            nameVi = `${doctorProfile.firstName} ${doctorProfile.lastName}`;
            nameEn = `${doctorProfile.lastName} ${doctorProfile.firstName}`;
        }
        return(
           <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div 
                        className='content-left'
                        style={{ backgroundImage: `url(${doctorProfile.image? doctorProfile.image:''})` }}
                    >
                    </div>
                    <div className='content-right'>
                        {
                           doctorProfile && doctorProfile.Markdown && 
                            <>
                                <h3 className='content-right-title'>
                                    {
                                        this.props.language === languages.VI?`${doctorProfile.positionData.valueVi} ${nameVi}`:`${doctorProfile.positionData.valueEn} ${nameEn}`
                                    }
                                </h3> 
                                {
                                    isShowDescription ?
                                    <p className='content-right-content'>{doctorProfile.Markdown.description}</p>:
                                    <>
                                        {this.renderTimeBooking(dataTime)}
                                    </>
                                }
                            </>
                        }
                    </div>
                </div>
                {
                    this.state.isShowPrice &&
                    <div className='price'>
                        <span>
                            <FormattedMessage id="admin.manage-doctor.price" />
                            : {
                                doctorProfile && doctorProfile.DoctorInfor && doctorProfile.DoctorInfor.priceData ?
                                (language === languages.VI ?<NumberFormat 
                                            value={+doctorProfile.DoctorInfor.priceData.valueVi} 
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            suffix={' VNĐ'} 
                                        />:
                                        <NumberFormat 
                                            value={+doctorProfile.DoctorInfor.priceData.valueEn} 
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            suffix={' $'} 
                                        />):''
                            }
                        </span>
                    </div>
                }
                {
                    this.state.isShowProvince &&
                    <div className='province'>
                        <span><i className="fas fa-map-marker-alt"></i></span>
                        {
                            doctorProfile.DoctorInfor && doctorProfile.DoctorInfor.provinceData?
                            <span>{language === languages.VI ? doctorProfile.DoctorInfor.provinceData.valueVi: doctorProfile.DoctorInfor.provinceData.valueEn}</span>:''
                        }
                    </div>
                }
                {
                    isShowLinkDetail === true && 
                    <div className='link-detail'>
                        <Link className='link-detail-to' to={`/detail-doctor/${doctorId}`}><FormattedMessage id="home-page.more-info"/></Link>
                    </div>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
