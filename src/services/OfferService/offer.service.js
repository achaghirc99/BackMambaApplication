import http from "../../http-common";
import authHeader from '../Authentication/auth-header'

class OfferDataService {

    createOffer(offer) {
        return http.post(`/offers/createOffer`,offer,{headers: authHeader()});
    }

    getOffersForTeam(teamId) { 
        return http.get(`/offers/getOffer/${teamId}`,{headers: authHeader()})
    }
    getOffersById(offerId) { 
        return http.get(`/offers/getOfferById/${offerId}`,{headers: authHeader()})
    }
    acceptOffer(offerId) { 
        return http.put(`/offers/acceptOffer/${offerId}`,{headers: authHeader()})
    }

    rejectOffer(offerId) { 
        return http.put(`/offers/rejectOffer/${offerId}`,{headers: authHeader()})
    }
}

export default new OfferDataService();