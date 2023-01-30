
import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss'
import Select from 'react-select';
import { languages } from '../../../utils';
const mdParser = new MarkdownIt(/* Markdown-it options */);



class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //save to markdown table
            contentMarkdown:'',
            contentHTML:'',
            selectedDoctor:'',
            description:'',
            doctors:[],
            hasOldData:false,

            //save to doctor_info table
            prices:[],
            payments:[],
            provinces:[],
            specialties:[],
            clinics:[],
            selectedSpecialty:'',
            selectedClinic:'',
            selectedPrice:'',
            selectedPayment:'',
            selectedProvince:'',
            nameClinic:'',
            addressClinic:'',
            note:'',
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchDoctorInforAllcode();
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.doctors !== this.props.doctors || prevProps.language !== this.props.language){
            let data = this.buildDataSelect(this.props.doctors,'USERS');
            this.setState({
                doctors: data
            })
        }
        if(prevState.selectedDoctor !== this.state.selectedDoctor){
            if(this.state.selectedDoctor && this.state.selectedDoctor.value){
                await this.props.getDetailDoctor(this.state.selectedDoctor.value);
                if(this.props.doctorSelected && this.props.doctorSelected.Markdown){
                    this.setState({
                        contentMarkdown:this.props.doctorSelected.Markdown.contentMarkdown,
                        contentHTML:this.props.doctorSelected.Markdown.contentHTML,
                        description:this.props.doctorSelected.Markdown.description,
                        hasOldData:true
                    });
                }else{
                    this.setState({
                        contentMarkdown:'',
                        contentHTML:'',
                        description:'',
                        hasOldData:false,
                    });
                }
                if(this.props.doctorSelected && this.props.doctorSelected.DoctorInfor){
                    let {DoctorInfor} = this.props.doctorSelected;
                    let price = this.buildSelectedData(DoctorInfor.priceData,'PRICES');
                    let payment = this.buildSelectedData(DoctorInfor.paymentData);
                    let province = this.buildSelectedData(DoctorInfor.provinceData);
                    let specialty = this.buildSelectedData(DoctorInfor.specialtyData,'SPECIALTIES');
                    let clinic = this.buildSelectedData(DoctorInfor.clinicData,'CLINICS');
                    this.setState({
                        addressClinic: DoctorInfor.addressClinic,
                        nameClinic: DoctorInfor.nameClinic,
                        note: DoctorInfor.note,
                        selectedPrice: price,
                        selectedPayment:payment,
                        selectedProvince:province,
                        selectedSpecialty: specialty,
                        selectedClinic: clinic
                    })
                }else{
                    this.setState({
                        addressClinic: '',
                        nameClinic: '',
                        note: '',
                        selectedPrice: '',
                        selectedPayment:'',
                        selectedProvince:'',
                        selectedClinic:''
                    })
                }
            }
        }
        if(prevProps.doctorInforAllcode !== this.props.doctorInforAllcode || prevProps.language !== this.props.language){
            let {resPayments,resPrices,resProvinces,resSpecialties,resClinics} =this.props.doctorInforAllcode;
            let prices = this.buildDataSelect(resPrices,'PRICES');
            let payments = this.buildDataSelect(resPayments);
            let provinces = this.buildDataSelect(resProvinces);
            let specialties = this.buildDataSelect(resSpecialties,'SPECIALTIES');
            let clinics =  this.buildDataSelect(resClinics,'CLINICS')
            this.setState({
                prices: prices,
                payments: payments,
                provinces: provinces,
                specialties: specialties,
                clinics: clinics
            })
        }

    }

    handleEditorChange=({html,text})=>{
        this.setState({
            contentHTML:html,
            contentMarkdown:text
        })

    }
    handleSaveDetailDoctor=()=>{
        this.props.saveDetailDoctor({
            contentMarkdown:this.state.contentMarkdown,
            contentHTML:this.state.contentHTML,
            doctorId:this.state.selectedDoctor.value,
            description:this.state.description,

            priceId:this.state.selectedPrice.value,
            paymentId:this.state.selectedPayment.value,
            provinceId:this.state.selectedProvince.value,
            nameClinic:this.state.nameClinic,
            addressClinic:this.state.addressClinic,
            note:this.state.note,
            specialtyId: this.state.selectedSpecialty.value,
            clinicId: this.state.selectedClinic.value
        })
    }

    handleChangeSelection = (selectedOption,name) => {
        switch (name.name) {
            case 'PRICE':
                this.setState({ 
                    selectedPrice:selectedOption
                 }
                );
                break;
            case 'PROVINCE':
                this.setState({ 
                    selectedProvince:selectedOption
                 }
                );
                break;
            case 'DOCTOR':
                this.setState({ 
                    selectedDoctor:selectedOption
                 }
                );
                break;
            case 'PAYMENT':
                this.setState({ 
                    selectedPayment:selectedOption
                 }
                );
                break;
            case 'SPECIALTY':
                this.setState({
                    selectedSpecialty:selectedOption
                })
                break;
            case 'CLINIC':
                this.setState({
                    selectedClinic:selectedOption
                })
                break;  
            default:
                break;
        }
    };

    handleOnChangeText=(e,id)=>{
        let coppyState = {...this.state};
        coppyState[id] = e.target.value;
        this.setState({
            ...coppyState
        })
    }

    buildDataSelect = (inputData,type)=>{
        let result = [];
        inputData.map((item)=>{
            let object = {};
            let labelEN = '';
            let labelVI = '';
            switch (type) {
                case 'USERS':
                    labelEN =`${item.lastName} ${item.firstName}`;
                    labelVI =`${item.firstName} ${item.lastName}`;
                    object.label = this.props.language === languages.EN ? labelEN:labelVI;
                    object.value = item.id;
                    result.push(object);
                    break;
                case 'PRICES':
                    labelEN = item.valueEn + ' $';
                    labelVI = item.valueVi + ' VNĐ';
                    object.label = this.props.language === languages.EN ? labelEN:labelVI;
                    object.value = item.keyMap;
                    result.push(object);
                    break;
                case 'SPECIALTIES':
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                    break;
                 case 'CLINICS':
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                    break;
                default:
                    labelEN = item.valueEn;
                    labelVI = item.valueVi;
                    object.label = this.props.language === languages.EN ? labelEN:labelVI;
                    object.value = item.keyMap;
                    result.push(object);
                    break;
            }
        })
        return result;
    }

    buildSelectedData = (inputData,type)=>{
        let object = {};
            let labelEN = '';
            let labelVI = '';
            switch (type) {
                case 'USERS':
                    labelEN =`${inputData.lastName} ${inputData.firstName}`;
                    labelVI =`${inputData.firstName} ${inputData.lastName}`;
                    object.label = this.props.language === languages.EN ? labelEN:labelVI;
                    object.value = inputData.id;
                    break;
                case 'PRICES':
                    labelEN = inputData.valueEn + ' $';
                    labelVI = inputData.valueVi + ' VNĐ';
                    object.label = this.props.language === languages.EN ? labelEN:labelVI;
                    object.value = inputData.keyMap;
                    break;
                case 'SPECIALTIES':
                    object.label = inputData.name;
                    object.value = inputData.id;
                    break;
                case 'CLINICS':
                    object.label = inputData.name;
                    object.value = inputData.id;
                    break;
                default:
                    labelEN = inputData.valueEn;
                    labelVI = inputData.valueVi;
                    object.label = this.props.language === languages.EN ? labelEN:labelVI;
                    object.value = inputData.keyMap;
                    break;
            }
        return object;
    }
   
    render() {
        return (
            <div className='manage-doctor-wrapper'>
                <div className='manage-doctor-title'><FormattedMessage id="admin.manage-doctor.title" /></div>
                <div className='more-info row'>
                    <div className='content-bottom col-4'>
                        <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                        <Select
                            name='DOCTOR'
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeSelection}
                            options={this.state.doctors}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                        />
                    </div>
                    <div className='content-bottom col-4'>
                        <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                        <Select
                            name='SPECIALTY'
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelection}
                            options={this.state.specialties}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                        />
                    </div>
                    <div className='content-bottom col-4'>
                        <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                        <Select
                            name='CLINIC'
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelection}
                            options={this.state.clinics}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                        />
                    </div>
                    <div className='content-top form-group col-12'>
                        <label><FormattedMessage id="admin.manage-doctor.intro" /></label>
                        <textarea 
                        className='form-control' 
                        rows='4'
                        onChange={(e)=>this.handleOnChangeText(e,'description')}
                        value={this.state.description}
                        >
                        
                        </textarea>
                    </div>
                </div>
                <div className='more-info-extra row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                        <Select
                            name='PRICE'
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelection}
                            options={this.state.prices}
                            placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                        <Select
                            name='PAYMENT'
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelection}
                            options={this.state.payments}
                            placeholder={<FormattedMessage id="admin.manage-doctor.payment" />}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.province" /></label>
                        <Select
                            name='PROVINCE'
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelection}
                            options={this.state.provinces}
                            placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.addressClinic" /></label>
                        <input 
                            className='form-control'
                            onChange={(e)=>this.handleOnChangeText(e,'addressClinic')}
                            value={this.state.addressClinic}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.nameClinic" /></label>
                        <input
                            className='form-control'
                            onChange={(e)=>this.handleOnChangeText(e,'nameClinic')}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                        <input 
                            className='form-control'
                            onChange={(e)=>this.handleOnChangeText(e,'note')}
                            value={this.state.note}
                        />
                    </div>
                </div>
                <MdEditor 
                className='manage-doctor-editer' 
                style={{ height: '300px' }} 
                renderHTML={text => mdParser.render(text)} 
                onChange={this.handleEditorChange} 
                value={this.state.contentMarkdown}
                />
                <button 
                className={this.state.hasOldData ? 'btn btn-primary save-content-markdown px-3':'btn btn-info save-content-markdown px-3'}
                onClick={()=>this.handleSaveDetailDoctor()}
                >
                    {this.state.hasOldData ? <FormattedMessage id="admin.manage-doctor.save" />:<FormattedMessage id="admin.manage-doctor.add" />}
                </button>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        doctors: state.admin.doctors,
        doctorSelected : state.admin.doctorSelected,
        doctorInforAllcode: state.admin.doctorInforAllcode,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors : ()=> dispatch(actions.fechAllDoctors()),
        saveDetailDoctor: (data)=>dispatch(actions.saveDetailsDoctor(data)),
        getDetailDoctor:(id)=>dispatch(actions.getDetailDoctor(id)),
        fetchDoctorInforAllcode: ()=>dispatch(actions.getDoctorInfo())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);

