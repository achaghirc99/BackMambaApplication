import http from "../../http-common";
import authHeader from '../Authentication/auth-header'

export default class ComunityDataService {

    getAllComunitys() {
        return http.get(`/comunidades/`,{headers: authHeader()});
    }
}