import React, { useState, useEffect, useContext} from 'react'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles'
import {useHistory} from 'react-router'
import { Card, ButtonBase, CardContent, Typography, Container, CardMedia, CardActionArea, CardHeader, Avatar, IconButton, CardActions, Collapse } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
        height: "0%"
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
    }
    }));
export default function PlayersCard(props) {
    const classes = useStyles();
    const [players, setPlayers] = useState([]);
    const history = useHistory()
    const {name, playerImg, position, realTeam, status, transferValue, points} = props
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
    useEffect(() => {
        const playersList = JSON.parse(window.sessionStorage.getItem("team")).players;
        setPlayers(playersList);
      }, [history])


    const positionColor = position === "A" ? classes.alero : position === "B" ? classes.base : position === "E" ? classes.escolta : position === "AP" ? classes.alaPivot : position === "P" ? classes.pivot : null;

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
                      <Avatar aria-label="recipe">
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
                  image={playerImg}
                  title={name}
                  className = {classes.imageMedia2}
                />
                <CardContent align="center">
                    <Typography variant="h5" component="h2">
                      Valor {transferValue} €
                    </Typography>
                    <Typography variant="body2" component="p">
                      {status === "conEquipo" ? 'Con equipo' : status === "Transferible" ? 'Transferible' : 'Libre'}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <a>Alinear</a>
                    </IconButton>
                    <IconButton aria-label="share">
                      <a>Transferir</a>
                    </IconButton>
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
            </Card>
        </div>
        

    )

}