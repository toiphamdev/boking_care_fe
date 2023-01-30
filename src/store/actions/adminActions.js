import actionTypes from './actionTypes';
import {getAllClinic,getAllSpecialty,saveBulkScheduleDoctor,getScheduleByDateService ,getDetailDoctorService,saveDetailDoctorService, createNewUserSerVice, getTopDoctorHomeService,getAllDoctorsService, deleteUserService, getAllCodeService, getAllUsers, editUserService } from '../../services/userService';
import { toast } from 'react-toastify';


//gender
export const fechGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FECH_GENDER_START
            })
            let res = await getAllCodeService('GENDER');
            if (res && res.errCode === 0) {
                dispatch(fechGenderSuccess(res.data))
            } else {
                dispatch(fechGenderFailed());
            }

        } catch (error) {
            dispatch(fechGenderFailed());
        }

    }
}

export const fechGenderSuccess = (genderData) => ({
    type: actionTypes.FECH_GENDER_SUCCESS,
    data: genderData
})

export const fechGenderFailed = () => ({
    type: actionTypes.FECH_GENDER_FAILED
})

//position

export const fechPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FECH_POSITION_START
            })
            let res = await getAllCodeService('POSITION');
            if (res && res.errCode === 0) {
                dispatch(fechPositionSuccess(res.data))
            } else {
                dispatch(fechPositionFailed());
            }

        } catch (error) {
            dispatch(fechPositionFailed());
        }

    }
}

export const fechPositionSuccess = (positionData) => ({
    type: actionTypes.FECH_POSITION_SUCCESS,
    data: positionData
})

export const fechPositionFailed = () => ({
    type: actionTypes.FECH_POSITION_FAILED
})

// role
export const fechRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FECH_ROLE_START
            })
            let res = await getAllCodeService('ROLE');
            if (res && res.errCode === 0) {
                dispatch(fechRoleSuccess(res.data))
            } else {
                dispatch(fechRoleFailed());
            }

        } catch (error) {
            dispatch(fechRoleFailed());
        }

    }
}

export const fechRoleSuccess = (roleData) => ({
    type: actionTypes.FECH_ROLE_SUCCESS,
    data: roleData
}
)

export const fechRoleFailed = () => ({
    type: actionTypes.FECH_POSITION_FAILED
})

//create user
export const createNewUser = (data) => {
    console.log('data', data)
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserSerVice(data);
            if (res && res.errCode === 0) {
                toast.success('Create a new user success')
                dispatch(saveUserSuccess())
            } else {
                dispatch(saveUserFailed());
                toast.error(res.errMessage)
            }

        } catch (error) {

            dispatch(saveUserFailed());
        }

    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.SAVE_USER_SUCCESS
})

export const saveUserFailed = () => ({
    type: actionTypes.SAVE_USER_FAILED
})

//get all user
export const fechAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers('ALL');
            if (res && res.errCode === 0) {
                dispatch(fechAllUsersSuccess(res.users.reverse()));
            } else {
                dispatch(fechAllUsersFailed());
                toast.error(res.errMessage)
            }

        } catch (error) {

            dispatch(fechAllUsersFailed());
            toast.error(error)
        }

    }
}


export const fechAllUsersSuccess = (users) => ({
    type: actionTypes.FECH_ALLUSER_SUCCESS,
    users: users
})

export const fechAllUsersFailed = () => ({
    type: actionTypes.FECH_ALLUSER_FAILED
})

//delete user
export const deleteUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(data);
            if (res && res.errCode === 0) {
                dispatch(deleteUserSuccess());
                toast.success('Delete user success')
            } else {
                dispatch(deleteUserFailed());
                toast.error(res.errMessage);
            }

        } catch (error) {

            dispatch(deleteUserFailed());
            toast.error(error);
        }

    }
}


export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

// edit user

export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                dispatch(editUserSuccess(data));
                toast.success('Edit user success')
            } else {
                dispatch(deleteUserFailed());
                toast.error(res.errMessage);
            }

        } catch (error) {

            dispatch(editUserFailed());
            toast.error(error);
        }

    }
}


export const editUserSuccess = (data) => ({
    type: actionTypes.EDIT_USER_SUCCESS,
    data: data
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})
//
export const fechTopDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService(10);
            if (res && res.errCode === 0) {
                dispatch(fechTopDoctorsSuccess(res.data));
            } else {
                dispatch(fechTopDoctorsFailed());
            }

        } catch (error) {

            dispatch(fechTopDoctorsFailed());
        }

    }
}

export const fechTopDoctorsSuccess = (data) => ({
    type: actionTypes.FECH_TOP_DOCTORS_SUCCESS,
    data: data
})

export const fechTopDoctorsFailed = () => ({
    type: actionTypes.FECH_TOP_DOCTORS_FAILED
})
// all doctor
export const fechAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctorsService();
            if (res && res.errCode === 0) {
                dispatch(fechAllDoctorsSuccess(res.data));
            } else {
                dispatch(fechAllDoctorsFailed());
            }

        } catch (error) {

            dispatch(fechAllDoctorsFailed());
        }

    }
}

export const fechAllDoctorsSuccess = (data) => ({
    type: actionTypes.FECH_ALL_DOCTORS_SUCCESS,
    data: data
})

export const fechAllDoctorsFailed = () => ({
    type: actionTypes.FECH_ALL_DOCTORS_FAILED
})

//
export const saveDetailsDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            if (res && res.errCode === 0) {
                dispatch(saveDetailDoctorSuccess());
                toast.success(res.errMessage)
            } else {
                dispatch(saveDetailDoctorFailed());
                toast.error(res.errMessage)
            }

        } catch (error) {

            dispatch(saveDetailDoctorFailed());
            toast.error('Save detail doctor has error!')
        }

    }
}

export const saveDetailDoctorSuccess = () => ({
    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
})

export const saveDetailDoctorFailed = () => ({
    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
})

// get detail doctor
export const getDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await getDetailDoctorService(data);
            if (res && res.errCode === 0) {
                dispatch(getDetailDoctorSuccess(res.data));
            } else {
                dispatch(getDetailDoctorFailed());
            }

        } catch (error) {

            dispatch(getDetailDoctorFailed());
        }

    }
}

export const getDetailDoctorSuccess = (data) => ({
    type: actionTypes.FECH_DETAIL_DOCTORS_SUCCESS,
    data: data
})

export const getDetailDoctorFailed = () => ({
    type: actionTypes.FECH_DETAIL_DOCTORS_FAILED
})

// fectch our
export const getAllSchedule = (type) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService(type);
            if (res && res.errCode === 0) {
                dispatch(getAllScheduleSuccess(res.data));
            } else {
                dispatch(getAllScheduleFailed());
            }

        } catch (error) {

            dispatch( getAllScheduleFailed());
        }

    }
}

export const getAllScheduleSuccess = (data) => ({
    type: actionTypes.FECH_ALLCODES_SCHEDULE_TIME_SUCCESS,
    data: data
})

export const getAllScheduleFailed = () => ({
    type: actionTypes.FECH_ALLCODES_SCHEDULE_TIME_FAILED
})
// fech doctor schedule

export const getDoctorSchedule = (doctorId,date) => {
    return async (dispatch, getState) => {
        try {
            let res = await getScheduleByDateService(doctorId,date);
            if (res && res.errCode === 0) {

                dispatch(getDoctorScheduleSuccess(res.data));
            } else {
                dispatch( getDoctorScheduleFailed());
            }

        } catch (error) {

            dispatch( getDoctorScheduleFailed());
        }

    }
}

export const getDoctorScheduleSuccess = (data) => ({
    type: actionTypes.FECH_DOCTOR_SCHEDULE_TIME_SUCCESS,
    data: data
})

export const getDoctorScheduleFailed = () => ({
    type: actionTypes.FECH_DOCTOR_SCHEDULE_TIME_FAILED
})

// save bulk schedule

export const saveBulkSchedule = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveBulkScheduleDoctor(data);
            if (res && res.errCode === 0) {
                dispatch(saveBulkScheduleSuccess());
                toast.success(res.errMessage)
            } else {
                dispatch(deleteUserFailed());
                toast.error(res.errMessage);
            }

        } catch (error) {

            dispatch(saveBulkScheduleFailed());
            toast.error(error);
        }

    }
}


export const saveBulkScheduleSuccess = () => ({
    type: actionTypes.SAVE_BULK_DOCTOR_SCHEDULE_SUCCESS,
})

export const saveBulkScheduleFailed = () => ({
    type: actionTypes.SAVE_BULK_DOCTOR_SCHEDULE_FAILED
})

//fetch doctor info
export const getDoctorInfo = () => {
    return async (dispatch, getState) => {
        try {
            let resPrices = await getAllCodeService('PRICE');
            let resPayments = await getAllCodeService('PAYMENT');
            let resProvinces = await getAllCodeService('PROVINCE');
            let resSpecialties = await getAllSpecialty();
            let resClinics = await getAllClinic();
            if (resPrices && resPrices.errCode === 0 
                && resPayments && resPayments.errCode === 0 
                && resProvinces && resProvinces.errCode === 0
                && resClinics && resClinics.errCode === 0) {
                let data = {
                    resPrices: resPrices.data,
                    resPayments: resPayments.data,
                    resProvinces: resProvinces.data,
                    resSpecialties: resSpecialties.data,
                    resClinics: resClinics.data

                }
                dispatch(getDoctorInfoSuccess(data))
            } else {
                dispatch(getDoctorInfoFailed());
            }

        } catch (error) {
            dispatch(getDoctorInfoFailed());
        }

    }
}

export const getDoctorInfoSuccess = (data) => ({
    type: actionTypes.FECH_ALLCODES_DOCTOR_INFOR_SUCCESS,
    data: data
}
)

export const getDoctorInfoFailed = () => ({
    type: actionTypes.FECH_ALLCODES_DOCTOR_INFOR_FAILED
})