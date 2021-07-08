import React, { useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types';
import TeamDataService from "../../services/Team/team.service"
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router'
import { Card, CardMedia, CardActionArea, CardContent, Typography,Container, Grid, MenuItem, InputLabel,FormControl, Select, 
    ButtonBase,Button, useMediaQuery, useTheme, Avatar, NativeSelect, Badge, withStyles } from '@material-ui/core';
import backgroundBasketCourt from "../../static/images/basketballCourtOrange.jpg"
import useUser from '../../hooks/useUser';
import PlayersCardAlignment from '../../components/PlayersCardsAlignment';

const SmallAvatar = withStyles((theme) => ({
    root: {
      width: 25,
      height: 25,
      border: `1px solid ${theme.palette.warning.light}`,
    },
  }))(Avatar);
const useStyles = makeStyles((theme) => ({ 
    root: {
        background: `url(${backgroundBasketCourt}) no-repeat `,
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

    divPlayersList: {
        margin: "0% 0% 0% 40%"
    },
    containerBasePivot :{
        width: "37%"
    },
    submit:{
        margin:"3% 0% 3% 0%",
        backgroundColor: theme.palette.warning.dark,

    },
    pointsSize: {
        fontSize : "15px"
    }

  }));

export default function AlignementPanel(props) {
    const classes = useStyles();
    const history = useHistory();
    const {auth} = useUser();
    const [team, setTeam] = useState({});
    const [type, setType] = useState();
    const theme = useTheme();
    const portableScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [playersBase, setPlayersBase] = useState([]);
    const [playersEscolta, setPlayersEscolta] = useState([]);
    const [playersAlaPivot, setPlayersAlaPivot] = useState([]);
    const [playersPivot, setPlayersPivot] = useState([]);
    const [playersAlero, setPlayersAlero] = useState([]);
    const [base, setBase] = useState({})
    const [escolta, setEscolta] = useState({})
    const [alaPivot, setAlaPivot] = useState({})
    const [alero, setAlero] = useState({})
    const [pivot, setPivot] = useState({})
    const [players, setPlayers] = useState([])
    const [alignedPlayers,setAlignedPlayers] = useState({
        base: undefined,
        escolta: undefined,
        alaPivot: undefined,
        pivot: undefined,
        alero: undefined
    })
    const [open, setOpen] = React.useState(false);
    


    useEffect(() => {
        if(auth){
            TeamDataService.getTeam(auth.id).then((res) => {
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
            setAlignedPlayers({...alignedPlayers, base: playerBase[0]});
        }
        if(event.target.name === "escolta") {
            const playerEscolta = players.filter (player => {
                return player.name === event.target.value;
            })
            setAlignedPlayers({...alignedPlayers, escolta: playerEscolta[0]});
        }
        if(event.target.name === "alaPivot") {
            const playerAlaPivot = players.filter (player => {
                return player.name === event.target.value;
            })
            setAlignedPlayers({...alignedPlayers, alaPivot: playerAlaPivot[0]});
        }
        if(event.target.name === "alero") {
            const playerAlero = players.filter (player => {
                return player.name === event.target.value;
            })
            setAlignedPlayers({...alignedPlayers, alero: playerAlero[0]});
        }
        if(event.target.name === "pivot") {
            const playerPivot = players.filter (player => {
                return player.name === event.target.value;
            })
            setAlignedPlayers({...alignedPlayers, pivot: playerPivot[0]});
        }
    }

    const handleSubmitAlignment = () => {
        
        if(handleValidateAlignment) {
            const object = {
                base : alignedPlayers.base, 
                alero : alignedPlayers.alero,
                escolta: alignedPlayers.escolta,
                alaPivot: alignedPlayers.alaPivot,
                pivot: alignedPlayers.pivot, 
            }
            TeamDataService.changeAlignmente(team._id, object).then((res) => {
                if(res.status === 200) {
                    window.alert('Alignment modificated correctly');
                }
            }).catch(e => {
                console.log(e);
            })
        }

    }
    const handleValidateAlignment = () => {
        var validate  =  true;

        if(base === undefined) {
            validate = false;
        } 
        if(alero === undefined) {
            validate = false;
        }
        if(escolta === undefined){
            validate = false;
        }
        if(alaPivot === undefined) {
            validate = false;
        }
        if(pivot === undefined) {
            validate = false;
        }

        return validate;
    }
  
    return (
        <div>
            <div align="center">
                <Grid container align="center" justify="center" alignItems="center" className={classes.containerBasePivot}>   
                    <Grid item justify="center" alignItems="center" xs={12} >
                        <FormControl style={{marginTop:'25px'}} justify="center" alignItems="center" className={classes.formControlSelectPivot}>
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
                                    <Badge
                                      overlap="circle"
                                      anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                      }}
                                      badgeContent={<SmallAvatar><p className={classes.pointsSize}>{player.points}</p></SmallAvatar>}
                                    >
                                    <Avatar alt={player.name} src={player.playerImg} />
                                    </Badge>
                                    {player.name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Grid>    
                </Grid> 
                <Grid container align="center" justify="center" alignItems="center" className={classes.containerBasePivot} >
                    <Grid item justify="center" alignItems="center" xs={4}>
                        <FormControl style={{marginTop:'25px'}} justify="center" alignItems="center" className={classes.formControl}>
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
                                    <Badge
                                      overlap="circle"
                                      anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                      }}
                                      badgeContent={<SmallAvatar><p className={classes.pointsSize}>{player.points}</p></SmallAvatar>}
                                    >
                                    <Avatar alt={player.name} src={player.playerImg} />
                                    </Badge>
                                    {player.name}
                                </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>   
                    <Grid item justify="center" alignItems="center" xs={4} >
                        <FormControl style={{marginTop:'25px'}} justify="center" alignItems="center" className={classes.formControl}>
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
                                    <Badge
                                      overlap="circle"
                                      anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                      }}
                                      badgeContent={<SmallAvatar><p className={classes.pointsSize}>{player.points}</p></SmallAvatar>}
                                    >
                                    <Avatar alt={player.name} src={player.playerImg} />
                                    </Badge>
                                    {player.name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Grid>    
                    <Grid item justify="center" alignItems="center" xs={4} >
                        <FormControl style={{marginTop:'25px'}} justify="center" alignItems="center" className={classes.formControl}>
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
                                    <Badge
                                      overlap="circle"
                                      anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                      }}
                                      badgeContent={<SmallAvatar><p className={classes.pointsSize}>{player.points}</p></SmallAvatar>}
                                    >
                                    <Avatar alt={player.name} src={player.playerImg} />
                                    </Badge>
                                    {player.name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Grid> 
                </Grid>
                <Grid container align="center" justify="center" alignItems="center" className={classes.containerBasePivot}>
                    <Grid item justify="center" alignItems="center" xs={12} >
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
                                    <Badge
                                      overlap="circle"
                                      anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                      }}
                                      badgeContent={<SmallAvatar><p className={classes.pointsSize}>{player.points}</p></SmallAvatar>}
                                    >
                                    <Avatar alt={player.name} src={player.playerImg} />
                                    </Badge>
                                    {player.name}
                                </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>  
                <Button align="center" onClick={() => handleSubmitAlignment()} variant="contained" className={classes.submit} >Guardar alineacion</Button>  
                </div>

        </div>
    )

}