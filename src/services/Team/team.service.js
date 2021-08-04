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

    insertEquipoEnComnunidad(idComunidad, idTeam){ 
        return http.put(`/equipo/insertTeamInComunity/${idComunidad}/${idTeam}`, {headers: authHeader()});
    }
    
    deleteTeam(idTeam,nickName) { 
        return http.delete(`/equipo/deleteTeam/${idTeam}/${nickName}`, {headers: authHeader()});
    }

    changeAlignmente(idTeam,object ) {
        return http.post(`/equipo/changeAlignement/${idTeam}`, object, {headers: authHeader()});
    }

    getTeam(idUser) {
        return http.get(`/equipo/${idUser}`,{headers: authHeader()});
    }
    
    getTeamsByComunidad(idComunidad) {
        return http.get(`/equipo/getEquipo/${idComunidad}`,{headers: authHeader()});
    }
    
    cargarPuntosJornada(jornada) {
        return http.get(`/jugadores/cargarPuntosJornada/${jornada}`,{headers: authHeader()});
    }

    actualizaJugadoresComunidad(jornada) {
        return http.get(`/jugadores/actualizaJugadoresComunidad/${jornada}`,{headers: authHeader()});
    }
    
    actualizaJugadoresEquipo(jornada) {
        return http.get(`/jugadores/actualizaJugadoresEquipo/${jornada}`,{headers: authHeader()});
    }
    actualizaJugadorDelEquipo(idTeam, idPlayer,status) { 
        return http.put(`/jugadores/actualizaJugadorDelEquipo/${idTeam}/${idPlayer}/${status}`,{headers: authHeader()});
    }

    getTeamImage(idImagen) {
        return http.get(`/equipo/getImagen/${idImagen}`,{headers: authHeader()});
    }
}

export default new TeamDataService();