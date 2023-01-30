import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSchedule.scss';
import * as actions from '../../../store/actions';
import Select from 'react-select';
import { languages } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import _ from 'lodash';
import { toast } from 'react-toastify';



class ManageSchedule extends Component {
    constructor(props){
        super(props);
        this.state={
            selectedDoctor:{},
            selectedDate: '',
            rangeTime:[]
        }
    }

    buildDataSelect = (inputData)=>{
        let result = [];
        inputData.map((item)=>{
            let object = {};
            let labelEN = `${item.lastName} ${item.firstName}`;
            let labelVI = `${item.firstName} ${item.lastName}`;
            object.label = this.props.language === languages.VI ? labelVI:labelEN;
            object.value = item.id;
            result.push(object);
        })
        return result;
    }

    componentDidMount(){
       this.props.fetchAllDoctors();
       this.props.getAllSchedules('TIME');
    }

    componentDidUpdate(prevProps){
        if(prevProps.doctors !== this.props.doctors || prevProps.language !== this.props.language){
            let data = this.buildDataSelect(this.props.doctors);
            this.setState({
                doctors: data
            })
        }
        if(prevProps.scheduleTime !== this.props.scheduleTime){
            let data =  this.props.scheduleTime;
            if(data && data.length>0){
                data = data.map(item=>{
                    return ({
                        ...item,
                        isSelected:false
                    })
                })
            }
            this.setState({
                rangeTime: data
            })
        }
    }

    handleChange = (selectedDoctor) => {
        this.setState({ 
            selectedDoctor:selectedDoctor
         }
        );
    };

    handleOnchangeDatePicker = (date)=>{
        this.setState({
            selectedDate: date[0]
        })
    }

    handleSelectedTime = (time)=>{
        let {rangeTime} = this.state;
        if(rangeTime && rangeTime.length>0){
            rangeTime.map((item)=>{
                if(item.id === time.id){
                    item.isSelected = !item.isSelected;
                }
                return item;
            })
        }
        this.setState({
            rangeTime:rangeTime
        })

    }

    handleSaveSchedule = async()=>{
        let {rangeTime,selectedDate,selectedDoctor} = this.state;
        // let fomatedDate = moment(selectedDate).format(dateFormat.SEND_TO_SERVER);
        // let fomatedDate = moment(selectedDate).unix();
        let fomatedDate = new Date(selectedDate).getTime();
        let result = [];
        if(selectedDoctor && _.isEmpty(selectedDoctor)){
            toast.error('Isvalid doctor!');
        }
        if(!selectedDate){
            toast.error('Isvalid date!');
        }
        if(rangeTime && rangeTime.length>0){
            let selectedTime = rangeTime.filter((item)=>item.isSelected === true);
            if(selectedTime && selectedTime.length>0){
                let object = {};
                selectedTime.map((time)=>{
                    object = {
                        doctorId: selectedDoctor.value,
                        date: fomatedDate,
                        timeType: time.keyMap
                    }
                    result.push(object);
                })
            }else{
                toast.error('Isvalid schedule!');
            }
        }

        await this.props.saveBulkScheduleDoctor({
            arrSchedule:[...result],
            date:fomatedDate,
            doctorId: selectedDoctor.value,
        });

    }

    render() {
        let {rangeTime} = this.state;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
        return (
            <Fragment>
                <div className='manage-schedule-container'>
                    <div className='m-s-title'>
                        <FormattedMessage id='manage-schedule.title' />
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id='manage-schedule.choose-doctor'/></label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChange}
                                    options={this.state.doctors}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id='manage-schedule.choose-date'/></label>
                                <DatePicker
                                    onChange={this.handleOnchangeDatePicker}
                                    className = 'form-control'
                                    value = {this.state.selectedDate}
                                    minDate = {yesterday}
                                />
                            </div>
                            <div className='col-12 pick-hours-container'>
                                {
                                    rangeTime && rangeTime.length>0 &&
                                    rangeTime.map((item,index)=>{
                                        return (
                                            <button 
                                                className={item.isSelected ? 'range-time-btn active': 'range-time-btn' }
                                                key={index}
                                                onClick ={()=>this.handleSelectedTime(item)}
                                            >
                                                <span>
                                                {this.props.language === languages.EN ? item.valueEn : item.valueVi}
                                                </span>
                                            </button>
                                        )
                                    })
                                }
                            </div>
                            <button 
                                className='btn btn-primary px-3'
                                onClick={()=>this.handleSaveSchedule()}
                            >
                                <FormattedMessage id='manage-schedule.save'/>
                            </button>
                        </div>
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
        doctors: state.admin.doctors,
        scheduleTime: state.admin.scheduleTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors : ()=> dispatch(actions.fechAllDoctors()),
        getAllSchedules : (type)=> dispatch(actions.getAllSchedule(type)),
        saveBulkScheduleDoctor: (data)=>dispatch(actions.saveBulkSchedule(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
