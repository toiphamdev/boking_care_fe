import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import { toast } from 'react-toastify';
import Select from 'react-select';
import MdEditor from 'react-markdown-editor-lite';

import './ManageClinic.scss'
import { CommonUtils } from '../../../utils';
import { createNewClinic } from '../../../services';
import { getAllClinic, getDetailClinic, deleteClinicById } from '../../../services';
import { languages } from '../../../utils';
const mdParser = new MarkdownIt(/* Markdown-it options */);



class ManageClinic extends Component {
    constructor(props){
        super(props);
        this.state={
            name:'',
            imageBase64:'',
            descriptionHTML:'',
            descriptionMarkdown:'',
            address:'',
            action:'CREATE',
            clinics:'',
            selectedClinic:{},
            clinicId:'',
        }
    }
    
    componentDidMount(){
        this.getClinics();
    }

    getClinics = async()=>{
        let res = await getAllClinic();
        if(res && res.errCode === 0){
            let clinics =  this.buildDataSelect(res.data,'CLINICS')
            this.setState({
                clinics: clinics
            })
        }
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


    async componentDidUpdate(prevProps,prevState){
        if(prevState.selectedClinic !== this.state.selectedClinic && this.state.selectedClinic.value ){
            let res = await getDetailClinic(+this.state.selectedClinic.value);
            if(res && res.errCode === 0){
                let clinic = res.data;
                this.setState({
                    clinicId:clinic.id,
                    name:clinic.name,
                    imageBase64:clinic.image,
                    descriptionHTML:clinic.descriptionHTML,
                    descriptionMarkdown:clinic.descriptionMarkdown,
                    address: clinic.address
                })
            }else{
                this.setState({
                    name:'',
                    imageBase64:'',
                    descriptionHTML:'',
                    descriptionMarkdown:'',
                    address:''
                })
            }
        }
    }
    
    handleOnchangeInput = (e,name)=>{
        let coppyState = {...this.state};
        coppyState[name]=e.target.value;
        this.setState({
            ...coppyState
        })
    }

    handleEditorChange=({html,text})=>{
        this.setState({
            descriptionHTML:html,
            descriptionMarkdown:text,
        })

    }

    handleOnchangeImage = async (e) => {
        let data = e.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.convertBase64(file);
            this.setState({
                imageBase64: base64
            })

        }
    }

    handleSaveClinic = async()=>{
        let res = await createNewClinic({
            id : this.state.clinicId,
            name:this.state.name,
            image:this.state.imageBase64,
            address: this.state.address,
            descriptionHTML:this.state.descriptionHTML,
            descriptionMarkdown:this.state.descriptionMarkdown
        });
        if(res && res.errCode ===0){
            toast.success(res.errMessage);
            this.getClinics();
            this.setState({
                clinicId:'',
                selectedClinic:'',
                name:'',
                imageBase64:'',
                address:'',
                descriptionHTML:'',
                descriptionMarkdown:''
            })
        }else{
            toast.error(res.errMessage);
        }
    }

    handleDeleteClinic = async()=>{
        if(this.state.clinicId){
            let res =  await deleteClinicById(this.state.clinicId);
            if(res && res.errCode === 0 ){
                toast.success(res.errMessage);
                this.setState({
                    clinicId:'',
                    selectedClinic:'',
                    name:'',
                    imageBase64:'',
                    address:'',
                    descriptionHTML:'',
                    descriptionMarkdown:''
                })
                this.getClinics();
            }
        }else{
            toast.error(`You haven't chossen a clinic to delete`)
        }

    }

    handleChangeAction = ()=>{
        this.setState({
            action: this.state.action === "CREATE" ? "UPDATE":"CREATE"
        })
    }

    handleChangeSelection = (selectedOption)=>{
        this.setState({
            selectedClinic:selectedOption
        })
    }


    render() {
        let {action,clinics} = this.state;
        console.log(this.state.selectedClinic)
        return(
            <div className='manage-spaceialty-container container'>
                <h3 className='title'>Quản lí phòng khám</h3>
                <div className='ms-content row'>
                    <div className='col-12 action-clinic'>
                        <button onClick={()=>this.handleChangeAction()}>{action === "CREATE" ? "Thêm":"Sửa"}</button>
                    </div>
                    {
                        action === 'CREATE' &&
                        <div className='col-6 form-group'>
                            <label>Tên phòng khám</label>
                            <input 
                                className='form-control'
                                onChange={(e)=> this.handleOnchangeInput(e,'name')}
                                value={this.state.name}
                            />
                        </div>
                    }
                    {
                        action === 'UPDATE' && 
                        <div className='col-6'>
                            <label>Chọn phòng khám</label>
                            <Select
                                value={this.state.selectedClinic}
                                onChange={this.handleChangeSelection}
                                options={clinics}
                                placeholder={'Chọn phòng khám'}
                            />
                        </div>
                    }
                    <div className='col-6 form-group'>
                        <label>Ảnh phòng khám</label>
                        <input 
                            type='file' 
                            className='form-control-file'
                            onChange={(e)=>this.handleOnchangeImage(e)}
                        />
                    </div>
                    <div className='col-12 form-group'>
                        <label>Địa chỉ phòng khám</label>
                        <input 
                            className='form-control'
                            onChange={(e)=> this.handleOnchangeInput(e,'address')}
                            value={this.state.address}
                        />
                    </div>
                    <div className='col-12'>
                        <MdEditor 
                            style={{ height: '300px' }} 
                            renderHTML={text => mdParser.render(text)} 
                            onChange={this.handleEditorChange} 
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12 btn-line'>
                        <button 
                            className='btn btn-primary px-3 mt-3'
                            onClick={()=>this.handleSaveClinic()}
                        >
                            {action === "CREATE" ? "Save":"Update"}
                        </button>
                        {
                            action === "UPDATE" &&
                            <button
                                className='btn btn btn-danger px-3 mt-3'
                                onClick={()=>this.handleDeleteClinic()}
                            >
                                Delete
                            </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
