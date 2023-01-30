import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { languages } from '../../../../utils';
import { FormattedMessage } from 'react-intl';
import { Button, ModalHeader, ModalFooter, ModalBody, Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import './BookingModal.scss';
import Select from 'react-select';
import * as actions from '../../../../store/actions';
import DatePicker from '../../../../components/Input/DatePicker';
import { bookingSchedule } from '../../../../services';
import _ from 'lodash';
import { toast } from 'react-toastify';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';
import localization from 'moment/locale/vi';





class BookingModal extends Component {
    constructor(props){
        super(props);
        this.state={
            fullName:'',
            phoneNumber:'',
            address:'',
            email:'',
            selectedGender:'',
            birthday:'',
            reason:'',
            doctorId:'',
            genders:'',
            timeType:'',
            patientId:'',
            isShowLoading:false
        }
    }
    componentDidMount(){
        let {userInfo,dataTime} = this.props;
        this.props.getGenderStart();
        if(userInfo && !_.isEmpty(userInfo)){
            console.log('check patient',userInfo)
            this.setState({
                email: userInfo.email,
                fullName:`${userInfo.firstName} ${userInfo.lastName}`,
                patientId: userInfo.id
            })
        }
        if(this.props.dataTime && !_.isEmpty(dataTime)){
            this.setState({
                doctorId: dataTime.doctorId,
                timeType: dataTime.timeType
            })
    }
    }


    componentDidUpdate(prevProps,prevState){
        if(prevProps.userInfo !== this.props.userInfo){
            let {userInfo} = this.props;
            if(userInfo && !_.isEmpty(userInfo)){
                this.setState({
                    email: userInfo.email,
                    fullName:`${userInfo.firstName} ${userInfo.lastName}`,
                    patientId: userInfo.id
                })
            }
        }
        if(prevProps.genderRedux !== this.props.genderRedux || prevProps.language !== this.props.language){
            this.setState({
                genders: this.buildDataSelect(this.props.genderRedux)
            })
        }
        if(prevProps.dataTime !== this.props.dataTime){
            if(this.props.dataTime && !_.isEmpty(this.props.dataTime)){
                this.setState({
                    doctorId: this.props.dataTime.doctorId,
                    timeType: this.props.dataTime.timeType
                })
            }
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    
    handleBookingSchedule = async()=>{
        let date = new Date(this.props.dataTime.date).getTime() ;
        let birthday = new Date(this.state.birthday).getTime() ;
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.builDataName(this.props.dataTime);
        if(this.props.isLoggedIn){
            this.setState({
                isShowLoading: true
            })
            let res = await bookingSchedule({
                language: this.props.language,
                fullName:this.state.fullName,
                phoneNumber:this.state.phoneNumber,
                address:this.state.address,
                email:this.state.email,
                selectedGender:this.state.selectedGender,
                date:date,
                birthday: birthday,
                reason:this.state.reason,
                doctorId:this.state.doctorId,
                timeType: this.state.timeType,
                timeString: timeString,
                doctorName: doctorName
            });
            if(res && res.errCode === 0 ){
                toast.success(res.errMessage);
                this.props.closeModal();
                this.setState({
                    isShowLoading:false
                })
            }else{
                toast.error(res.errMessage)
            }
        }else{
            if(this.props.history){
                this.props.history.push('/login');
            }
        }
    }

    handleOnchangeInput = (e,type)=>{
        let coppyState = {...this.state};
        coppyState[type] = e.target.value;
        this.setState({
            ...coppyState
        })
    }

    buildDataSelect = (inputData)=>{
        let result = [];
        inputData.map((item)=>{
            let object = {};
            let labelEN = item.valueEn;
            let labelVI = item.valueVi;
            object.label = this.props.language === languages.EN ? labelEN:labelVI;
            object.value = item.keyMap;
            result.push(object);
        })
        return result;
    }

    handleChangeSelection = (selectedOption)=>{
        this.setState({
            selectedGender: selectedOption
        })
    }

    handleOnchangeDatePicker = (date)=>{
        this.setState({
            birthday: date[0]
         })
    }

    buildTimeBooking = (dataTime)=>{
        let {language} = this.props;
        if(dataTime && !_.isEmpty(dataTime)){
            let date = language === languages.VI ?  
            moment(new Date(dataTime.date)).format('dddd - DD/MM/YYYY'):
            moment(new Date(dataTime.date)).locale('en').format('ddd - DD/MM/YYYY');
            let timeSchedule = language === languages.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            return `${timeSchedule} - ${this.capitalizeFirstLetter(date)}`;
        }
        return '';
    }

    builDataName = (dataTime)=>{
        let {language} = this.props;
        if(dataTime && !_.isEmpty(dataTime)){
            let name =  language === languages.EN ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`:
            `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            return name;
        }
        return '';
    }

    render() {
        let {closeModal,dataTime} = this.props;
        return(
            <>
                {
                    this.state.isShowLoading && 
                    <LoadingOverlay
                        active={true}
                        spinner
                        text={<FormattedMessage id="menu.doctor.loading-data"/>}
                    >
                        <p>Some content or children or something.</p>
                    </LoadingOverlay>
                }
                < Modal
                    isOpen={true}
                    size="lg"
                    centered
                    className='bookingModalContainer'
                >
                    <ModalHeader
                        toggle={() => {closeModal() }}
                    >
                        <FormattedMessage id="patient.booking-modal.title"/>
                    </ModalHeader>
                    <ModalBody>
                        <div className='row'>
                            <div className='doctor-info col-12'>
                                <ProfileDoctor 
                                    doctorId={dataTime.doctorId}
                                    isShowDescription={false}
                                    isShowPrice={true}
                                    dataTime={dataTime}
                                />
                            </div>
                            <div className='form-group col-6'>
                                <label><FormattedMessage id="patient.booking-modal.full-name"/></label>
                                <input 
                                    className='form-control'
                                    value={this.state.fullName}
                                    onChange = {(e)=> this.handleOnchangeInput(e,'fullName')}
                                />
                            </div>
                            <div className='form-group col-6'>
                                <label><FormattedMessage id="patient.booking-modal.phone-number"/></label>
                                <input 
                                    className='form-control'
                                    value={this.state.phoneNumber}
                                    onChange = {(e)=> this.handleOnchangeInput(e,'phoneNumber')}
                                />
                            </div>
                            <div className='form-group col-6'>
                                <label><FormattedMessage id="patient.booking-modal.address"/></label>
                                <input 
                                    className='form-control'
                                    value={this.state.address}
                                    onChange = {(e)=> this.handleOnchangeInput(e,'address')}
                                />
                            </div>
                            <div className='form-group col-6'>
                                <label><FormattedMessage id="patient.booking-modal.email"/></label>
                                <input readOnly value={this.state.email} className='form-control'/>
                            </div>
                            <div className='form-group col-6'>
                                <label><FormattedMessage id="patient.booking-modal.gender"/></label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelection}
                                    options={this.state.genders}
                                    placeholder={<FormattedMessage id="patient.booking-modal.gender"/>}
                                />
                            </div>
                            <div className='form-group col-6'>
                                <label><FormattedMessage id="patient.booking-modal.birthday"/></label>
                                <DatePicker
                                    onChange={this.handleOnchangeDatePicker}
                                    className = 'form-control'
                                    value = {this.state.birthday}
                                />
                            </div>
                            <div className='form-group col-12'>
                                <label><FormattedMessage id="patient.booking-modal.reason"/></label>
                                <textarea 
                                    className='form-control'
                                    value={this.state.reason}
                                    onChange = {(e)=> this.handleOnchangeInput(e,'reason')}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            className='px-3'
                            color="primary"
                            onClick={() => { this.handleBookingSchedule() }}
                        >
                            <FormattedMessage id="patient.booking-modal.confirm-btn"/>
                        </Button>
                        {' '}
                        <Button
                            onClick={() => { closeModal() }}
                            className='px-3'
                        >
                            <FormattedMessage id="patient.booking-modal.cancel-btn"/>
                        </Button>
                    </ModalFooter>
                </Modal >
            </>
        )
        
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        genderRedux: state.admin.genders,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fechGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
