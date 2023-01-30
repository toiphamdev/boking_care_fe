import axios from "../axios";
const handleLoginApi = (username, password) => {
    return axios.post('/api/login', { email: username, password: password });
}

const getAllUsers = (userId) => {
    return axios.get(`/api/get-all-users?id=${userId}`, {
        id: userId
    })
}

const createNewUserSerVice = (data) => {
    return axios.post("/api/create-new-user", {
        ...data
    })
}

const deleteUserService = (userId) => {
    return axios.delete("/api/delete-user", {
        data: {
            id: userId
        }
    })
}

const editUserService = (data) => {
    return axios.put("/api/edit-user", data);
}

const getAllCodeService = (type) => {
    return axios.get(`/api/get-allcodes?type=${type}`);
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

const getAllDoctorsService = () => {
    return axios.get('/api/get-all-doctors')
}

const saveDetailDoctorService = (data) => {
    return axios.post("/api/save-info-doctor", {
        ...data
    })
}

const getDetailDoctorService = (id)=>{
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`)
}

const saveBulkScheduleDoctor = (data)=>{
    return axios.post("/api/bulk-create-schedule", {
        ...data
    })
}

const getScheduleByDateService = (doctorId,date)=>{
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
}

const getExtraInfor = (doctorId)=>{
    return axios.get(`/api/get-extra-infor-by-id?doctorId=${doctorId}`);
}

const getDoctorProfile = (doctorId)=>{
    return axios.get(`/api/get-profile-by-id?doctorId=${doctorId}`);
}

const bookingSchedule = (data)=>{
    return axios.post('/api/booking-schedule',data);
}

const verifyBookingSchedule = (data)=>{
    return axios.post('/api/verify-booking-schedule',data);
}
const createNewSpecialty = (data)=>{
    return axios.post('/api/create-new-specialty',data);
}

const getAllSpecialty = ()=>{
    return axios.get('/api/get-all-specialty');
}

const getDetailSpecialty = (id,provinceId)=>{
    return axios.get(`/api/get-specialty-by-id?id=${id}&provinceId=${provinceId}`);
}

const createNewClinic = (data)=>{
    return axios.post('/api/create-new-clinic',data);
}

const getAllClinic = ()=>{
    return axios.get('/api/get-all-clinic');
}

const getDetailClinic = (id)=>{
    return axios.get(`/api/get-clinic-by-id?id=${id}`);
}

const getListPatientForDoctor = (data)=>{
    return axios.get(`/api/get-listpatients-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
}

const confirmScheduleForDoctor = (data)=>{
    return axios.post('/api/confirm-schedule-for-doctor',data);
}

const getSearchResult = (q,type='less')=>{
    return axios.get(`/api/search?q=${encodeURIComponent(q)}&type=${type}`);
}

const deleteClinicById = (id)=>{
    return axios.get(`/api/delete-clinic?id=${id}`);
}

const getSpecialtyById = (id)=>{
    return axios.get(`/api/get-specialty?id=${id}`);
}

const deleteSpecialtyById = (id)=>{
    return axios.get(`/api/delete-specialty?id=${id}`);
}

export {
    handleLoginApi,getAllUsers,createNewUserSerVice,deleteUserService,
    editUserService,getAllCodeService,getTopDoctorHomeService,
    getAllDoctorsService,saveDetailDoctorService,getDetailDoctorService,
    saveBulkScheduleDoctor,getScheduleByDateService,
    getExtraInfor,getDoctorProfile,bookingSchedule,verifyBookingSchedule,
    createNewSpecialty,getAllSpecialty,getDetailSpecialty,
    createNewClinic,getAllClinic,getDetailClinic,getListPatientForDoctor,
    confirmScheduleForDoctor,getSearchResult,deleteClinicById,getSpecialtyById,
    deleteSpecialtyById

}
