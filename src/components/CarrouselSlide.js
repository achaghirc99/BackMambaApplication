import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import Grid from "@material-ui/core/Grid";
import { CardHeader, Paper, Typography, CardContent, CardActions, Avatar, Badge, Container } from "@material-ui/core";
import moment from "moment";
import {SmallAvatarNegative, SmallAvatarPositive} from '../components/SmallAvatars'
import offerService from "../services/OfferService/offer.service";
import utils from "../hooks/utils";

const useStyles = makeStyles((theme) => ({
    responsive: {
        maxWidth: "100%",
        maxHeight: "400px",
        height: "auto",
        width: "auto"

    },
    botonDelete: { 
        marginBottom: '15px',
        color: theme.palette.secondary,
        backgroundColor: theme.palette.warning.main
    },
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
          margin: theme.spacing(1),
          width: theme.spacing(40),
          height: theme.spacing(8),
        },
        background : 'linear-gradient(45deg, #f17306 70%, #000000 80%)',
       
    },
    noticeTitle: { 
        color : '#ffffff',
        margin: '10px auto'
    },
    playerAndArrows: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        
    },
    offerAmount: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'space-between',
        alignItems: 'center',
        margin: '10px auto'
    },
    avatarPlayer: {
        height:theme.spacing(10),
        width:theme.spacing(10),
        filter : 'brightness(1.1)',
        mixBlendMode: 'multiply'
    }, 
}))

export default function CarrouselSlide(props) {
    const classes = useStyles()
    const notice = props.content;
    const offer = props.content.offer;
    
    

    const contieneUser = props.contieneUser;
    //const contieneUser = notice.users.filter(user => user._id === props.user.id).length > 0 ? true : false;

    return (
        <Grid container spacing={3} alignItems="center" justify="center" align='center' >
            <Grid item xs={12} align="center" style={{marginTop : '30px'}}>
                <Card variant="outlined">
                    <CardHeader
                        title={
                            <div className={classes.paper}>
                                <Typography variant="h4" component="h4" className={classes.noticeTitle}>
                                    Noticias
                                </Typography>
                            </div>
                        }
                    />
                    <CardContent>
                        {notice.type === 'Transfer' && (offer != null) ? (
                            <Container>
                                <Grid container spacing={3} alignItems="center" justify="center" align='center'>
                                    <Grid item xs={4}>
                                        <div>
                                            <Avatar className={classes.avatarPlayer} alt={offer.actualTeam.name} src={offer.actualTeam.image} />  
                                        </div>
                                        <div>
                                            <Typography variant="p" >
                                                {offer.actualTeam.name}
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <div className = {classes.playerAndArrows}>
                                            <TrendingFlatIcon  style={{margin: '0px 25px 0px 0px'}}/> 
                                            <Avatar className={classes.avatarPlayer} alt={offer.player.name} src={offer.player.playerImg} />
                                            <TrendingFlatIcon style={{margin: '0px 0px 0px 25px'}} /> 
                                        </div>
                                        
                                    </Grid>
                                    <Grid item xs={4}>
                                        <div>
                                            <Avatar className={classes.avatarPlayer} alt={offer.offerTeam.name} src={offer.offerTeam.image} />      
                                        </div>
                                        <div>
                                            <Typography variant="p" >
                                                {offer.offerTeam.name}
                                            </Typography>
                                        </div>                      
                                    </Grid>
                                </Grid>
                                <div className = {classes.offerAmount}>
                                <Typography variant="h5">
                                    {utils.formatoES(offer.offerAmount)}€
                                </Typography>
                                </div>
                            </Container>
                        )
                        :
                        (
                            <Container>
                                <p>{notice.content}</p>
                            </Container>
                        )
                        }
                        <p>{moment(props.content.dateOfNotice).format('DD/MM/yyyy HH:mm')}</p>
                    </CardContent>
                    {contieneUser ? 
                    <Button
                    className={classes.botonDelete}
                    type="button"
                    variant="contained"
                    onClick={props.clickFunction}
                    disabled>
                        Leida
                    </Button>                  
                    :
                    <Button
                        className={classes.botonDelete}
                        type="button"
                        variant="contained"
                        onClick={props.clickFunction}>
                            <DoneIcon/>
                    </Button>
                    }
                    
                </Card>
            </Grid>
        </Grid>

    )
}