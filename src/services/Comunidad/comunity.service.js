import http from "../../http-common";
import authHeader from '../Authentication/auth-header'

class ComunityDataService {

    getAllComunitys() {
        return http.get(`/comunidades/`,{headers: authHeader()});
    }

    createComunity(object, idUser){
        return http.post(`/comunidades/${idUser}`, object, {headers: authHeader()});
    }

    //joinComunity(object, )
}

export default new ComunityDataService();