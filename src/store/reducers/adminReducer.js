import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    isLoadingPosition: false,
    isLoadingRole: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    topDoctors: [],
    scheduleTime:[],
    doctors:[],
    doctorSelected:{},
    doctorScheduleTime:[],
    doctorInforAllcode:{}
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FECH_GENDER_START:
            {
                let coppyState = { ...state };
                coppyState.isLoadingGender = true;
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_GENDER_SUCCESS:
            {
                let coppyState = { ...state }
                coppyState.genders = action.data;
                coppyState.isLoadingGender = false;
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_GENDER_FAILED:
            {
                let coppyState = { ...state };
                coppyState.isLoadingGender = false;
                coppyState.genders = [];
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_POSITION_START:
            {
                let coppyState = { ...state };
                coppyState.isLoadingPosition = true;
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_POSITION_SUCCESS:
            {
                let coppyState = { ...state }
                coppyState.positions = action.data;
                coppyState.isLoadingPosition = false;
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_POSITION_FAILED:
            {
                let coppyState = { ...state };
                coppyState.isLoadingPosition = false;
                coppyState.positions = [];
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_ROLE_START:
            {
                let coppyState = { ...state };
                coppyState.isLoadingRole = true;
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_ROLE_SUCCESS:
            {
                let coppyState = { ...state }
                coppyState.roles = action.data;
                coppyState.isLoadingRole = false;
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_ROLE_FAILED:
            {
                let coppyState = { ...state };
                coppyState.isLoadingRole = false;
                coppyState.roles = [];
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_ALLUSER_SUCCESS:
            {
                let coppyState = { ...state };
                coppyState.users = action.users;
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_ALLUSER_FAILED:
            {
                let coppyState = { ...state };
                coppyState.users = [];
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_TOP_DOCTORS_SUCCESS:
            {
                let coppyState = { ...state };
                coppyState.topDoctors = action.data;
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_TOP_DOCTORS_FAILED:
            {
                let coppyState = { ...state };
                coppyState.topDoctors = [];
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_ALL_DOCTORS_SUCCESS:
            {
                let coppyState = { ...state };
                coppyState.doctors = action.data;
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_ALL_DOCTORS_FAILED:
            {
                let coppyState = { ...state };
                coppyState.doctors = [];
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_DETAIL_DOCTORS_SUCCESS:
            {
                let coppyState = { ...state };
                coppyState.doctorSelected = {...action.data};
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_DETAIL_DOCTORS_FAILED:
            {
                let coppyState = { ...state };
                coppyState.doctorSelected = {};
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_ALLCODES_SCHEDULE_TIME_SUCCESS:
            {
                let coppyState = { ...state };
                coppyState.scheduleTime = [...action.data];
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_ALLCODES_SCHEDULE_TIME_FAILED:
            {
                let coppyState = { ...state };
                coppyState.scheduleTime = [];
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_DOCTOR_SCHEDULE_TIME_SUCCESS:
            {
                let coppyState = { ...state };
                coppyState.doctorScheduleTime = [...action.data];
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_DOCTOR_SCHEDULE_TIME_FAILED:
            {
                let coppyState = { ...state };
                coppyState.doctorScheduleTime = [];
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_ALLCODES_DOCTOR_INFOR_SUCCESS:
            {
                let coppyState = { ...state };
                coppyState.doctorInforAllcode = {...action.data};
                return {
                    ...coppyState
                }
            }
        case actionTypes.FECH_ALLCODES_DOCTOR_INFOR_FAILED:
            {
                let coppyState = { ...state };
                coppyState.doctorInforAllcode = {};
                return {
                    ...coppyState
                }
            }
        default:
            return state;
    }
}

export default adminReducer;