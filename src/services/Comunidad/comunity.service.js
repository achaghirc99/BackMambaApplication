import http from "../../http-common";
import authHeader from '../Authentication/auth-header'

class ComunityDataService {

    getAllComunitys() {
        return http.get(`/comunidades/`,{headers: authHeader()});
    }

    getOneComunity(idUser) {
        return http.get(`/comunidades/${idUser}`,{headers: authHeader()});
    }
    createComunity(object, idUser){
        return http.post(`/comunidades/${idUser}`, object, {headers: authHeader()});
    }

    joinComunity(object,idComunidad, idUser){
        return http.put(`/comunidades/${idComunidad}/${idUser}`, object, {headers: authHeader()});
    }
    updateComunity(comunity) {
        return http.put(`/comunidades/update`, comunity, {headers: authHeader()});
    }
}

export default new ComunityDataService();