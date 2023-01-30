
import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually

// Finish!
function handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text);
}

class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersArr: [],
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.users !== this.props.users) {
            this.setState({
                usersArr: this.props.users
            })
        }
    }

    handleDeleteUser = async (data) => {
        await this.props.deleteUserRedux(data.id);
        this.props.fetchUserRedux();
    }

    handleEditUser = (data) => {
        this.props.handleEditUserFromParent(data);
    }

    render() {
        console.log(this.props.users)
        console.log(this.state)
        return (
            <Fragment>
                <table id="customers">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Address</th>
                            <th>Gender</th>
                            <th>Role</th>
                            <th>Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.usersArr && this.state.usersArr.length > 0 &&

                            this.state.usersArr.map(user => {
                                return (
                                    <tr key={user.id}>
                                        <td>{user.email}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.address}</td>
                                        <td>{user.gender}</td>
                                        <td>{user.roleId}</td>
                                        <td>{user.positionId}</td>
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
            </Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        users: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fechAllUsersStart()),
        deleteUserRedux: (data) => dispatch(actions.deleteUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);

