import React, { useState, useEffect} from 'react'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles'
import {useHistory} from 'react-router'
import { Card, CardContent, Typography, CardMedia, CardHeader, Avatar, IconButton, CardActions, Collapse, Popover, Snackbar } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import siluetaBasket from '../static/images/siluetaBasket.jpg';
import TeamDataService from '../services/Team/team.service';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import Alert from '@material-ui/lab/Alert';
import Utiles from '../hooks/utils'
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
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
    },
    imageMedia: {
        width : "100%"
    },
    imageMedia2 : {
        height: "0%",
        filter : 'brightness(1.1)',
        mixBlendMode: 'multiply',
        background: 'transparent'
    },  
    alero: {
        backgroundColor: '#32ab62',
    },
    base: {
        backgroundColor: '#d03940',
    }, 
    alaPivot: {
        backgroundColor: '#f17306',
    },
    escolta: {
        backgroundColor: '#6e3c12'
    },
    pivot: {
        backgroundColor: '#e2e02c'
    },
    pointsColor: {
      backgroundColor: theme.palette.warning.light
    },
    alMercado : {
      margin: "10px 0px 10px 80px"
    },
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
      background: theme.palette.warning.light,
      filter: `alpha(opacity=30)`,
    },
    popoverMessage: {
      fontFamily: 'arial'
    }, 
    avatarPointsPositive: {
      float : 'left', 
      margin: '0px 5px 15px 5px', 
      backgroundColor:'#32ab62'
    },
    avatarPointsNegative: {
      float : 'left', 
      margin: '0px 5px 15px 5px', 
      backgroundColor:'#ff3b00f2'
    }
    }));
export default function PlayersCard(...props) {
    const classes = useStyles();
    const [team, setTeam] = useState();
    const history = useHistory()
    const {_id,name, playerImg, position, realTeam, transferValue, points} = props[0].player
    const puntuations = props[0].player.puntuations.slice(-5);
    const [status, setStatus] = useState(props[0].player.status);
    const [playersOnMarket, setPlayersOnMarket] = useState(props[0].playersOnMarket);
    const [comuMaxPlayersUserMarket, setComuMaxPlayersUserMarket] = useState(props[0].comuMaxPlayersUserMarket);
    const [expanded, setExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showSuccessStatusChange, setShowSuccessStatusChange] = useState(false);
    const [showErrorStatusChange, setShowErrorStatusChange] = useState(false);
    const [showLimitPlayersOnMarket, setShowLimitPlayersOnMarket] = useState(false);
   
    const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handlePopoverClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
    useEffect(() => {
        setTeam(JSON.parse(window.sessionStorage.getItem("team")));
      }, [history])


    const actualizaJugadorATranseferible = (_id,status,playerName) => {
      const idTeam = team._id;
      if(status === 'Transferible'){
        if(playersOnMarket < comuMaxPlayersUserMarket){
          TeamDataService.actualizaJugadorDelEquipo(idTeam,_id,status).then((res) => {
            if(res.status === 200) {
              let playersOnMarketYet = res.data.players.filter(player => player.status === 'Transferible').length;    
              setPlayersOnMarket(playersOnMarketYet);
              setStatus(status);
              setShowSuccessStatusChange(true);
            }else if(res.status === 204) {
              setShowErrorStatusChange(true);
            }
          })
        }else {
          setShowLimitPlayersOnMarket(true)
        }
      }else{
        TeamDataService.actualizaJugadorDelEquipo(idTeam,_id,status).then((res) => {
          let playersOnMarketYet = res.data.players.filter(player => player.status === 'Transferible').length;    
          setPlayersOnMarket(playersOnMarketYet);
          setStatus(status);
          setShowSuccessStatusChange(true);
      })
    }
  }
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setShowSuccessStatusChange(false);
      setShowLimitPlayersOnMarket(false);
      setShowErrorStatusChange(false);
    };

    const positionColor = position === "A" ? classes.alero : position === "B" ? classes.base : position === "E" ? classes.escolta : position === "AP" ? classes.alaPivot : position === "P" ? classes.pivot : null;
    const playerImgFinal = playerImg.split('.')[1] === 'gif' ? siluetaBasket : playerImg;
    const accionMercado = status === "ConEquipo" ? 
            <IconButton onClick = {() => actualizaJugadorATranseferible(_id,"Transferible",name)} aria-label="mover al mercado">
              <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
                <CompareArrowsIcon />
              </Typography>
              <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                  paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography>Mover al mercado</Typography>
              </Popover>
            </IconButton>
          :
            <IconButton onClick = {() => actualizaJugadorATranseferible(_id, "ConEquipo",name)} aria-label="sacar del mercado">
              <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
                <DeleteSweepIcon/>
              </Typography>
              <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                  paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography className={classes.popoverMessage}>Eliminar del mercado</Typography>
              </Popover>
            </IconButton>
    return (
        <div>
           <Card variant="outlined">
                <CardHeader
                    avatar={
                      <Avatar aria-label="recipe" className={positionColor}>
                        {position}
                      </Avatar>
                    }
                    action={
                      points < 0 ? 
                        <Avatar aria-label="recipe" className={classes.avatarPointsNegative}>
                          {points}
                        </Avatar>
                        :
                        <Avatar aria-label="recipe" className={classes.avatarPointsPositive}>
                          {points}
                        </Avatar>
                    }
                    title={name}
                    subheader={realTeam}
                />
                <CardMedia
                  component="img"
                  alt={name}
                  height="200"
                  image={playerImgFinal}
                  title={name}
                  className = {classes.imageMedia2}
                />
                <CardContent align="center">
                    <Typography variant="h5" component="h2">
                      Valor {Utiles.formatoES(transferValue)}€
                    </Typography>
                    <Typography variant="body2" component="p">
                      {status === "ConEquipo" ? 'Con equipo' : status === "Transferible" ? 'Transferible' : 'Libre'}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    {/* <Button>Alinear</Button> */}
                    {accionMercado}
                    <IconButton
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                      })}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent >
                      <div style={{justifyContent:'space-between'}}>
                        {puntuations.map((value, index) => (
                          value <= 0 ?  
                          <Avatar aria-label="recipe" className={classes.avatarPointsNegative}>
                              {value}
                          </Avatar>
                          :
                          <Avatar aria-label="recipe" className={classes.avatarPointsPositive}>
                              {value}
                          </Avatar>
                        ))
                        }
                    </div>
                  </CardContent>
                </Collapse>
            </Card>
            <Snackbar open={showSuccessStatusChange} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info">
                    Jugador cambiado de estado correctamente
                </Alert>
            </Snackbar>
            <Snackbar open={showErrorStatusChange} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info">
                    Un jugador alineado no puede pasar al mercado
                </Alert>
            </Snackbar>
            <Snackbar open={showLimitPlayersOnMarket} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info">
                    Ya has alcanzado el límite de {comuMaxPlayersUserMarket} jugadores en el mercado.
                </Alert>
            </Snackbar>
        </div>
        

    )

}