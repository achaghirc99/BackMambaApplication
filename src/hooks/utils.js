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

}

export default new Utiles();