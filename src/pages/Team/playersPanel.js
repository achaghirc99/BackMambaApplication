import React, { useState, useEffect} from 'react'
import TeamDataService from "../../services/Team/team.service"
import { makeStyles } from '@material-ui/core/styles'
import {useHistory} from 'react-router'
import {useMediaQuery, useTheme, Grid, Container } from '@material-ui/core';
import PlayersCard from '../../components/PlayersCards';
const useStyles = makeStyles({
    title: {
      fontSize: 16,
    },
    pos: {
      marginBottom: 12,
    },
    occupied: {
      backgroundColor: '#00cca0',
    },
    free: {
      backgroundColor: '#fff',
    },
    disabled: {
      backgroundColor: '#dddddd',
    },
    cardAction: {
      width: '100%',
    },
    buttonEditar: {
      backgroundColor: '#006e85'
    },
    buttonBorrar: {
      backgroundColor: '#3ef386'
    },
    buttonDeshabilitar: {
      backgroundColor: '#e2e02c'
    },
    snak: {
      marginBottom: '20px',
    }
  })
export default function PlayersDetailsPanel(props) {
    const classes = useStyles();
    const [players, setPlayers] = useState([]);
    const history = useHistory();
    const theme = useTheme();
    const phoneScreen = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        const playersList = JSON.parse(window.sessionStorage.getItem("team")).players;
        setPlayers(playersList);
      }, [history])

    return (
        <div style={{marginBottom:"30px"}}>
        <Container className={phoneScreen? classes.rootPhone : classes.root} maxWidth={"lg"}>
            <h1>Tus jugadores</h1>
            <Grid container spacing={3}>
                {players.map((player) => (
                    <Grid item xs={12} sm={12} md={3} key={player.id}>
                        <PlayersCard {...player}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    </div>
        

    )

}