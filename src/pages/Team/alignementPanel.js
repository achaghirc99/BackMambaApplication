import React, { useState, useEffect} from 'react'
import TeamDataService from "../../services/Team/team.service"
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router'
import {Grid, MenuItem, InputLabel,FormControl, Select, Button, useMediaQuery, useTheme, Avatar, Badge, withStyles, Snackbar, Tooltip, Container, Paper, Typography, Divider, Backdrop, CircularProgress } from '@material-ui/core';
import backgroundBasketCourt from "../../static/images/basketballCourtOrange.jpg"
import useUser from '../../hooks/useUser';
import Alert from '@material-ui/lab/Alert';
import {SmallAvatarPositive,SmallAvatarNegative, MyAvatar} from '../../components/SmallAvatars';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({ 
    root: {
        background: `url(${backgroundBasketCourt}) no-repeat `,
        backgroundSize: 'cover'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: "80%",
        marginBottom:"10%"
    },
    formControlSelectBase: {
        marginTop:"60px", 
        minWidth: "30%",
        marginBottom:"4%"
    },
    
    formControlSelectPivot: {
        marginTop:"60px", 
        minWidth: "30%",
        marginBottom:"10%"
    },
    formControlSelectJouney : {
        minWidth: "30%",
        margin: '10px auto'
    },
    divPlayersList: {
        margin: "0% 0% 0% 40%"
    },
    containerBasePivot :{
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexWrap: 'nowrap',
    },
    submit:{
        margin:"3% 0% 3% 0%",
        backgroundColor: theme.palette.warning.dark,
    },
    pointsSize: {
        fontSize : "15px"
    },
    avatarPointsPositive: {
        backgroundColor:'#32ab62'
    },
    avatarPointsNegative: {
        backgroundColor:'#ff3b00f2'
    },
    paper: {
        padding: theme.spacing(1),
        background: 'linear-gradient(180deg, #cdc9c961 70%, #00000042 80%)',
        filter: `alpha(opacity=30)`,
        maxWidth: '65%',
        margin: '10px auto'
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
        margin: '0 auto'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularStyle : {
        color: theme.palette.warning.dark
    },

  }));

export default function AlignementPanel(props) {
    const classes = useStyles();
    const history = useHistory();
    const {auth} = useUser();
    const [team, setTeam] = useState({});
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const portableScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [playersBase, setPlayersBase] = useState([]);
    const [playersEscolta, setPlayersEscolta] = useState([]);
    const [playersAlaPivot, setPlayersAlaPivot] = useState([]);
    const [playersPivot, setPlayersPivot] = useState([]);
    const [playersAlero, setPlayersAlero] = useState([]);
    const [base] = useState({})
    const [escolta] = useState({})
    const [alaPivot] = useState({})
    const [alero] = useState({})
    const [pivot] = useState({})
    const [players, setPlayers] = useState([])
    const [alignedPlayers,setAlignedPlayers] = useState({
        base: undefined,
        escolta: undefined,
        alaPivot: undefined,
        pivot: undefined,
        alero: undefined
    })
    const [playersOfJourney,setPlayersOfJourney] = useState({
        base: undefined,
        escolta: undefined,
        alaPivot: undefined,
        pivot: undefined,
        alero: undefined
    })
    const [journeys,setJourneys] = useState([]);
    const [open, setOpen] = useState(false);
    const [openIncorrect, setOpenIncorrect] = useState(false);
    const [openPlayerOnMarket, setOpenPlayerOnMarket] = useState(false);
    


    useEffect(() => {
        if(auth){
            setLoading(true);
            TeamDataService.getTeam(auth.id).then((res) => {
                TeamDataService.getJourneysForTeam(res.data._id).then((journeys) => {
                    
                    let playerBase = filterOnePlayerByPosition(res.data.alignedPlayers, "B");
                    let playerEscolta = filterOnePlayerByPosition(res.data.alignedPlayers, "E");
                    let playerAlaPivot = filterOnePlayerByPosition(res.data.alignedPlayers, "AP");
                    let playerPivot = filterOnePlayerByPosition(res.data.alignedPlayers, "P");
                    let playerAlero = filterOnePlayerByPosition(res.data.alignedPlayers, "A");
                    setAlignedPlayers({
                        ...alignedPlayers, 
                        base: playerBase, 
                        escolta: playerEscolta, 
                        alero:playerAlero, 
                        alaPivot: playerAlaPivot, 
                        pivot : playerPivot});
                    setTeam(res.data)
                    setPlayers(res.data.players);
                    //Jugadores de la alineacion
                    cargarJugadoresPorPosicion(res.data.players);
                    setJourneys(journeys.data);
                    setLoading(false);
                })
            })
        }
    },[history])

    const filterOnePlayerByPosition = (players, posicion) => {
        const player = players.filter((player) => {
            if(player.position  === posicion){
                return player;
            }
        })
        return player[0];
    }
    const filterMoreThanOnePlayerByPosition = (players, posicion) => {
        const player = players.filter((player) => {
            if(player.position  === posicion){
                return player;
            }
        })
        return player;
    }
    const cargarJugadoresPorPosicion = (players) => { 
        const base = filterMoreThanOnePlayerByPosition(players, "B");
        const escolta = filterMoreThanOnePlayerByPosition(players, "E");
        const alaPivot = filterMoreThanOnePlayerByPosition(players, "AP");
        const pivot = filterMoreThanOnePlayerByPosition(players, "P");
        const alero = filterMoreThanOnePlayerByPosition(players, "A");
        
        setPlayersAlero(alero);
        setPlayersEscolta(escolta);
        setPlayersBase(base);
        setPlayersAlaPivot(alaPivot);
        setPlayersPivot(pivot);
    }

    const handleChangeAlignement = (event) => {
        if(event.target.name === "base") {
            const playerBase = players.filter (player => {
                return player.name === event.target.value;
            })
            if(playerBase[0].status === 'Transferible') {
                setOpenPlayerOnMarket(true);
            }else{
                setAlignedPlayers({...alignedPlayers, base: playerBase[0]});
            }
        }
        if(event.target.name === "escolta") {
            const playerEscolta = players.filter (player => {
                return player.name === event.target.value;
            })
            if(playerEscolta[0].status === 'Transferible') {
                setOpenPlayerOnMarket(true);
            }else{
                setAlignedPlayers({...alignedPlayers, escolta: playerEscolta[0]});
            }
        }
        if(event.target.name === "alaPivot") {
            const playerAlaPivot = players.filter (player => {
                return player.name === event.target.value;
            })
            if(playerAlaPivot[0].status === 'Transferible') {
                setOpenPlayerOnMarket(true);
            }else{
                setAlignedPlayers({...alignedPlayers, alaPivot: playerAlaPivot[0]});
            }
        }
        if(event.target.name === "alero") {
            const playerAlero = players.filter (player => {
                return player.name === event.target.value;
            })
            if(playerAlero[0].status === 'Transferible') {
                setOpenPlayerOnMarket(true);
            }else{
                setAlignedPlayers({...alignedPlayers, alero: playerAlero[0]});
            }
        }
        if(event.target.name === "pivot") {
            const playerPivot = players.filter (player => {
                return player.name === event.target.value;
            })
            if(playerPivot[0].status === 'Transferible') {
                setOpenPlayerOnMarket(true);
            }else{
                setAlignedPlayers({...alignedPlayers, pivot: playerPivot[0]});
            }
        }
    }
    const handleChargeJourney = (event) => {    
        var idJornada = event.target.value;
        if(idJornada !== "") {
            var jornada = journeys.filter(j => j._id === idJornada)[0];          
            let playerBase = jornada.playersAligned.filter(player => player.position === 'B')[0];
            let playerEscolta = jornada.playersAligned.filter(player => player.position === 'E')[0];
            let playerAlaPivot = jornada.playersAligned.filter(player => player.position === 'AP')[0];
            let playerPivot = jornada.playersAligned.filter(player => player.position === 'P')[0];
            let playerAlero = jornada.playersAligned.filter(player => player.position === 'A')[0];
            setPlayersOfJourney({
                ...playersOfJourney, 
                base: playerBase, 
                escolta: playerEscolta, 
                alero:playerAlero, 
                alaPivot: playerAlaPivot, 
                pivot : playerPivot
            });
        }else {
            setPlayersOfJourney({
                ...playersOfJourney, 
                base: undefined, 
                escolta: undefined, 
                alero:undefined, 
                alaPivot: undefined, 
                pivot : undefined
            });
        }
    }

    const handleSubmitAlignment = () => {
        setLoading(true);
        if(handleValidateAlignment()) {
            const object = {
                base : alignedPlayers.base, 
                alero : alignedPlayers.alero,
                escolta: alignedPlayers.escolta,
                alaPivot: alignedPlayers.alaPivot,
                pivot: alignedPlayers.pivot, 
            }
            TeamDataService.changeAlignmente(team._id, object).then((res) => {
                if(res.status === 200) {
                    setOpen(true)
                }
            }).catch(e => {
                console.log(e);
            })
        }else{
            setOpenIncorrect(true)
        }
        setLoading(false);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setOpenIncorrect(false);
        setOpenPlayerOnMarket(false);
    };
    const handleValidateAlignment = () => {
        var validate  =  true;

        if(alignedPlayers.base === undefined) {
            validate = false;
        } 
        if(alignedPlayers.alero === undefined) {
            validate = false;
        }
        if(alignedPlayers.escolta === undefined){
            validate = false;
        }
        if(alignedPlayers.alaPivot === undefined) {
            validate = false;
        }
        if(alignedPlayers.pivot === undefined) {
            validate = false;
        }
        return validate;
    }
  
    return (
        <div>
            <Grid container align="center" justify="center" alignItems="center">
                <Grid item justify="center" alignItems="center" xs={12} md={6} >
                    <Container maxWidth='sm' className={classes.root}>    
                    <div className={classes.containerBasePivot}>  
                            <FormControl style={{marginTop:'60px'}} color='primary' justify="center" alignItems="center" className={classes.formControlSelectPivot}>
                                <InputLabel id="typeSelectLabel">Pivot</InputLabel>
                                <Select
                                labelId="typeSelectLabelPivot"
                                id="typeSelectLabel"
                                name="pivot"
                                value={alignedPlayers.pivot !== undefined && alignedPlayers.pivot !== null  ? alignedPlayers.pivot.name : ""}
                                variant="standard"
                                onChange={(event) => handleChangeAlignement(event)}
                                >
                                {playersPivot.map((player,index) => (
                                    <MenuItem key={index} value={player.name} >
                                        <div className={classes.containerBasePivot}>
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
                                            <Avatar alt={player.name} src={player.playerImg} />
                                            </Badge>
                                        </div>
                                        <div style={{margin: '15px 0px 0px 10px'}}>
                                            {player.name}
                                        </div>  
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </div>
                        <Grid container align="center" justify="center" alignItems="center" className={classes.containerBasePivot} >
                            <Grid item justify="center" alignItems="center" xs={4} >
                                <FormControl justify="center" alignItems="center" className={classes.formControl}>
                                    <InputLabel id="typeSelectLabel">Alero</InputLabel>
                                    <Select
                                    labelId="demo-controlled-open-select-label"
                                    id="typeSelectLabel"
                                    name= "alero"
                                    value={alignedPlayers.alero !== undefined && alignedPlayers.alero !== null  ? alignedPlayers.alero.name : ""}
                                    variant="standard"
                                    onChange={(event) => handleChangeAlignement(event)}
                                    >
                                        {playersAlero.map((player, index) => (
                                        <MenuItem key={index} value={player.name} >
                                            <div className={classes.containerBasePivot}>
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
                                            <Avatar alt={player.name} src={player.playerImg} />
                                            </Badge>
                                            </div>
                                            <div style={{margin: '15px 0px 0px 10px'}}>
                                                {player.name}
                                            </div>
                                        </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>   
                            <Grid item justify="center" alignItems="center" xs={4} >
                                <FormControl justify="center" alignItems="center" className={classes.formControl}>
                                    <InputLabel id="typeSelectLabel">Escolta</InputLabel>
                                    <Select
                                    labelId="typeSelectLabelEscolta"
                                    id="typeSelectLabel"
                                    name="escolta"
                                    value={alignedPlayers.escolta !== undefined && alignedPlayers.escolta !== null  ? alignedPlayers.escolta.name : ""}
                                    variant="standard"
                                    onChange={(event) => handleChangeAlignement(event)}
                                    >
                                    {playersEscolta.map((player,index) => (
                                        <MenuItem key={index} value={player.name} >
                                            <div className={classes.containerBasePivot}>
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
                                                <Avatar alt={player.name} src={player.playerImg} />
                                                </Badge>
                                            </div>
                                            <div style={{margin: '15px 0px 0px 10px'}}>
                                                {player.name}
                                            </div>
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </Grid>    
                            <Grid item justify="center" alignItems="center" xs={4} >
                                <FormControl justify="center" alignItems="center" className={classes.formControl}>
                                    <InputLabel id="typeSelectLabel">Ala Pivot</InputLabel>
                                    <Select
                                    labelId="typeSelectLabelAlaPivot"
                                    id="typeSelectLabel"
                                    name="alaPivot"
                                    value={alignedPlayers.alaPivot !== undefined && alignedPlayers.alaPivot !== null  ? alignedPlayers.alaPivot.name : ""}
                                    variant="standard"
                                    onChange={(event) => handleChangeAlignement(event)}
                                    >
                                    {playersAlaPivot.map((player, index) => (
                                        <MenuItem key={index} value={player.name} >
                                            <div className={classes.containerBasePivot}>
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
                                                <Avatar alt={player.name} src={player.playerImg} />
                                                </Badge>
                                            </div>
                                            <div style={{margin: '15px 0px 0px 10px'}}>
                                                {player.name}
                                            </div>
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </Grid> 
                        </Grid>
                        <div className={classes.containerBasePivot}>
                            <FormControl justify="center" alignItems="center" className={classes.formControlSelectBase}>
                                <InputLabel id="typeSelectLabel">Base</InputLabel>
                                <Select
                                labelId="demo-controlled-open-select-label"
                                id="typeSelectLabelBase"
                                name="base"
                                value={alignedPlayers.base !== undefined && alignedPlayers.base !== null ? alignedPlayers.base.name : ""}
                                variant="standard"
                                onChange={(event) => handleChangeAlignement(event)}
                                >
                                    {playersBase.map((player, index) => (
                                    <MenuItem key={index} value={player.name} >
                                        <div className={classes.containerBasePivot}>
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
                                            <Avatar alt={player.name} src={player.playerImg} />
                                            </Badge>
                                        </div>
                                        <div style={{margin: '15px 0px 0px 10px'}}>
                                            {player.name}
                                        </div>    
                                    </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <Button align="center" onClick={() => handleSubmitAlignment()} variant="contained" className={classes.submit} startIcon={<SaveIcon />} >Guardar</Button>  
                        </Container>
                </Grid>
                <Grid item justify="center" alignItems="center" xs={12} md={12} lg={6} spacing={3}>
                    <FormControl className={classes.formControlSelectJouney}>
                        <InputLabel id="typeSelectLabel">Alineaciones por Jornadas</InputLabel>
                        <Select
                        labelId="typeSelectLabelJornada"
                        id="typeSelectLabel"
                        name="jornada"
                        variant="standard"
                        onChange={(event) => handleChargeJourney(event)}
                        >
                        <MenuItem key="x" value="" >
                            Seleccione una opción
                        </MenuItem>
                        {journeys.map((journeyTeam,index) => (
                            <MenuItem key={index} value={journeyTeam._id} >
                                Jornada {journeyTeam.journey.journeyNumber}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    
                    {playersOfJourney.base !== undefined && (        
                        <Paper className={classes.paper}>
                            <div style={{display: 'flex'}}>
                                <MyAvatar variant='square' alt={playersOfJourney.base.name} src={playersOfJourney.base.playerImg} className={classes.avatarPlayer}/>
                            <Grid container>
                                <Grid item xs={12} className={classes.playerJourneyPoints}>
                                    <Avatar alt={playersOfJourney.base.name} src={team.image} className={classes.realTeamImg} /> 
                                    <Typography variant='h6' className={classes.playerPosition}>
                                        Base
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.playerJourneyPoints}>
                                    {playersOfJourney.base.points < 0 ? 
                                        <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#ff3b00f2', marginLeft:'7px'}}>{playersOfJourney.base.points}</MyAvatar>
                                        :
                                        <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#32ab62', marginLeft:'7px'}}>{playersOfJourney.base.points}</MyAvatar>    
                                    }
                                    <Typography variant='h6' className={classes.playerName}>
                                        {playersOfJourney.base.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                            </div>
                        </Paper>
                    )}
                    {playersOfJourney.pivot !== undefined && (
                        <Paper className={classes.paper}>
                            <div style={{display: 'flex'}}>
                                <MyAvatar variant='square' alt={playersOfJourney.pivot.name} src={playersOfJourney.pivot.playerImg} className={classes.avatarPlayer}/>
                            <Grid container>
                                <Grid item xs={12} className={classes.playerJourneyPoints}>
                                    <Avatar alt={playersOfJourney.pivot.name} src={team.image} className={classes.realTeamImg} /> 
                                    <Typography variant='h6' className={classes.playerPosition}>
                                        Pivot
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.playerJourneyPoints}>
                                    {playersOfJourney.pivot.points < 0 ? 
                                        <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#ff3b00f2', marginLeft:'7px'}}>{playersOfJourney.pivot.points}</MyAvatar>
                                        :
                                        <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#32ab62', marginLeft:'7px'}}>{playersOfJourney.pivot.points}</MyAvatar>    
                                    }
                                    <Typography variant='h6' className={classes.playerName}>
                                        {playersOfJourney.pivot.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                            </div>
                        </Paper>
                    )}
                    {playersOfJourney.alaPivot !== undefined && (
                        
                        <Paper className={classes.paper}>
                            <div style={{display: 'flex'}}>
                                <MyAvatar variant='square' alt={playersOfJourney.alaPivot.name} src={playersOfJourney.alaPivot.playerImg} className={classes.avatarPlayer}/>
                            <Grid container>
                                <Grid item xs={12} className={classes.playerJourneyPoints}>
                                    <Avatar alt={playersOfJourney.alaPivot.name} src={team.image} className={classes.realTeamImg} /> 
                                    <Typography variant='h6' className={classes.playerPosition}>
                                        Ala Pivot
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.playerJourneyPoints}>
                                    {playersOfJourney.alaPivot.points < 0 ? 
                                        <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#ff3b00f2', marginLeft:'7px'}}>{playersOfJourney.alaPivot.points}</MyAvatar>
                                        :
                                        <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#32ab62', marginLeft:'7px'}}>{playersOfJourney.alaPivot.points}</MyAvatar>    
                                    }
                                    <Typography variant='h6' className={classes.playerName}>
                                        {playersOfJourney.alaPivot.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                            </div>
                        </Paper>
                    )}
                    {playersOfJourney.escolta !== undefined && (      
                        <Paper className={classes.paper}>
                            <div style={{display: 'flex'}}>
                                <MyAvatar variant='square' alt={playersOfJourney.escolta.name} src={playersOfJourney.escolta.playerImg} className={classes.avatarPlayer}/>
                            <Grid container>
                                <Grid item xs={12} className={classes.playerJourneyPoints}>
                                    <Avatar alt={playersOfJourney.escolta.name} src={team.image} className={classes.realTeamImg} /> 
                                    <Typography variant='h6' className={classes.playerPosition}>
                                        Escolta
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.playerJourneyPoints}>
                                    {playersOfJourney.escolta.points < 0 ? 
                                        <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#ff3b00f2', marginLeft:'7px'}}>{playersOfJourney.escolta.points}</MyAvatar>
                                        :
                                        <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#32ab62', marginLeft:'7px'}}>{playersOfJourney.escolta.points}</MyAvatar>    
                                    }
                                    <Typography variant='h6' className={classes.playerName}>
                                        {playersOfJourney.escolta.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                            </div>
                        </Paper>
                    )}
                    {playersOfJourney.alero !== undefined && (
                        <Paper className={classes.paper}>
                            <div style={{display: 'flex'}}>
                                <MyAvatar variant='square' alt={playersOfJourney.alero.name} src={playersOfJourney.alero.playerImg} className={classes.avatarPlayer}/>
                            <Grid container>
                                <Grid item xs={12} className={classes.playerJourneyPoints}>
                                    <Avatar alt={playersOfJourney.alero.name} src={team.image} className={classes.realTeamImg} /> 
                                    <Typography variant='h6' className={classes.playerPosition}>
                                        Alero
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.playerJourneyPoints}>
                                    {playersOfJourney.alero.points < 0 ? 
                                        <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#ff3b00f2', marginLeft:'7px'}}>{playersOfJourney.alero.points}</MyAvatar>
                                        :
                                        <MyAvatar className={classes.realTeamImg} style={{backgroundColor:'#32ab62', marginLeft:'7px'}}>{playersOfJourney.alero.points}</MyAvatar>    
                                    }
                                    <Typography variant='h6' className={classes.playerName}>
                                        {playersOfJourney.alero.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                            </div>
                        </Paper>
                    )}                      
                </Grid>
            </Grid>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info">
                    Alineación guardada correctamente
                </Alert>
            </Snackbar>  
            <Snackbar open={openIncorrect} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">
                    Rellene todas las posiciones para poder guardar la alineación
                </Alert>
            </Snackbar>  
            <Snackbar open={openPlayerOnMarket} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">
                    Recuerde que un jugador que esta en el mercado no puede ser alineado
                </Alert>
            </Snackbar>  
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress className={classes.circularStyle}color="secondary" />
            </Backdrop>
        </div>
    )

}