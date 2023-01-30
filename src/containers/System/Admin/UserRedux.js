import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { languages, CRUD_ACTIONS } from '../../../utils';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be import
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import TableManageUser from './TableManageUser';
import { toast } from 'react-toastify';
import { CommonUtils } from '../../../utils';

class UserRedux extends Component {

    state = {
        genderArr: [],
        positionArr: [],
        roleArr: [],
        previewImageURL: '',
        isOpenPreviewImange: false,

        email: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        gender: '',
        position: '',
        role: '',
        avatar: '',

        action: '',

        userEditId: '',
    }

    componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux ||
            prevProps.positionRedux !== this.props.positionRedux ||
            prevProps.roleRedux !== this.props.roleRedux) {
            this.setState({
                genderArr: this.props.genderRedux,
                positionArr: this.props.positionRedux,
                roleArr: this.props.roleRedux,
            })
        }
        if (prevProps.users !== this.props.users) {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                gender: '',
                role: '',
                position: '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImageURL: ''
            })
        }
    }

    handleOnchangeImage = async (e) => {
        let data = e.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.convertBase64(file);
            let objectURL = URL.createObjectURL(file);
            this.setState({
                previewImageURL: objectURL,
                avatar: base64
            })

        }
    }

    handlePreviewImage = () => {
        if (!this.state.previewImageURL) return;
        this.setState({
            isOpenPreviewImange: true
        })
    }

    handleOnchangeInput = (e, type) => {
        let coppyState = { ...this.state }
        coppyState[type] = e.target.value;
        this.setState({
            ...coppyState
        })
    }

    handleSave = async () => {
        let isValid = this.checkValidateInput();
        let data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            gender: this.state.gender,
            role: this.state.role,
            position: this.state.position,
            avatar: this.state.avatar,
        }
        let { action } = this.state;
        if (isValid === false) return;
        if (action === CRUD_ACTIONS.CREATE) {
            // create user
            await this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                ...data
            });
            this.props.fetchUserRedux();
        }
        if (action === CRUD_ACTIONS.EDIT) {
            await this.props.editUser({
                id: this.state.userEditId,
                ...data
            });
            this.props.fetchUserRedux();
        }

    }

    checkValidateInput = () => {
        let isValid = false;
        let arrCheck = ['email', "password", 'firstName', 'lastName', 'address',
            'gender', 'position', 'role', 'phoneNumber'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                toast.warn(`This ${arrCheck[i]} is required`);
                break;
            } else {
                isValid = true;
            }
        }
        return isValid;
    }

    handleEditUserFromParent = (user) => {
        let imageBase64 = ''
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }


        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phoneNumber: user.phonenumber,
            gender: user.gender,
            role: user.roleId,
            position: user.positionId,
            avatar: '',
            previewImageURL: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
        })
    }

    render() {
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let language = this.props.language;
        let { email, password, firstName, lastName, address,
            gender, position, role, avatar, phoneNumber }
            = this.state
        return (
            <div className="user-redux-container" >
                <div className='title'>
                    User Redux
                </div>
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 mb-3'>
                                {this.state.action === CRUD_ACTIONS.EDIT ?
                                    <FormattedMessage id="manage-users.edit-user" /> :
                                    <FormattedMessage id="manage-users.add" />
                                }
                            </div>
                            <div className='col-12 mb-3'>
                                {
                                    (this.props.isLoadingGender === true
                                        || this.props.isLoadingPosition === true
                                        || this.props.isLoadingRole === true)
                                    && 'Loading data'
                                }
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-users.email" /></label>
                                <input
                                    className='form-control'
                                    type='email'
                                    value={email}
                                    onChange={(e) => this.handleOnchangeInput(e, 'email')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT && true}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-users.password" /></label>
                                <input
                                    className='form-control'
                                    type='password'
                                    value={password}
                                    onChange={(e) => this.handleOnchangeInput(e, 'password')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT && true}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-users.first-name" /></label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={firstName}
                                    onChange={(e) => this.handleOnchangeInput(e, 'firstName')}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-users.last-name" /></label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={lastName}
                                    onChange={(e) => this.handleOnchangeInput(e, 'lastName')}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-users.phone-number" /></label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={phoneNumber}
                                    onChange={(e) => this.handleOnchangeInput(e, 'phoneNumber')}
                                />
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id="manage-users.address" /></label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={address}
                                    onChange={(e) => this.handleOnchangeInput(e, 'address')}
                                />
                            </div>
                            <div className="form-group col-3">
                                <label ><FormattedMessage id="manage-users.gender" /></label>
                                <select
                                    className="form-control"
                                    onChange={(e) => this.handleOnchangeInput(e, 'gender')}
                                    value={gender}
                                >
                                    <option defaultValue value=''>{language === languages.VI ? 'Chọn ...' : 'Choose ...'}</option>
                                    {
                                        genders && genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap} >{language === languages.VI ? item.valueVi : item.valueEn}</option>

                                            )
                                        })
                                    }

                                </select>
                            </div>
                            <div className="form-group col-3">
                                <label ><FormattedMessage id="manage-users.role" /></label>
                                <select
                                    className="form-control"
                                    onChange={(e) => this.handleOnchangeInput(e, 'role')}
                                    value={role}
                                >
                                    <option defaultValue value=''>{language === languages.VI ? 'Chọn ...' : 'Choose ...'}</option>
                                    {
                                        roles && roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap} >{language === languages.VI ? item.valueVi : item.valueEn}</option>

                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-3">
                                <label ><FormattedMessage id="manage-users.position" /></label>
                                <select
                                    className="form-control"
                                    onChange={(e) => this.handleOnchangeInput(e, 'position')}
                                    value={position}
                                >
                                    <option defaultValue value=''>{language === languages.VI ? 'Chọn ...' : 'Choose ...'}</option>
                                    {
                                        positions && positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === languages.VI ? item.valueVi : item.valueEn}</option>

                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-3 ">
                                <label ><FormattedMessage id="manage-users.image" /></label>
                                <div className='preview-container'>
                                    <input
                                        id='previewImg'
                                        className='form-control'
                                        type='file' hidden
                                        onChange={(e) => this.handleOnchangeImage(e)}
                                    />
                                    <label className='lablel-upload' htmlFor='previewImg'><FormattedMessage id="manage-users.image-upload" /><i className="fas fa-upload ml-3"></i></label>
                                    {this.state.previewImageURL && <div
                                        className='preview-img'
                                        style={{ backgroundImage: `url(${this.state.previewImageURL})`, color: '#fff' }}
                                        onClick={() => this.handlePreviewImage()}
                                    ></div>}
                                </div>
                            </div>
                            {this.state.isOpenPreviewImange === true && <Lightbox
                                mainSrc={this.state.previewImageURL}
                                onCloseRequest={() => this.setState({ isOpenPreviewImange: false })}
                            />}
                            <div className='col-12'>
                                <button
                                    onClick={() => { this.handleSave() }}
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning px-3 mt-3' : 'btn btn-primary px-3 mt-3'}>
                                    {this.state.action === CRUD_ACTIONS.EDIT ?
                                        <FormattedMessage id="manage-users.edit" /> :
                                        <FormattedMessage id="manage-users.save" />
                                    }
                                </button>
                            </div>
                            <div className='col-12 mt-5 mb-5'>
                                <TableManageUser

                                    handleEditUserFromParent={this.handleEditUserFromParent}
                                    action={this.state.action}
                                />
                            </div>
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
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        positionRedux: state.admin.positions,
        isLoadingPosition: state.admin.isLoadingPosition,
        roleRedux: state.admin.roles,
        isLoadingRole: state.admin.isLoadingRole,
        users: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fechGenderStart()),
        getPositionStart: () => dispatch(actions.fechPositionStart()),
        getRoleStart: () => dispatch(actions.fechRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fechAllUsersStart()),
        editUser: (data) => dispatch(actions.editUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
