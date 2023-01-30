import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Select from 'react-select';

import './ManageSpecialty.scss';

import { CommonUtils,languages } from '../../../utils';
import { getAllSpecialty , getSpecialtyById,createNewSpecialty, deleteSpecialtyById } from '../../../services';
import { toast } from 'react-toastify';
const mdParser = new MarkdownIt(/* Markdown-it options */);



class ManageSpecialty extends Component {
    constructor(props){
        super(props);
        this.state={
            specialtyId:'',
            name:'',
            imageBase64:'',
            descriptionHTML:'',
            descriptionMarkdown:'',
            action:"CREATE",
            specialties:[],
            selectedSpecialty:'',
        }
    }
    componentDidMount(){
        this.getSpecialties();
    }


    async componentDidUpdate(prevProps,prevState){
        if(prevState.selectedSpecialty !== this.state.selectedSpecialty && this.state.selectedSpecialty.value){
            let res = await getSpecialtyById(this.state.selectedSpecialty.value);
            if(res && res.errCode === 0){
                let specialty = res.data;
                this.setState({
                    specialtyId: specialty.id,
                    name:specialty.name,
                    imageBase64:specialty.image,
                    descriptionHTML:specialty.descriptionHTML,
                    descriptionMarkdown:specialty.descriptionMarkdown,
                })
            }else{
                console.log(res.errCode)
                toast.error('Somthings wrong when get specialty')
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

    getSpecialties = async()=>{
        let res = await getAllSpecialty();
        if(res && res.errCode === 0){
            let specialties =  this.buildDataSelect(res.data,'SPECIALTIES')
            this.setState({
                specialties: specialties
            })
        }
    }

    handleEditorChange=({html,text})=>{
        this.setState({
            descriptionHTML:html,
            descriptionMarkdown:text
        })

    }

    handleChangeAction = ()=>{
        this.setState({
            action: this.state.action === "CREATE" ? "UPDATE":"CREATE"
        })
    }

    handleChangeSelection = (selectedOption)=>{
        this.setState({
            selectedSpecialty:selectedOption
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

    handleSaveSpecialty = async()=>{
        let res = await createNewSpecialty({
            id: this.state.specialtyId,
            name:this.state.name,
            image:this.state.imageBase64,
            descriptionHTML:this.state.descriptionHTML,
            descriptionMarkdown:this.state.descriptionMarkdown
        });
        if(res && res.errCode ===0){
            toast.success(res.errMessage);
            this.setState({
                specialtyId:'',
                selectedSpecialty:'',
                name:'',
                imageBase64:'',
                descriptionHTML:'',
                descriptionMarkdown:''
            });
            this.getSpecialties();
        }else{
            toast.error(res.errMessage);
        }
    }

    handleDeleteSpecialty = async()=>{
        if(this.state.specialtyId){
            let res =  await deleteSpecialtyById(this.state.specialtyId);
            if(res && res.errCode === 0 ){
                toast.success(res.errMessage);
                this.setState({
                    specialtyId:'',
                    selectedSpecialty:'',
                    name:'',
                    imageBase64:'',
                    descriptionHTML:'',
                    descriptionMarkdown:''
                })
                this.getSpecialties();
            }
        }else{
            toast.error(`You haven't chossen a clinic to delete`)
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


    render() {
        let {action,specialties} = this.state;
        console.log(this.state.specialties)
        return(
            <div className='manage-spaceialty-container container'>
                <h3 className='title'>Quản lí chuyên khoa</h3>
                <div className='ms-content row'>
                    <div className='col-12 action-clinic'>
                        <button onClick={()=>this.handleChangeAction()}>{action === "CREATE" ? "Thêm":"Sửa"}</button>
                    </div>
                    {
                        action === 'CREATE' &&
                        <div className='col-6 form-group'>
                            <label>Tên chuyên khoa</label>
                            <input 
                                className='form-control'
                                onChange={(e)=> this.handleOnchangeInput(e,'name')}
                                value={this.state.name}
                            />
                        </div>
                    }
                    {
                        action === 'UPDATE' && 
                        <div className='col-6 mb-3'>
                            <label>Chọn chuyên khoa</label>
                            <Select
                                // name='DOCTOR'
                                value={this.state.selectedSpecialty}
                                onChange={this.handleChangeSelection}
                                options={specialties}
                                placeholder={'Chọn chuyên khoa'}
                            />
                        </div>
                    }
                    <div className='col-6 form-group'>
                        <label>Ảnh chuyên khoa</label>
                        <input 
                            type='file' 
                            className='form-control-file'
                            onChange={(e)=>this.handleOnchangeImage(e)}
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
                    <div className='col-12 action-btn'>
                        <button 
                            className='btn btn-primary px-3 mt-3'
                            onClick={()=>this.handleSaveSpecialty()}
                        >
                            {action === "CREATE" ? "Save":"Update"}
                        </button>
                         {
                            action === "UPDATE" &&
                            <button
                                className='btn btn btn-danger px-3 mt-3'
                                onClick={()=>this.handleDeleteSpecialty()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
