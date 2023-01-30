import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { verifyBookingSchedule } from '../../services';
import HomeHeader from '../HomePage/HomeHeader';





class VerifyEmail extends Component {
    constructor(props){
        super(props);
        this.state={
            statusVerify:false,
            errCode:''
        }
    }
    async componentDidMount(){
        if(this.props.location && this.props.location.search){
            const urlParams = new URLSearchParams(this.props.location.search);
            const token = urlParams.get('token');
            const doctorId = urlParams.get('doctorId');
            let res = await verifyBookingSchedule({
                token:token,
                doctorId:doctorId
            })
            if(res && res.errCode === 0){
                this.setState({
                    statusVerify:true,
                    errCode:res.errCode
                })
            }else{
                this.setState({
                    statusVerify:true,
                    errCode: res.errCode ? res.errCode:-1
                })
            }
        }
    }


    componentDidUpdate(prevProps,prevState){
        
    }
    


    render() {
        return(
            <>
                <HomeHeader/>
                {
                this.state.statusVerify ? 
                    <h3 style={{color:"red",textAlign:"center"}}>{
                            this.state.errCode === 0 ? 
                            <FormattedMessage id="patient.booking-modal.booking-success"/>:<FormattedMessage id="patient.booking-modal.booking-failed"/>
                        }
                    </h3>:
                    <h3><FormattedMessage id="patient.booking-modal.loading-data"/></h3>
                }
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
