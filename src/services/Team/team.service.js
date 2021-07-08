import http from "../../http-common";
import authHeader from '../Authentication/auth-header'

class TeamDataService {

    getAllTeams() {
        return http.get(`/comunidades/`,{headers: authHeader()});
    }

    createTeam(object, idUser, idComunidad){
        return http.post(`/equipo/create/${idComunidad}/${idUser}/`, object, {headers: authHeader()});
    }
    
    updateTeam(object) {
        return http.put(`/equipo/edit/`, object, {headers: authHeader()});
    }

    changeAlignmente(idTeam,object ) {
        return http.post(`/equipo/changeAlignement/${idTeam}`, object, {headers: authHeader()});
    }

    getTeam(idUser) {
        return http.get(`/equipo/${idUser}`,{headers: authHeader()});
    }
}

export default new TeamDataService();