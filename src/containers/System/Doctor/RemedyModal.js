import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { languages } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { Button, ModalHeader, ModalFooter, ModalBody, Modal } from 'reactstrap';
import * as actions from '../../../store/actions';
import { CommonUtils } from '../../../utils';

import _ from 'lodash';
import { toast } from 'react-toastify';






class RemedyModal extends Component {
    constructor(props){
        super(props);
        this.state={
            imageBase64:''
        }
    }
    componentDidMount(){
        
    }


    componentDidUpdate(prevProps,prevState){
        
    }

    handleSendRemedy = async()=>{
        console.log(this.state,this.props);
        this.props.handleSendRemedy(this.state.imageBase64)
        // let {patient} = this.props;
        // let res = await confirmScheduleForDoctor({
        //     patientId:patient.patientId,
        //     timeType:patient.timeType,
        //     doctorId:patient.doctorId,
        //     date: new Date(patient.date).getTime(),
        //     imageBase64:this.state.imageBase64
        // })
        // if(res && res.errCode === 0){
        //     toast.success('Confirm this schedule success!');
        //     this.props.closeModal();
        // }else{
        //     toast.error('Schedule not found')
        // }

    }

    handleOnChangeFile = async(e)=>{
        let data = e.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.convertBase64(file);
            this.setState({
                imageBase64: base64
            })

        }
    }



    render() {
        let {patient,closeModal} = this.props;
        return(
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
                       <div className='col-6 form-group'>
                           <label>Email patient</label>
                           <input className='form-control' value={patient.patientData.email} readOnly/>
                       </div>
                       <div className='col-6 form-group'>
                           <label>Hoa don</label>
                           <input onChange={(e)=>this.handleOnChangeFile(e)} type='file' className='form-control-file'/>
                       </div>
                   </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        className='px-3'
                        color="primary"
                        onClick={() => { this.handleSendRemedy() }}
                    >
                        Send
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

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
