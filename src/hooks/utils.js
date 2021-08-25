import moment from "moment";

class Utiles {

    compare( player1, player2 ) {
        if (player1.points > player2.points ){
          return -1;
        }
        if ( player1.points < player2.points ){
          return 1;
        }
        return 0;
    }
    
    compareNotices( notice1, notice2 ) {        
        if (moment(notice1.dateOfNotice).isAfter(notice2.dateOfNotice)){
          return -1;
        }
        if (moment(notice1.dateOfNotice).isBefore(notice2.dateOfNotice)){
          return 1;
        }
        return 0;
    }
    compareOffers( offer1, offer2 ) {        
        if (moment(offer1.dateOfOffer).isAfter(offer2.dateOfOffer)){
          return -1;
        }
        if (moment(offer1.dateOfOffer).isBefore(offer2.dateOfOffer)){
          return 1;
        }
        return 0;
    }
  
    moneyFormatSpain(number) { 
      return new Intl.NumberFormat('es-ES',{style : 'currency', currency: 'EUR'}).format(number);
    }

    formatoES(number) {
      const exp = /(\d)(?=(\d{3})+(?!\d))/g;
      const rep = '$1.';
      return number.toString().replace(exp,rep);
    }
    formatoPosicion(posicion) {
      let posRes = posicion;
      switch (posicion) {
        case 'B': 
          posRes = 'Base';
          break;
        case 'P': 
          posRes = 'Pivot';
          break;
        case 'AP': 
          posRes = 'Ala pivot';
          break;
        case 'E': 
          posRes = 'Escolta';
          break;
        case 'A': 
          posRes = 'Alero'
          break;
        default:
          break;
      }

      return posRes;
    }
}

export default new Utiles();