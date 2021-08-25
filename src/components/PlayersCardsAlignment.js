import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, CardHeader, Avatar } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
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
    }
    }));
export default function PlayersCardAlignment(props) {
    const classes = useStyles();
    const {name, playerImg, position, realTeam, } = props

    const positionColor = position === "A" ? classes.alero : position === "B" ? classes.base : position === "E" ? classes.escolta : position === "AP" ? classes.alaPivot : position === "P" ? classes.pivot : null;

    return (
        <div>
           <Card variant="outlined">
                <CardHeader
                    avatar={
                      <Avatar aria-label="recipe"  src={playerImg} className={positionColor}></Avatar>
                    }
                    title={name}
                    subheader={realTeam}
                />
            </Card>
        </div>
        

    )

}