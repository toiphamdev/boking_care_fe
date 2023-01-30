
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, ModalHeader, ModalFooter, ModalBody, Modal } from 'reactstrap'
import _ from 'lodash';
class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            gender: '',
            roleId: '',

        }
    }


    componentDidMount() {
        let user = this.props.currentUser;
        if (user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                phoneNumber: user.phonenumber,
                gender: user.gender,
                roleId: user.roleId,
            })
        }
    }
    toggle() {
        this.props.toggle();
    }

    handleOnchangeInput(e, id) {
        let copyState = { ...this.state };
        copyState[id] = e.target.value;
        this.setState({
            ...copyState
        })
    }

    checkValidateInput() {
        let isValid = true;
        let arrInput = ["email", "firstName", "lastName", "address", "roleId"];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameters ' + arrInput[i]);
                break;
            }
        }

        return isValid;
    }

    handleSaveUser() {
        let isValid = this.checkValidateInput();
        if (isValid) {
            //call api edit user
            this.props.editUser(this.state);
        }
    }

    render() {
        return (
            < Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }
                }
                size="lg"
                centered
                className='modalUserContainer'
            >
                <ModalHeader
                    toggle={() => { this.toggle() }}
                >
                    Modal title
                </ModalHeader>
                <ModalBody>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h1 className="mt-3">Edit user</h1>
                                <form action="/post-crud" method="POST">
                                    <div className="form row">
                                        <div className="form-group col-12">
                                            <label >Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="inputEmail"
                                                placeholder="Email"
                                                name="email"
                                                onChange={(e) => this.handleOnchangeInput(e, "email")}
                                                value={this.state.email}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="form row">
                                        <div className="form-group col-6">
                                            <label >First name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="inputFirstName"
                                                name="firstName"
                                                onChange={(e) => this.handleOnchangeInput(e, "firstName")}
                                                value={this.state.firstName}
                                            />

                                        </div>
                                        <div className="form-group col-6">
                                            <label >Last name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="inputLastName"
                                                name="lastName"
                                                onChange={(e) => this.handleOnchangeInput(e, "lastName")}
                                                value={this.state.lastName}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label >Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputAddress"
                                            placeholder="1234 Main St"
                                            name="address"
                                            onChange={(e) => this.handleOnchangeInput(e, "address")}
                                            value={this.state.address}
                                        />
                                    </div>
                                    <div className="form row">
                                        <div className="form-group col-6">
                                            <label >Phone number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="inputPhoneNumber"
                                                name="phoneNumber"
                                                onChange={(e) => this.handleOnchangeInput(e, "phoneNumber")}
                                                value={this.state.phoneNumber}
                                            />
                                        </div>
                                        <div className="form-group col-3">
                                            <label >Sex</label>
                                            <select
                                                name="gender"
                                                id="inputGender"
                                                className="form-control"
                                                onChange={(e) => this.handleOnchangeInput(e, "gender")}
                                                value={this.state.gender}
                                            >
                                                <option defaultValue="">Choose...</option>
                                                <option value="1">Male</option>
                                                <option value="0">Female</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-3">
                                            <label >Role</label>
                                            <select
                                                name="roleId"
                                                id="inputRole"
                                                className="form-control"
                                                onChange={(e) => this.handleOnchangeInput(e, "roleId")}
                                                value={this.state.roleId}
                                            >
                                                <option defaultValue="">Choose...</option>
                                                <option value="1">Doctor</option>
                                                <option value="2">Patient</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        className='px-3'
                        color="primary"
                        onClick={() => { this.handleSaveUser() }}
                    >
                        Save change
                    </Button>
                    {' '}
                    <Button
                        onClick={() => { this.toggle() }}
                        className='px-3'
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal >
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);

