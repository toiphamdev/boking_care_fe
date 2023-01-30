import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllUsers, createNewUserSerVice, deleteUserService, editUserService } from '../../services/userService';
import './UserManage.scss'
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';
class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {},
        }
    }


    async componentDidMount() {
        await this.getAllUsersFromReact();

    }

    async getAllUsersFromReact() {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: [...response.users]
            })
        }
    }

    handleCreateNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }

    toggleModalUser = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    toggleModalEditUser = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }

    doEditUser = async (user) => {
        try {

            let response = await editUserService(user);
            if (response && response.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false
                })
                this.getAllUsersFromReact();
            } else {
                alert(response.errCode)
            }
        } catch (error) {

            console.log(error)
        }
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserSerVice(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: !this.state.isOpenModalUser
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }

        } catch (e) {
            console.log(e)
        }
    }

    handleDeleteUser = async (user) => {
        try {
            if (user && user.roleId !== "0") {
                let res = await deleteUserService(user.id);
                if (res && res.errCode === 0) {
                    await this.getAllUsersFromReact();
                } else {
                    alert(res.errMessage)
                }
            } else {
                alert("This account is admin.")
            }
        } catch (e) {

        }
    }

    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: { ...user }
        })

    }

    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className='usersContainer'>
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggle={this.toggleModalUser}
                    CreateNewUser={this.createNewUser}
                />
                {this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggle={this.toggleModalEditUser}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />}
                <div className="text-center title">Manage users</div>
                <div className='mx-1'>
                    <button
                        className='btn btn-primary mt-3 px-3'
                        onClick={() => { this.handleCreateNewUser() }}
                    ><i className="fas fa-plus ml-1"></i> Create a new user</button>
                </div>
                <div className='userTable mt-3 mx-1'>
                    <table id="customers">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Gender</th>
                                <th>Position</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                arrUsers && arrUsers.length > 0 &&
                                arrUsers.map(user => {
                                    return (
                                        <tr key={user.id}>
                                            <td>{user.email}</td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.address}</td>
                                            <td>{user.gender == "0" ? "Female" : "Male"}</td>
                                            <td>{(user.roleId == "0" && 'Admin') || (user.roleId == "1" && "Doctor") || "Patient"}</td>
                                            <td>
                                                <button onClick={() => this.handleEditUser(user)} className='btnEdit'><i className="fas fa-pencil-alt"></i></button>
                                                <button onClick={() => this.handleDeleteUser(user)} className='btnDelete'><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
