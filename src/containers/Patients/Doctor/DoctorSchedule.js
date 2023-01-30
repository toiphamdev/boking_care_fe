import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import moment from 'moment';
import * as actions from '../../../store/actions';
import localization from 'moment/locale/vi';
import { languages } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { history } from '../../../redux';
import BookingModal from './Modal/BookingModal';
import './DoctorSchedule.scss';


const customStyles = {
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'red' : '#337ab7',
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
    
        return { 
            ...provided,
             opacity, 
             transition,
             color: '#337ab7',
             fontWeight:600,
             fontSize: 14
             };
      }
    
  }


class DoctorSchedule extends Component {
    constructor(props){
        super(props);
        this.state={
            allDays:[],
            doctorScheduleTime:[],
            selectedDate:'',
            isOpenModal: false,
            modalInforSchedule:{}
        }
    }
    async componentDidMount(){
        let {language}= this.props;
        let arrDates = this.convertDays(language);
        this.setState({
            allDays: arrDates
        });
        if(this.props.detailDoctorId && this.props.detailDoctorId !== -1){
            await this.props.getDoctorScheduleTime(this.props.detailDoctorId,this.state.selectedDate.value);
            this.setState({
                doctorScheduleTime: this.props.doctorScheduleTime
            })
        }
    }

    convertDays = (language)=>{
        let arrDates = [];
        for(let i = 0; i<7;i++){
            let object = {}
            let ddMM = moment(new Date()).format('DD/MM');
            if(language === languages.VI){
                if(i===0){
                    let today = `Hôm nay - ${ddMM}`;
                    object.label = today;
                }else{
                    let labelVi =  moment(new Date()).add(i,'days').format('dddd - DD/MM');
                    object.label = this.capitalizeFirstLetter(labelVi)
                }
            }else{
                if(i===0){
                    let today = `Today - ${ddMM}`;
                    object.label = today;
                }else{
                    object.label = moment(new Date()).locale('en').add(i,'days').format('ddd - DD/MM');
                }
            }
            object.value = moment(new Date()).add(i,'days').startOf('day').valueOf();
            arrDates.push(object);
        }
        
        return arrDates;
    }

    async componentDidUpdate(prevProps,prevState){
        if(prevProps.language !== this.props.language){
            let arrDates = this.convertDays(this.props.language);
            this.setState({
                allDays: arrDates
            })
        }
        if(this.props.detailDoctorId && this.props.detailDoctorId !== -1 && !this.state.selectedDate){
            this.setState({
                selectedDate: this.state.allDays[0],
            })
        }
        if(prevState.selectedDate !== this.state.selectedDate){
            if(this.props.detailDoctorId && this.props.detailDoctorId !== -1){
                await this.props.getDoctorScheduleTime(this.props.detailDoctorId,this.state.selectedDate.value);
                this.setState({
                    doctorScheduleTime: this.props.doctorScheduleTime
                })
            }
        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    handleChange = (selectedDate) => {
        this.setState({ 
            selectedDate:selectedDate
         }
        );
    };

    handleOpenModal = (item)=>{
        this.setState({
            isOpenModal: true,
            modalInforSchedule: item
        })
    }

    handleCloseModal = ()=>{
        this.setState({
            isOpenModal: false
        })
    }


    render() {
        let {doctorScheduleTime,isOpenModal} = this.state;
        return (
            <Fragment>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <Select
                            className='schedule-select-btn'
                            styles={customStyles}
                            options={this.state.allDays}
                            value={this.state.selectedDate}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calender'>
                            <span>
                                <i className="fas fa-calendar-alt"></i>
                                <FormattedMessage id="patient.detail-doctor.schedule" />
                            </span>
                        </div>
                        <div className='time-content-container'>
                            <div className='time-content'>
                                {
                                    doctorScheduleTime && doctorScheduleTime.length>0 ?
                                    doctorScheduleTime.map((item,index)=>{
                                        return(
                                            <button
                                                className={this.props.language === languages.VI?'btn-vi':'btn-en'}
                                                onClick={()=>this.handleOpenModal(item)} 
                                                key={index}
                                            >
                                                {this.props.language === languages.VI? item.timeTypeData.valueVi: item.timeTypeData.valueEn}
                                            </button>
                                        )
                                    }): <h5><FormattedMessage id='patient.detail-doctor.no-schedule'/></h5>

                                }
                            </div>
                            {
                                doctorScheduleTime && doctorScheduleTime.length>0 &&
                                <div className='time-content-fee'>
                                <span>
                                    <FormattedMessage id='patient.detail-doctor.choose'/> 
                                     <i className="fas fa-hand-point-up"></i>  
                                     <FormattedMessage id='patient.detail-doctor.book'/>
                                </span>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                {isOpenModal && <BookingModal closeModal={this.handleCloseModal} dataTime={this.state.modalInforSchedule} history={history} />}
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        doctorScheduleTime : state.admin.doctorScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDoctorScheduleTime: (doctorId,date)=> dispatch(actions.getDoctorSchedule(doctorId,date))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
