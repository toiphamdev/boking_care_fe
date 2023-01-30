import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import './DetailSpecialty.scss'
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import { getDetailSpecialty, getAllCodeService } from '../../../services';
import { languages } from '../../../utils';
import Select from 'react-select';
import _ from 'lodash';





class DetailSpecialty extends Component {
    constructor(props){
        super(props);
        this.state={
            detailSpecialty:{},
            arrDoctorId:[],
            provinces:[],
            selectedProvince:''
        }
    }
    async componentDidMount(){
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let res = await getDetailSpecialty(this.props.match.params.id,'ALL');
            let arrDoctorId = this.convertArrDoctorId(res.data.arrDoctorId);
            if(res && res.errCode===0){
                this.setState({
                    detailSpecialty: res.data.specialtyData,
                    arrDoctorId: arrDoctorId
                })
            }
        }
        let res = await getAllCodeService('PROVINCE');
        if(res && res.errCode===0){
            if(res.data && !_.isEmpty(res.data)){
                let provincesCoppy = res.data;
                provincesCoppy.unshift({
                    keyMap:'ALL',
                    type:'PROVINCE',
                    valueEn:'All',
                    valueVi:'Toàn quốc'
                })
                let provinces = this.buildDataSelect(provincesCoppy);
                this.setState({
                    provinces: provinces,
                    selectedProvince: provinces[0]
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

    buildDataSelect = (inputData)=>{
        let result =  [];
        inputData.map((item)=>{
            let object = {};
            let labelEN = '';
            let labelVI='';
            labelEN = item.valueEn;
            labelVI = item.valueVi;
            object.label = this.props.language === languages.EN ? labelEN:labelVI;
            object.value = item.keyMap;
            result.push(object);
        })
        return result;
    }


    async componentDidUpdate(prevProps,prevState){
        if(prevState.selectedProvince !== this.state.selectedProvince){
            if(this.props.match && this.props.match.params && this.props.match.params.id){
            let res = await getDetailSpecialty(this.props.match.params.id,this.state.selectedProvince.value);
            let arrDoctorId = this.convertArrDoctorId(res.data.arrDoctorId);
            if(res && res.errCode===0){
                this.setState({
                    arrDoctorId: arrDoctorId
                })
            }
        }
        }
    }
    
    handleChangeSelection = async (selectedOption)=>{
        this.setState({
            selectedProvince:selectedOption
        })
    }
    


    render() {
        console.log(this.state)
        let {arrDoctorId,detailSpecialty} = this.state;
        return(
            <div className='specialty-wrapper'>
                <HomeHeader/>
                <div className='specialty-container'>
                    <div className='description-specialty'>
                        <div dangerouslySetInnerHTML={{__html:detailSpecialty.descriptionHTML}}></div>
                    </div>
                    <div className='doctors'>                       
                        <div className='provice-search'>
                            <Select
                                value={this.state.selectedProvince}
                                onChange={this.handleChangeSelection}
                                options={this.state.provinces}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                            />
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
