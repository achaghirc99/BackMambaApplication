import React, { useState, useEffect } from 'react'
import {useHistory} from 'react-router'
import TeamDataService from '../../services/Team/team.service'
import useUser from '../../hooks/useUser';
import { Avatar, Container, Paper, Typography, Grid, Card, CardContent, CardHeader, Badge, Button } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';

const SmallAvatar = withStyles((theme) => ({
    root: {
      width: 25,
      height: 25,
      border: `1px solid ${theme.palette.warning.light}`,
    },
  }))(Avatar);
const SmallAvatarPosition = withStyles((theme) => ({
    root: {
      width: 25,
      height: 25,
      border: `1px solid ${theme.palette.warning.light}`,
      backgroundColor: "#fafafa",
      color: theme.palette.warning.dark
    },
  }))(Avatar);

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
    paper2: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
          margin: theme.spacing(0),
          width: theme.spacing(40),
          height: theme.spacing(8),
        },
    },
    avatarTeamImg: {
        height:theme.spacing(25),
        width:theme.spacing(25),
        objectFit: "fill"
    },
    paperCentered: {
        alignItems:"center",
        justifyContent:"center",
        margin: "20px auto",
        background:'linear-gradient(45deg, #f17306 70%, #000000 80%)'
    },
    paperCentered2: {
        alignItems:"center",
        justifyContent:"center",
        margin: "2px auto",
    },
    teamName: {
        textAlign: "center",
        fontSize: "23px",
        margin: "19px auto",
        fontFamily: "fantasy",
        color: "#fafafa"
    },
    playerName: {
        float: "left",
        fontSize: "20px",
        margin: "15px auto"
    },
    avatarPlayer: {
        height:theme.spacing(15),
        width:theme.spacing(15),
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


}))


export default function TeamDetailsPanel(props) {
    const classes = useStyles();
    const [team, setTeam] = useState({})
    const [top5PointPlayers, setTop5PointPlayers] = useState([]);
    const [playersToTransfer, setPlayersToTransfer] = useState([]);
    const history = useHistory();
    const {auth} = useUser();
    
    useEffect(() => {
        if(auth){
            TeamDataService.getTeam(auth.id).then((res) => {
                // Si los puntos de todos los jugadores es diferente de los puntos que tiene el equipo los actualizamos
                var playersPonits = checkPointsOfAllPlayers(res.data.players);
                let top5PlayersPoints = res.data.players.sort(compare);
                if(playersPonits !== res.data.points) { 
                    const team = res.data;
                    team.points = playersPonits;
                    TeamDataService.updateTeam(team).then((res) => {
                        setTeam(res.data);
                    })
                }else {
                    setTeam(res.data)
                }
                setTop5PointPlayers(top5PlayersPoints.slice(0,5));
                setPlayersToTransfer(res.data.players.filter(player => player.status === 'Transferible'));
            })
        }else{
            history.push('/signup');
        }
    },[history, auth])

    const getPlayersToTransfer = (players) => {
        let resultado = [];





        return resultado;
    }

    function compare( player1, player2 ) {
        if (player1.points > player2.points ){
          return -1;
        }
        if ( player1.points < player2.points ){
          return 1;
        }
        return 0;
    }
    const checkPointsOfAllPlayers = (players) => {
        let points = 0;
        players.map((player) => { 
            points += player.points
        })
        return points;
    }

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
                <Avatar alt={team.name} src={team.image} className={classes.avatarTeamImg} />
            </Container>
            <Container>
                <Grid container  spacing={2} className={classes.gridContainerStatics}>
                    <Grid item xs={12} md={4} lg={4}>
                        <Card  variant="outlined">
                            <CardHeader align="center" justify="center" alignItems="center"
                                title={
                                    <div className={classes.paper}>
                                        <Paper elevation={3} className={classes.paperCentered}>
                                            <Typography variant="h1" component="h2" className={classes.teamName}>
                                                Estadísticas
                                            </Typography>
                                        </Paper>
                                    </div>
                                }
                            />
                            <CardContent>
                                <Typography variant="h5" component="h5">
                                  Dueño: {auth.firstName}
                                </Typography>
                                <Typography variant="h5" component="h2">
                                  Puntos: {team.points}
                                </Typography>
                                <Typography variant="h5" component="h5">
                                  Presupuesto: {team.budget} €
                                </Typography>
                                <Typography variant="h5" component="h5">
                                  Total Jugadores: {team.numPlayers} €
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item align="center" xs={12} md={4} lg={4}>
                        <Card variant="outlined">
                            <CardHeader
                                title={
                                    <div className={classes.paper}>
                                        <Paper elevation={3} className={classes.paperCentered}>
                                            <Typography variant="h1" component="h2" className={classes.teamName}>
                                                Transferibles
                                            </Typography>
                                        </Paper>
                                    </div>
                                }
                            />
                            <CardContent>
                                <Grid container>
                                    {playersToTransfer.map((player) => (
                                        <Grid item xs={6} md={6} className = {classes.gridPlayers}>
                                            <Badge
                                                overlap="circle"
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                                badgeContent={<SmallAvatar><p className={classes.pointsSize}>{player.points}</p></SmallAvatar>}
                                            >
                                                <Avatar className={classes.avatarPlayer} alt={player.name} src={player.playerImg} />
                                            </Badge>
                                            <Typography variant="body2" component="p">
                                                <p>{player.name} <br></br>{player.transferValue}€</p> 
                                                <SmallAvatarPosition><p className={classes.positionSize}>{player.position}</p></SmallAvatarPosition>
                                            </Typography>
                                            <Button><DeleteSweepIcon /></Button>
                                        </Grid>    
                                    ))
                                    }
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item align="center" xs={12} md={4} lg={4}>
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
                                                overlap="circle"
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                                badgeContent={<SmallAvatar><p className={classes.pointsSize}>{player.points}</p></SmallAvatar>}
                                            >
                                                <Avatar className={classes.avatarPlayer} alt={player.name} src={player.playerImg} />
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
            
           
            
            
        </div>

    )

}
