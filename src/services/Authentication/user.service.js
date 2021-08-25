import http from "../../http-common";
import authHeader from '../Authentication/auth-header'

class UserDataService {

    getCurrentUserBackEnd(userId) {
        return http.get(`/user/${userId}`, {headers: authHeader()});
    }

    leaveComunity(userId, comunityId, data) {
        return http.post(`/user/leaveComunity/${userId}/${comunityId}`,data, {headers:authHeader()});
    }
    
    updateUser(userId, newUser){
        return http.put(`/user/update/${userId}`,newUser, {headers:authHeader()});
    }
}

export default new UserDataService();