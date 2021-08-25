import http from "../../http-common";
import authHeader from '../Authentication/auth-header'

class AdminDataService {

    refreshMarkets() {
        return http.get(`/admin/refreshMarkets`,{headers: authHeader()});
    }
    manageAdminOffers() {
        return http.post(`/admin/manageAdminOffers`,{headers: authHeader()});
    }
}

export default new AdminDataService();