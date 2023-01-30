import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import { getDetailClinic } from '../../../services';
import { languages } from '../../../utils';
import _ from 'lodash';





class DetailClinic extends Component {
    constructor(props){
        super(props);
        this.state={
            detailClinic:{},
            arrDoctorId:[],
        }
    }
    async componentDidMount(){
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let res = await getDetailClinic(this.props.match.params.id);
            let arrDoctorId = this.convertArrDoctorId(res.data.clinicData);
            if(res && res.errCode===0){
                this.setState({
                    detailClinic: res.data,
                    arrDoctorId: arrDoctorId
                })
            }
        }
        
    }

    convertArrDoctorId = (data)=>{
        let arrDoctorId = [];
        for(let i=0;i<data.length;i++){
            arrDoctorId.push(data[i].doctorId);
        }
        return arrDoctorId;
    }



    componentDidUpdate(prevProps,prevState){
    
    }
    
    


    render() {
        let {arrDoctorId,detailClinic} = this.state;
        return(
            <div className='specialty-wrapper'>
                <HomeHeader/>
                <div className='specialty-container'>
                    <div className='description-specialty'>
                        <h3>{detailClinic.name}</h3>
                        <span ><i className="fas fa-map-marker-alt"></i>{` ${detailClinic.address}`}</span>
                        <div style={{paddingTop:'15px'}} dangerouslySetInnerHTML={{__html:detailClinic.descriptionHTML}}></div>
                    </div>
                    <div className='doctors'>                  
                        {
                            arrDoctorId && arrDoctorId.length>0 &&
                            arrDoctorId.map((item,index)=>{
                                return(
                                    <div className='each-doctor' key={index}>
                                        <div className='content-left-specialty'>
                                            <ProfileDoctor 
                                                doctorId={item}
                                                isShowDescription={true}
                                                isShowProvince={true}
                                                isShowLinkDetail={true}
                                            />
                                        </div>
                                        <div className='content-right-specialty'>
                                            <DoctorSchedule
                                                detailDoctorId={item ? item: -1}
                                            />
                                            <DoctorExtraInfor
                                                detailDoctorId={item ? item: -1}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
