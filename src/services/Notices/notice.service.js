import http from "../../http-common";
import authHeader from '../Authentication/auth-header'

class NoticeDataService {

    noticesNotShowedForUser(userId) { 
        return http.get(`/notice/getNotices/${userId}`,{headers: authHeader()})
    }
    
    allNoticesForComunity(comunityId){
        return http.get(`/notice/allNotices/${comunityId}`,{headers: authHeader()})
    }

    markAsShow(userId, noticeId) { 
        return http.put(`/notice/noticeShowed/${userId}/${noticeId}`,{headers: authHeader()})
    }
}

export default new NoticeDataService();