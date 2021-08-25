import React, {useState, useEffect} from 'react'
import { makeStyles, ButtonBase, Grid, Typography, CardContent, Badge, Avatar, Button, CardActions, CircularProgress, Backdrop, Modal, TextField, Snackbar, Paper, Tooltip } from "@material-ui/core";
import useUser from "../../hooks/useUser";
import {useHistory} from "react-router-dom";
import OfferDataService from '../../services/OfferService/offer.service';
import ComunidadDataService from "../../services/Comunidad/comunity.service";
import TeamDataService from "../../services/Team/team.service";
import {MyAvatar} from '../../components/SmallAvatars';
import { Alert } from '@material-ui/lab';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import Utiles from "../../hooks/utils";
const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 100,
        background: "linear-gradient(90deg, #ff760061 70%, #f27407 80%)"
    },
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
          margin: theme.spacing(1),
          width: theme.spacing(40),
          height: theme.spacing(8),
        },
       
    },
    paper2: {
        padding: theme.spacing(1),
        background: 'linear-gradient(180deg, #cdc9c961 70%, #00000042 80%)',
        filter: `alpha(opacity=30)`,
        maxWidth: '85%',
        margin: '10px auto'
    },
    paperAdvise: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #f17306',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        margin: "20% 0% 20% 40%"
    },
    paperCentered: {
        alignItems:"center",
        justifyContent:"center",
        margin: "20px auto",
        background:'linear-gradient(45deg, #f17306 70%, #000000 80%)'
    },
    teamName: {
        textAlign: "center",
        fontSize: "23px",
        margin: "19px auto",
        fontFamily: "fantasy",
        color: "#fafafa"
    },
    gridContainerStatics: {
        margin: "40px auto"
    },
    avatarPlayer: {
        height:theme.spacing(8),
        width:theme.spacing(8),
        filter : 'brightness(1.1)',
        mixBlendMode: 'multiply'
    }, 
    gridPlayers: {
        padding: "30px"
    },
    pointsSize: {
        fontSize : "15px"
    },
    positionSize: {
        fontSize : "15px",
        backgroundColor: "#fafafa",
    },
    botonVerMas: {
        margin : "0 auto",
        background : 'linear-gradient(45deg, #f17306 70%, #000000 80%)'
    },
    containerMarketPlayers: {
        backgroundColor: "#f5f5f5"
    }, 
    divTitle: {
        margin : "30px auto",
        textAlign: "center"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularStyle : {
        color: theme.palette.warning.dark
    },
    avatarPlayer: {
        height:theme.spacing(12),
        width:theme.spacing(12),
        objectFit: "fill",
        filter : 'brightness(1.1)',
        mixBlendMode: 'multiply',
        marginRight: '10px'
    }, 
    realTeamImg: { 
        zIndex: '1',
        right: '20px',
        boxSizing: 'content-box',
        filter : 'brightness(1.1)',
        mixBlendMode: 'multiply',
        marginLeft:'7px'
    },
    playerJourneyPoints :{
        display : 'flex', 
        marginLeft:'6px',
        alignItems: 'center'
    },
    playerName: {
        display : 'flex', 
        alignItems: 'center'
    },
    playerPosition: {
        display : 'flex', 
        alignItems: 'center',
        marginLeft: '15px'
    },
    playerTeamName : {
        display : 'flex', 
        marginLeft:'6px',
        justifyContent: 'center'
    }
}))



export const  MarketPlayers = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [openModalOffer, setOpenModalOffer] = useState(false);
    const [showSuccessOffer, setShowSuccessOffer] = useState(false);
    const [marketPlayers, setMarketPlayers] = useState([]);
    const [myPlayers, setMyPlayers] = useState([]);
    const [comunity, setComunity] = useState([]);
    const [actualTeam, setActualTeam] = useState(JSON.parse(sessionStorage.getItem('team')));
    const [offerAmount, setOfferAmount] = useState(undefined);
    const {auth} = useUser();
    const history = useHistory();
    const [showSuccessStatusChange, setShowSuccessStatusChange] = useState(false);

    //Objeto Oferta
    const [offer, setOffer] = useState({
        comunity : undefined, 
        actualTeam: undefined, 
        offerTeam : undefined,
        player : undefined,
        offerAmount: undefined 
    })

    useEffect(() => {
        if(!auth) {
            history.push('/signup')
        }else{
            setLoading(true)
            console.log(props);
            ComunidadDataService.getOneComunity(auth.id).then((response) => {    
                let playersToTransfer = response.data.players.filter(player => player.status === 'Transferible' && actualTeam.name !== player.team.name);
                let myPlayersToTransfer = response.data.players.filter(player => player.status === 'Transferible' && actualTeam.name === player.team.name);
                setMarketPlayers(playersToTransfer);
                setMyPlayers(myPlayersToTransfer)
                setComunity(response.data);
                setLoading(false);    
            })
        }
    }, [history, auth])

    const handleChange = (e) => { 
        setOfferAmount(e.target.value);
    }

    const handleSubmit = () => { 
        const noffer = offer;
        noffer.offerAmount = parseInt(offerAmount);
        setOffer(noffer);

        OfferDataService.createOffer(offer).then((res) => { 
            setOpenModalOffer(false)
            setShowSuccessOffer(true);  
        })
        
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenModalOffer(false);      
        setShowSuccessOffer(false);  
    };

    const prepareOffer = (player) => { 
        setOpenModalOffer(true);
        setOffer({...offer, 
                comunity : comunity, 
                actualTeam: player.team, 
                offerTeam : actualTeam,
                player : player
            })
    }

    const deletePlayersFromMarket = (player) => {
        var status = "ConEquipo"
        TeamDataService.actualizaJugadorDelEquipo(actualTeam._id,player._id,status).then(() => {
            const players = myPlayers; 
            const indexOf = players.findIndex(p => p._id === player._id);
            players.splice(indexOf, 1)
            setMyPlayers(players);
            setShowSuccessStatusChange(true);
        })
    }
    
    return (
        <CardContent className={classes.containerMarketPlayers}>
            <Typography variant="h4" align='center' style={{margin : '20px auto'}}>
                Disponibles
            </Typography>
            <Grid container >
                {marketPlayers.map((player) => (
                    <Grid item align="center" justifyContent="center" xs={12} md={6} lg={4}>
                        <Paper className={classes.paper2}>
                            <ButtonBase onClick={() => prepareOffer(player)}>
                                <div style={{display: 'flex'}}>
                                    <MyAvatar variant='square' alt={player.name} src={player.playerImg} className={classes.avatarPlayer}/>
                                    <Grid container>
                                        <Grid item xs={12} className={classes.playerJourneyPoints}>
                                            <Tooltip title={player.team.name} aria-label="add">
                                                <Avatar alt={player.name} src={player.team.image} className={classes.realTeamImg} /> 
                                            </Tooltip>
                                            <Typography variant='h6' className={classes.playerPosition}>
                                                {Utiles.formatoPosicion(player.position)}
                                            </Typography>
                                            <Typography variant='h6' className={classes.playerPosition}>
                                                <SyncAltIcon />
                                            </Typography>
                                            <Typography variant='h6' className={classes.playerPosition}>
                                                <p style={{color: '#32ab62'}}>{Utiles.formatoES(player.transferValue)}€</p>
                                            </Typography>                   
                                        </Grid>
                                        <Grid item xs={12} className={classes.playerJourneyPoints}>
                                            {player.points < 0 ? 
                                                <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#ff3b00f2', marginLeft:'7px'}}>{player.points}</MyAvatar>
                                                :
                                                <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#32ab62', marginLeft:'7px'}}>{player.points}</MyAvatar>    
                                            }
                                            <Typography variant='h6' className={classes.playerName}>
                                                {player.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </div>
                            </ButtonBase>
                        </Paper>                                      
                    </Grid>    
                ))
                }
            </Grid>
            <Typography variant="h4" align='center' style={{margin : '20px auto'}}>
                Mis jugadores en el mercado
            </Typography>
            <Grid container >
                {myPlayers.map((player) => (
                    <Grid item align="center" justifyContent="center" xs={12} md={6} lg={4}>
                        <Paper className={classes.paper2}>
                            <div style={{display: 'flex'}}>
                                <MyAvatar variant='square' alt={player.name} src={player.playerImg} className={classes.avatarPlayer}/>
                                <Grid container>
                                    <Grid item xs={12} className={classes.playerJourneyPoints}>
                                        <Tooltip title={player.team.name} aria-label="add">
                                            <Avatar alt={player.name} src={player.team.image} className={classes.realTeamImg} /> 
                                        </Tooltip>
                                        <Typography variant='h6' className={classes.playerPosition}>
                                            {Utiles.formatoPosicion(player.position)}
                                        </Typography>
                                        <Typography variant='h6' className={classes.playerPosition}>
                                            <SyncAltIcon />
                                        </Typography>
                                        <Typography variant='h6' className={classes.playerPosition}>
                                            <p style={{color: '#32ab62'}}>{Utiles.formatoES(player.transferValue)}€</p>
                                        </Typography>                  
                                    </Grid>
                                    <Grid item xs={12} className={classes.playerJourneyPoints}>
                                        {player.points < 0 ? 
                                            <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#ff3b00f2', marginLeft:'7px'}}>{player.points}</MyAvatar>
                                            :
                                            <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#32ab62', marginLeft:'7px'}}>{player.points}</MyAvatar>    
                                        }
                                        <Typography variant='h6' className={classes.playerName}>
                                            {player.name}
                                        </Typography>
                                        <Button onClick={() => deletePlayersFromMarket(player)}><DeleteSweepIcon /></Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Paper>                           
                    </Grid>    
                ))
                }
            </Grid>
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress className={classes.circularStyle}/>
                </Backdrop>
                <div>
                    <Modal
                      open={openModalOffer}
                      onClose={handleClose}
                      aria-labelledby="simple-modal-title"
                      aria-describedby="simple-modal-description"
                    >
                        <div className={classes.paperAdvise}>
                            <h4 id="simple-modal-title">Introduce una cantidad</h4>
                                <div>
                                    <TextField className='input-title' id="offerAmount" label="Oferta"
                                        name="offerAmount" onChange={(e) => handleChange(e)} />
                                </div>
                            <Button variant="contained" color="secondary" onClick={(e) => handleSubmit(e)}>Ofertar</Button>
                            <Button variant="contained" onClick={() => handleClose()}>Cancelar</Button>
                        </div>
                    </Modal>
                </div>
                <Snackbar open={showSuccessOffer} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="info">
                        Oferta generada correctamente
                    </Alert>
                </Snackbar> 
                <Snackbar open={showSuccessStatusChange} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="info">
                        Jugador eliminado del mercado correctamente
                    </Alert>
                </Snackbar>   
        </CardContent>
    )
    
}