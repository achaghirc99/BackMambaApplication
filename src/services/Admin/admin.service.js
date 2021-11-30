import http from "../../http-common";
import authHeader from '../Authentication/auth-header'

class AdminDataService {

    refreshMarkets() {
        return http.get(`/admin/refreshMarkets`,{headers: authHeader()});
    }
    getAllUsersFromSystem() {
        return http.get(`/admin/manageAllUsers`,{headers: authHeader()});
    }
    getAllComunitiesFromSystem() {
        return http.get(`/admin/manageAllComunities`,{headers: authHeader()});
    }
    manageAdminOffers() {
        return http.post(`/admin/manageAdminOffers`,{headers: authHeader()});
    }
}

export default new AdminDataService();