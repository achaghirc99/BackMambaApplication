import React, {useState, useEffect, useContext} from "react"
import { makeStyles, Grid, withStyles, Typography, Card, CardHeader, CardContent, Badge, Avatar, Button, CardActions, CircularProgress, Backdrop, Modal, Tooltip } from "@material-ui/core";
import useUser from "../../hooks/useUser";
import {useHistory} from "react-router-dom";
import ComunidadDataService from "../../services/Comunidad/comunity.service";
import TeamDataService from "../../services/Team/team.service";
import Utiles from "../../hooks/utils";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import SettingsIcon from '@material-ui/icons/Settings';
import Context from "../../context/UserContext";
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import {SmallAvatarPositive, SmallAvatarNegative, MyAvatar} from '../../components/SmallAvatars';


const StyledTableCell = withStyles((theme) => ({
  head: {
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 100,
        background: 'linear-gradient(180deg, #cdc9c961 70%, #00000042 80%)',
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
        maxWidth: '75%',
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
    }
}))

export default function ComunityDetails(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false)
    const [comunity, setComunity] = useState({});
    const [owner, setOwner] = useState({});
    const [marketPlayers, setMarketPlayers] = useState([]);
    const [comunityPlayers, setComunityPlayers] = useState([]);
    const {auth} = useUser();
    const {setAuth} = useContext(Context);
    const history = useHistory();
    const [ownerLogeado, setOwnerLogeado] = useState(false);
    const [openModalAdvise, setOpenModalAdvise] = useState(false);
    const [idTeamToDelete, setIdTeamToDelete] = useState();
    const [nickNameToDelete, setNickNameToDelete] = useState();
    const team = JSON.parse(sessionStorage.getItem('team')); 

    useEffect(() => {
        if(!auth) {
            history.push('/signup')
        }else{
            setLoading(true)
            ComunidadDataService.getOneComunity(auth.id).then((response) => {
                if(response.data !== ""){
                    TeamDataService.getTeamsByComunidad(response.data._id).then((responseTeams) => {
                        let playersToTransfer = response.data.players.filter(player => player.status === 'Transferible');
                        let comunityTeamsOrdered = responseTeams.data.sort(Utiles.compare);
                        setComunity(response.data);
                        setMarketPlayers(playersToTransfer.slice(0,4));
                        setComunityPlayers(comunityTeamsOrdered);
                        setOwner(response.data.owner);
                        const esOwner = response.data.owner._id === auth.id;
                        setOwnerLogeado(esOwner);
                        setLoading(false);
                    })
                }else {
                    TeamDataService.getTeam(auth.id).then((res) => {
                        if(res.data === ""){
                            history.push("/")
                            window.sessionStorage.removeItem('user')
                            window.sessionStorage.removeItem('team')
                            setAuth(null);
                        }
                    })
                }
                })
        }
    }, [history, auth, setAuth])

    const deleteTeamByIdAndExitComunity = (idTeam, nickName) => {
        if (ownerLogeado && (owner.nickName === nickName)){
            setIdTeamToDelete(idTeam);
            setNickNameToDelete(nickName);
            setOpenModalAdvise(true);        
        }else {
            TeamDataService.deleteTeam(idTeam,nickName).then((res) => {
                if(res.status === 200) { 
                    TeamDataService.getTeamsByComunidad(comunity._id).then((responseTeams) => {
                        if(responseTeams.data === "") {
                            history.go(0);
                        }else{
                            let comunityTeamsOrdered = responseTeams.data.sort(Utiles.compare); 
                            setComunityPlayers(comunityTeamsOrdered);
                        }
                    })
                }else {
                    window.alert(res.data);
                }
            })
        }
    }
    const deleteTeamAfterPopUpById = () => {
        TeamDataService.deleteTeam(idTeamToDelete, nickNameToDelete).then((res) => {
            if(res.status === 200) { 
                history.go(0);
                // TeamDataService.getTeamsByComunidad(comunity._id).then((responseTeams) => {
                //     if(responseTeams.data === ""){
                //         history.push('/community')
                //     }else{
                //         let comunityTeamsOrdered = responseTeams.data.sort(Utiles.compare); 
                //         setComunityPlayers(comunityTeamsOrdered);
                //     }
                // })
                window.alert(res.data);
            }else {
                window.alert(res.data);
            }
        })
    }



    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenModalAdvise(false);        
    };

    return (
        <div style={{ maxWidth: 1400, margin: '50px auto', marginBottom: "10%" }}>
            <div className = {classes.divTitle}>
                <Typography variant="h4" component="h2" style={{color: '#000000'}}>
                    {comunity.name}
                    {ownerLogeado && (
                        <Button  onClick = {() => history.push({
                            pathname: '/comunityConfig',
                            state: { comunity: comunity,
                                     owner: owner, 
                                     ownerLogeado: ownerLogeado    
                                }
                          },
                          )}><SettingsIcon/></Button>            
                    )
                    }
                </Typography>
                <Typography variant="body2" component="p">
                    Creada por {owner.firstName}
                </Typography>
            </div>
            <Grid container spacing={3} style={{ maxWidth: 1100, margin: '50px auto', marginBottom: "10%" }}>
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="customized table">
                          <TableHead>
                            <TableRow >
                                <StyledTableCell style={{color: '#000000'}}>Posición</StyledTableCell>
                                <StyledTableCell style={{color: '#000000'}} align="left">Usuario</StyledTableCell>
                                <StyledTableCell style={{color: '#000000'}} align="left">Equipo</StyledTableCell>
                                <StyledTableCell style={{color: '#000000'}} align="left">Puntos</StyledTableCell>
                                {ownerLogeado && (
                                    <StyledTableCell style={{color: '#000000'}} align="left">Eliminar</StyledTableCell>     
                                )
                                }
                              
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {comunityPlayers.map((team, index) => (
                              <StyledTableRow key={team.name}>
                                <StyledTableCell component="th" scope="row">{index+1}</StyledTableCell>
                                <StyledTableCell align="left">{team.user.firstName}</StyledTableCell>
                                <StyledTableCell align="left">{team.name}</StyledTableCell>
                                <StyledTableCell align="left">{team.points}</StyledTableCell>
                                {ownerLogeado && (
                                   <Button onClick = {() => deleteTeamByIdAndExitComunity(team._id,team.user.nickName)}><DeleteSweepIcon/></Button>           
                                )
                                }
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardHeader className={classes.containerMarketPlayers}
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
                        <CardContent className={classes.containerMarketPlayers}>
                            <Grid container >
                                {marketPlayers.map((player) => (
                                    <Grid item align="center" justifyContent="center" xs={12} md={12}>
                                        <Paper className={classes.paper2}>
                                            <div style={{display: 'flex'}}>
                                                <MyAvatar variant='square' alt={player.name} src={player.playerImg} className={classes.avatarPlayer}/>
                                                <Grid container>
                                                    <Grid item xs={12} className={classes.playerJourneyPoints}>
                                                        <Tooltip title={player.team.name} aria-label="add">
                                                            <Avatar alt={player.name} src={player.team.image} className={classes.realTeamImg} /> 
                                                        </Tooltip>
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
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </Paper>
                                    </Grid>    
                                ))
                                }
                            </Grid>
                        </CardContent>
                        <CardActions className={classes.containerMarketPlayers}>
                            <Button className={classes.botonVerMas} onClick={() => history.push('market')}>Ver mas...</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            
            <Backdrop className={classes.backdrop} open={loading}>
               <CircularProgress className={classes.circularStyle}/>
            </Backdrop>
            <div>
                <Modal
                  open={openModalAdvise}
                  onClose={handleClose}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                    <div className={classes.paperAdvise}>
                        <h2 id="simple-modal-title">Eres el administrador de la comunidad. ¿Estás seguro de que deseas abandonar?</h2>
                        <Button variant="contained" color="secondary" onClick={() => deleteTeamAfterPopUpById()}>Abandonar</Button>
                        <Button variant="contained" onClick={() => handleClose()}>Cancelar</Button>
                    </div>
                </Modal>
            </div>
        </div>
    )


}