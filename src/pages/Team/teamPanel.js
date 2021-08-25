import React, { useState, useEffect, useContext } from 'react'
import {useHistory} from 'react-router'
import TeamDataService from '../../services/Team/team.service'
import useUser from '../../hooks/useUser';
import { Avatar, Container, Paper, Typography, Grid, Card, CardContent, CardHeader, Badge, Button, Backdrop, CircularProgress, Snackbar } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import Utiles from "../../hooks/utils";
import siluetaBasket from '../../static/images/siluetaBasket.jpg'
import Context from '../../context/UserContext';
import Alert from '@material-ui/lab/Alert';
import {SmallAvatarPositive,SmallAvatarNegative,SmallAvatarPosition,SmallAvatarTeamPoints,MyAvatar} from '../../components/SmallAvatars'
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import EuroIcon from '@material-ui/icons/Euro';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import PeopleIcon from '@material-ui/icons/People';
const useStyles = makeStyles((theme) => ({
    root: {

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
    paper3: {
        padding: theme.spacing(1),
        background: 'linear-gradient(180deg, #cdc9c961 70%, #00000042 80%)',
        filter: `alpha(opacity=30)`,
        maxWidth: '75%',
        margin: '10px auto'
    },
    avatarTeamImg: {
        width:"300px",
        height:"300px",
        borderRadius:"150px",
        objectFit: "fill"
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
    dataCenterText: {
        display: "flex",
        alignItems: "center"
    },
    avatarPlayer: {
        height:theme.spacing(8),
        width:theme.spacing(8),
        borderRadius:"100px",
        objectFit: "fill",
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
    gridContainerStatics: {
        margin: "40px auto"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularStyle : {
        color: theme.palette.warning.dark
    },
    budgetBadge : {
        width : theme.spacing(6),
        height : theme.spacing(6)
    },
    pointsTeamSize: {
        fontSize : "20px"
    },
    badgeDiv: { 
        display: "flex",
        alignItems: 'center'
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
    }
}))

export default function TeamDetailsPanel(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [deletePlayer,setDeletePlayers] = useState(false); //Lo uso para lanzar el useEffect despues de eliminar un jugador.
    const [team, setTeam] = useState({})
    const [budget, setBudget] = useState('')
    const [top5PointPlayers, setTop5PointPlayers] = useState([]);
    const [playersToTransfer, setPlayersToTransfer] = useState([]);
    const history = useHistory();
    const {auth} = useUser();
    const {currentTeam} = useContext(Context);
    const [showSuccessStatusChange, setShowSuccessStatusChange] = useState(false);
    useEffect(() => {
        if(!auth){
            history.push('/signup');
        }
        if(currentTeam === ""){
            history.push('/createTeam');
        }
        else{
            setLoading(true);
            TeamDataService.getTeam(auth.id).then((res) => {
                if(res.data === ""){
                    history.push('/createTeam');
                }else{
                    let top5PlayersPoints = res.data.players.sort(Utiles.compare);                
                    setTeam(res.data);
                    setTop5PointPlayers(top5PlayersPoints.slice(0,5));
                    setPlayersToTransfer(res.data.players.filter(player => player.status === 'Transferible'));
                    setBudget(Utiles.formatoES(res.data.budget))
                    setLoading(false);
                }
            })
        }
    },[deletePlayer])

    const deletePlayersFromMarket = (player) => {
        var status = "ConEquipo"
        TeamDataService.actualizaJugadorDelEquipo(team._id,player._id,status).then(() => {
            if(deletePlayer === false){
                setDeletePlayers(true);
            }else{
                setDeletePlayers(false);
            }
            setShowSuccessStatusChange(true);
        })
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSuccessStatusChange(false);
    };

    return (
        <div>
            <Container align="center">
                <div  className={classes.paper}>
                    <Paper elevation={3} className={classes.paperCentered}>
                        <Typography variant="h1" component="h2" className={classes.teamName}>
                            {team.name}
                        </Typography>
                        
                    </Paper>
                </div>
                <Badge
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    classes={{
                        badge : classes.budgetBadge
                    }}
                    badgeContent={
                        <div>
                            <SmallAvatarTeamPoints><p className={classes.pointsTeamSize}>{team.points}</p></SmallAvatarTeamPoints>
                            <Chip
                            label={auth.firstName}
                            icon={<FaceIcon />}
                            />
                            <Chip
                            label={<p>{budget}€</p>}
                            icon={<EuroIcon />}
                            />
                            <Chip
                            label={<p>{team.numPlayers}</p>}
                            icon={<PeopleIcon />}
                            />
                        </div>
                    }
                    
                >
                    <img alt={team.name} src={team.image} className={classes.avatarTeamImg} />
                </Badge>
            </Container>
            <Container>
                <Grid container  spacing={2} className={classes.gridContainerStatics}>
                    <Grid item align="center" xs={12} md={6} lg={6}>
                        <Card variant="outlined">
                            <CardHeader
                                title={
                                    <div className={classes.paper}>
                                        <Paper elevation={3} className={classes.paperCentered}>
                                            <Typography variant="h1" component="h2" className={classes.teamName}>
                                                Mercado
                                            </Typography>
                                        </Paper>
                                    </div>
                                }
                            />
                            <CardContent>
                                <Grid container>
                                    {playersToTransfer.map((player) => (
                                        <Grid item align="center" justifyContent="center" xs={12} md={12}>
                                            <Paper className={classes.paper3}>
                                                <div style={{display: 'flex'}}>
                                                    <MyAvatar variant='square' alt={player.name} src={player.playerImg} className={classes.avatarPlayer}/>
                                                    <Grid container>
                                                        <Grid item xs={12} className={classes.playerJourneyPoints}>
                                                            <Avatar alt={player.name} src={team.image} className={classes.realTeamImg} /> 
                                                            <Typography variant='h6' className={classes.playerPosition}>
                                                                Alero 
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
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item align="center" xs={12} md={6} lg={6}>
                    <Card variant="outlined">
                            <CardHeader
                                title={
                                    <div  className={classes.paper}>
                                        <Paper elevation={3} className={classes.paperCentered}>
                                            <Typography variant="h1" component="h2" className={classes.teamName}>
                                                Top 5 Jugadores
                                            </Typography>
                                        </Paper>
                                    </div>
                                }
                            />
                            <CardContent align="center">
                                <Grid container>
                                    {top5PointPlayers.map((player) => (
                                        <Grid item xs={6} md={6} className = {classes.gridPlayers}>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                                badgeContent={
                                                    player.points < 0 ?
                                                    <SmallAvatarNegative><p className={classes.pointsSize}>{player.points}</p></SmallAvatarNegative>
                                                    :
                                                    <SmallAvatarPositive><p className={classes.pointsSize}>{player.points}</p></SmallAvatarPositive>
                                                }
                                            >
                                                <MyAvatar variant='square' className={classes.avatarPlayer} alt={player.name} src={player.playerImg.split('.')[1] === 'gif' ? siluetaBasket : player.playerImg} />
                                            </Badge>
                                            <Typography variant="body2" component="p">
                                                {player.name} <SmallAvatarPosition><p className={classes.positionSize}>{player.position}</p></SmallAvatarPosition>
                                            </Typography>
                                        </Grid>    
                                    ))
                                    }
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Backdrop className={classes.backdrop} open={loading}>
               <CircularProgress className={classes.circularStyle}/>
            </Backdrop>    
            <Snackbar open={showSuccessStatusChange} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info">
                    Jugador eliminado del mercado correctamente
                </Alert>
            </Snackbar>        
        </div>

    )

}
