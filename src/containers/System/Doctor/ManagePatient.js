import React, { Component } from 'react';
import { connect } from "react-redux";
import DatePicker from '../../../components/Input/DatePicker';
import { getListPatientForDoctor } from '../../../services';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { languages } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import { confirmScheduleForDoctor } from '../../../services';
import LoadingOverlay from 'react-loading-overlay';
import './ManagePatient.scss'





class ManagePatient extends Component {
    constructor(props){
        super(props);
        this.state={
            selectedDate:moment(new Date()).add(0,'days').startOf('day')._d,
            patientData:{},
            isOpenModal: false,
            selectedPatient:{},
            isShowLoading: false
        }
    }
    async componentDidMount(){
        if(this.props.userInfo && this.props.userInfo.id){
            this.getPatientData(this.props.userInfo.id,this.state.selectedDate)
        }
    }


    async componentDidUpdate(prevProps,prevState){
        if(prevState.selectedDate !== this.state.selectedDate){
            if(this.props.userInfo && this.props.userInfo.id){
                this.getPatientData(this.props.userInfo.id,this.state.selectedDate);
            }
        }
    }

    getPatientData = async(doctorId,selectedDate)=>{
        console.log(selectedDate)
        let res = await getListPatientForDoctor({
                doctorId: doctorId,
                date: selectedDate ? selectedDate.getTime():''
            });
        if(res && res.errCode===0){
            this.setState({
                patientData: res.data
            })
        }
    }

    handleOnchangeDatePicker = (date)=>{
        this.setState({
            selectedDate: date[0]
        })
    }
    
    handleConfirm = (item)=>{
        this.setState({
            isOpenModal: true,
            selectedPatient: item,
        })
    }

    handleCloseModal = ()=>{
        this.setState({
            isOpenModal:false
        })
    }

    handleSendRemedy = async(imageBase64)=>{
        this.setState({
            isShowLoading:true
        })
        let patient = this.state.selectedPatient;
        let date = new Date(patient.date);
        let res = await confirmScheduleForDoctor({
            email:patient.patientData.email,
            patientFirstName:patient.patientData.firstName,
            patientLastName:patient.patientData.lastName,
            patientId:patient.patientId,
            timeType:patient.timeType,
            doctorId:patient.doctorId,
            date: date.getTime(),
            imageBase64:imageBase64,
            language:this.props.language
        })
        if(res && res.errCode === 0){
            toast.success('Confirm this schedule success!');
            this.handleCloseModal();
            this.getPatientData(patient.doctorId,date);
            this.setState({
                isShowLoading:false
            })
        }else{
            toast.error('Schedule not found')
        }
    }

    render() {
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        let {patientData,isOpenModal} = this.state;
        let {language} = this.props;
        return(
            <div className='manage-patient-container'>
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
                <h3 className='m-p-title'>Quản lí bệnh nhân khám bệnh</h3>
                <div className='container'>
                    <div className='row'>
                        <div className='col-4'>
                            <label><FormattedMessage id='manage-schedule.choose-date'/></label>
                                <DatePicker
                                    onChange={this.handleOnchangeDatePicker}
                                    className = 'form-control'
                                    value = {this.state.selectedDate}
                                    minDate = {yesterday}
                                />    
                        </div>
                        <div className='col-12 my-3'>
                            <table id="customers">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thời gian</th>
                                        <th>Họ và tên</th>
                                        <th>Giới tính</th>
                                        <th>Địa chỉ</th>
                                        <th>actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientData && patientData.length > 0 ?

                                        patientData.map((item,index) => {
                                            let time = language === languages.EN ? item.timeTypeBookingData.valueEn: item.timeTypeBookingData.valueVi;
                                            let name = language === languages.VI ? `${item.patientData.firstName} ${item.patientData.lastName}`:`${item.lastName} ${item.firstName}`;
                                            let gender = language === languages.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn;
                                            return (
                                                <tr key={index}>
                                                    <td>{index}</td>
                                                    <td>{time}</td>
                                                    <td>{name}</td>
                                                    <td>{gender}</td>
                                                    <td>{item.patientData.address}</td>
                                                    <td>
                                                        <button onClick={()=>this.handleConfirm(item)}  className='btn btn-success px-3 mx-3'>Xác nhận</button>
                                                    </td>
                                                </tr>
                                            )
                                        }):
                                        <tr>
                                            <td>No data</td>
                                        </tr>
                                    }

                                </tbody>
                            </table>
                            {
                                isOpenModal && 
                                <RemedyModal patient={this.state.selectedPatient} handleSendRemedy={(imageBase64)=>this.handleSendRemedy(imageBase64)}  closeModal={()=>this.handleCloseModal()}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
        
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
