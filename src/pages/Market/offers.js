import React, {useState, useEffect} from 'react'
import useUser from '../../hooks/useUser';
import {useHistory} from 'react-router-dom';
import OfferDataService from '../../services/OfferService/offer.service';
import { makeStyles, Grid, Typography, CardContent, Badge, Avatar, Button, CardActions, CircularProgress, Backdrop, Modal, TextField, Snackbar, Paper } from "@material-ui/core";
import Utiles from "../../hooks/utils";
import {SmallAvatarPositive, SmallAvatarNegative} from '../../components/SmallAvatars';
import { Alert } from '@material-ui/lab';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import { green, red } from '@material-ui/core/colors';

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
    paperAccepted: {
        padding: theme.spacing(1),
        background: 'linear-gradient(180deg,#cdc9c961 70%, #32ab62 80%)',
        filter: `alpha(opacity=30)`,
        maxWidth: '85%',
        margin: '10px auto'
    },
    paperRejected: {
        padding: theme.spacing(1),
        background: 'linear-gradient(180deg,#cdc9c961 70%, #cc3c0a 80%)',
        filter: `alpha(opacity=30)`,
        maxWidth: '85%',
        margin: '10px auto'
    },
    paperPendInac: {
        padding: theme.spacing(1),
        background: 'linear-gradient(180deg,#cdc9c961 70%, #00000042 80%)',
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
        height:theme.spacing(10),
        width:theme.spacing(10),
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
    botonMas: {
        display: 'flex',
        justifyContent: 'center'
    }
}))

export default function Offers(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [offersDone, setOffersDone] = useState([]); 
    const [offersRecived, setOffersRecived] = useState([]);
    const [allOffersDone, setAllOffersDone] = useState([]); 
    const [allOffersRecived, setAllOffersRecived] = useState([]);
    const [indexOffersDone, setIndexOffersDone] = useState(6)
    const [indexOffersRecived, setIndexOffersRecived] = useState(6)
    const [showSuccessOfferAccepted, setShowSuccessOfferAccepted] = useState(false); 
    const [showSuccessOfferRejected, setShowSuccessOfferRejected] = useState(false); 
    const {auth} = useUser(); 
    const history = useHistory();
    const team = props;
    
    useEffect(() => { 
        if (!auth) {
            history.push("/");
        } else {
            setLoading(true)
            OfferDataService.getOffersForTeam(team._id).then((res) => { 
                if(res.status === 200) { 
                    const offersRecived = res.data.filter(offer => offer.actualTeam._id === team._id);
                    const offersDone = res.data.filter(offer => offer.offerTeam._id === team._id);             
                    setAllOffersDone(offersDone);
                    setAllOffersRecived(offersRecived);

                    const offerDoneCopi = [...offersDone]; 
                    const offerRecivedCopi = [...offersRecived]; 


                    const onlySixOffersDone = offerDoneCopi.splice(0, indexOffersDone);
                    const onlySixOffersRecived = offerRecivedCopi.splice(0, indexOffersRecived);        
                    setOffersRecived(onlySixOffersRecived);
                    setOffersDone(onlySixOffersDone); 
                    setLoading(false);
                }
            })      
        }
    }, [])

    const acceptOfferForPlayer = (offer) => { 

        OfferDataService.acceptOffer(offer._id).then((res) => { 
            if(res.status === 200) {
                const offers = offersRecived; 
                const offersPlayer = offersRecived.filter(o => o.player.name === res.data.player.name);
                offersPlayer.forEach((off, index) => {
                    if(off._id === res.data._id){
                        const indexOf = offersRecived.findIndex(o => o._id === off._id);
                        offers.splice(indexOf, 1, res.data);
                    }else{
                        const indexOf = offersRecived.findIndex(o => o._id === off._id);
                        off.status = 'Rejected'
                        offers.splice(indexOf, 1, off);
                    }
                })
                setOffersRecived(offers);
                setShowSuccessOfferAccepted(true);
            }
        })
    }

    
    const rejectOfferForPlayer = (offer) => { 
        OfferDataService.rejectOffer(offer._id).then((res) => {
            if(res.status === 200) {
                const offers = offersRecived; 
                const indexOf = offersRecived.findIndex(o => o._id === res.data._id);
                offers.splice(indexOf, 1, res.data); 
                setOffersRecived(offers); 
                setShowSuccessOfferRejected(true)
            }
        })

    }
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }     
        setShowSuccessOfferAccepted(false);  
        setShowSuccessOfferRejected(false);  
    };

    const changeTheme = (status) => {
        if(status === 'Accepted') {
            document.getElementById('paper').style.background = 'linear-gradient(180deg,#cdc9c961 70%, #32ab62 80%)'
        }        
        if(status === 'Rejected') {
            document.getElementById('paper').style.background = 'linear-gradient(180deg,#cdc9c961 70%, #cc3c0a 80%)'
        }
        
        if(status === 'Inactive' || status === 'Pending' ) {
            document.getElementById('paper').style.background = 'linear-gradient(180deg,#cdc9c961 70%, #00000042 80%)'
        }

    }

    const showMoreLessOffersRecived = (option) => {
        let newIndex = 0
        if(option === 'more'){
            newIndex = indexOffersRecived + 6;
        }
        
        if(option === 'less'){
            newIndex = indexOffersRecived - 6;
        }

        const copiAllRecived = [...allOffersRecived];
        const offers = copiAllRecived.splice(0,newIndex);
        
        setOffersRecived(offers)
        setIndexOffersRecived(newIndex)
    }

    const showMoreLessOffersDone = (option) => {
        let newIndex = 0
        if(option === 'more'){
            newIndex = indexOffersDone + 6;
        }
        
        if(option === 'less'){
            newIndex = indexOffersDone - 6;
        }
        const copiAllDone = [...allOffersDone];
        const offers = copiAllDone.splice(0,newIndex);
        
        setOffersDone(offers)
        setIndexOffersDone(newIndex)
    }


return (
    <CardContent className={classes.containerMarketPlayers}>
            <Typography variant="h4" align='center'>
                Ofertas recibidas <ArrowDownwardIcon />
            </Typography>
            <Grid container >
                {offersRecived.map((offer) => (
                    offer.status === 'Pending' || offer.status === 'Inactive' ? (
                    <Grid item align="center" justifyContent="center" xs={12} md={2}>
                        <Paper className={classes.paperPendInac}>
                            <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                      <Grid item align="center" justifyContent="center" xs={12} >
                                          <p>
                                              {offer.player.name}
                                          </p>
                                      </Grid>
                            </Grid>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                badgeContent={
                                    offer.player.points < 0 ?
                                    <SmallAvatarNegative><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarNegative>
                                    :
                                    <SmallAvatarPositive><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarPositive>
                                }
                            >
                                <Avatar className={classes.avatarPlayer} alt={offer.player.name} src={offer.player.playerImg} />
                            </Badge>
                            <Grid container >
                                <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                    <Grid item align="center" justifyContent="center" xs={12}>
                                        <p>
                                            {Utiles.formatoES(offer.offerAmount)} €
                                        </p>
                                    </Grid>
                                    <Grid item align="center" justifyContent="center" xs={12}>
                                        <p>
                                            {offer.offerTeam.name}
                                        </p>
                                    </Grid>
                                </Grid>
                                <Grid item align="center" justifyContent="center" xs={12}>
                                    
                                {offer.status === 'Pending' ? (
                                        <div style={{padding: '10px'}}>
                                            <Button onClick={() => acceptOfferForPlayer(offer)}><CheckIcon style={{color : green[500]}}></CheckIcon></Button>
                                            <Button onClick={() => rejectOfferForPlayer(offer)}><ClearIcon style={{color : red[500]}}></ClearIcon></Button>
                                        </div>
                                    )
                                    : 
                                    <p>
                                        {offer.status}
                                    </p>
                                }
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>    
                    )
                    : offer.status === 'Accepted' ? (
                    <Grid item align="center" justifyContent="center" xs={12} md={2}>
                        <Paper className={classes.paperAccepted}>
                            <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                      <Grid item align="center" justifyContent="center" xs={12} >
                                          <p>
                                              {offer.player.name}
                                          </p>
                                      </Grid>
                            </Grid>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                badgeContent={
                                    offer.player.points < 0 ?
                                    <SmallAvatarNegative><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarNegative>
                                    :
                                    <SmallAvatarPositive><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarPositive>
                                }
                            >
                                <Avatar className={classes.avatarPlayer} alt={offer.player.name} src={offer.player.playerImg} />
                            </Badge>
                            <Grid container >
                                <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                    <Grid item align="center" justifyContent="center" xs={12}>
                                        <p>
                                            {Utiles.formatoES(offer.offerAmount)} €
                                        </p>
                                    </Grid>
                                    <Grid item align="center" justifyContent="center" xs={12}>
                                        <p>
                                            {offer.offerTeam.name}
                                        </p>
                                    </Grid>
                                </Grid>
                                <Grid item align="center" justifyContent="center" xs={12}>
                                    <p>
                                        {offer.status}
                                    </p>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>    
                    ) 
                    :
                    <Grid item align="center" justifyContent="center" xs={12} md={2}>
                        <Paper className={classes.paperRejected}>
                            <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                      <Grid item align="center" justifyContent="center" xs={12} >
                                          <p>
                                              {offer.player.name}
                                          </p>
                                      </Grid>
                            </Grid>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                badgeContent={
                                    offer.player.points < 0 ?
                                    <SmallAvatarNegative><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarNegative>
                                    :
                                    <SmallAvatarPositive><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarPositive>
                                }
                            >
                                <Avatar className={classes.avatarPlayer} alt={offer.player.name} src={offer.player.playerImg} />
                            </Badge>
                            <Grid container >
                                <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                    <Grid item align="center" justifyContent="center" xs={12}>
                                        <p>
                                            {Utiles.formatoES(offer.offerAmount)} €
                                        </p>
                                    </Grid>
                                    <Grid item align="center" justifyContent="center" xs={12}>
                                        <p>
                                            {offer.offerTeam.name}
                                        </p>
                                    </Grid>
                                </Grid>
                                <Grid item align="center" justifyContent="center" xs={12}>
                                    <p>
                                        {offer.status}
                                    </p>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>    
                ))
                }
            </Grid>
            <div className = {classes.botonMas}>
                <Button onClick={() => showMoreLessOffersRecived('more')} className={classes.botonVerMas}><ExpandMoreIcon /></Button>   
            {indexOffersRecived > 6  && (
                <Button onClick={() => showMoreLessOffersRecived('less')} className={classes.botonVerMas}><ExpandLessIcon /></Button>   
            )}
            </div>
            <Typography variant="h4" align='center' style={{margin: '20px auto'}}>
                Ofertas realizadas <ArrowUpwardIcon />
            </Typography>
            <Grid container >
                {offersDone.map((offer) => (
                    offer.status === 'Pending' || offer.status === 'Inactive' ? (
                        <Grid item align="center" justifyContent="center" xs={12} md={2}>
                            <Paper className={classes.paperPendInac}>
                                <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                          <Grid item align="center" justifyContent="center" xs={12} >
                                              <p>
                                                  {offer.player.name}
                                              </p>
                                          </Grid>
                                </Grid>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    badgeContent={
                                        offer.player.points < 0 ?
                                        <SmallAvatarNegative><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarNegative>
                                        :
                                        <SmallAvatarPositive><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarPositive>
                                    }
                                >
                                    <Avatar className={classes.avatarPlayer} alt={offer.player.name} src={offer.player.playerImg} />
                                </Badge>
                                <Grid container >
                                    <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                        <Grid item align="center" justifyContent="center" xs={12}>
                                            <p>
                                                {Utiles.formatoES(offer.offerAmount)} €
                                            </p>
                                        </Grid>
                                        <Grid item align="center" justifyContent="center" xs={12}>
                                            <p>
                                                {offer.actualTeam.name}
                                            </p>
                                        </Grid>
                                    </Grid>
                                    <Grid item align="center" justifyContent="center" xs={12}>
                                        <p>
                                            {offer.status}
                                        </p>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>    
                        )
                        : offer.status === 'Accepted' ? (
                        <Grid item align="center" justifyContent="center" xs={12} md={2}>
                            <Paper className={classes.paperAccepted}>
                                <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                          <Grid item align="center" justifyContent="center" xs={12} >
                                              <p>
                                                  {offer.player.name}
                                              </p>
                                          </Grid>
                                </Grid>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    badgeContent={
                                        offer.player.points < 0 ?
                                        <SmallAvatarNegative><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarNegative>
                                        :
                                        <SmallAvatarPositive><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarPositive>
                                    }
                                >
                                    <Avatar className={classes.avatarPlayer} alt={offer.player.name} src={offer.player.playerImg} />
                                </Badge>
                                <Grid container >
                                    <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                        <Grid item align="center" justifyContent="center" xs={12}>
                                            <p>
                                                {Utiles.formatoES(offer.offerAmount)} €
                                            </p>
                                        </Grid>
                                        <Grid item align="center" justifyContent="center" xs={12}>
                                            <p>
                                                {offer.actualTeam.name}
                                            </p>
                                        </Grid>
                                    </Grid>
                                    <Grid item align="center" justifyContent="center" xs={12}>
                                        <p>
                                            {offer.status}
                                        </p>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>    
                        ) 
                        :
                        <Grid item align="center" justifyContent="center" xs={12} md={2}>
                            <Paper className={classes.paperRejected}>
                                <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                          <Grid item align="center" justifyContent="center" xs={12} >
                                              <p>
                                                  {offer.player.name}
                                              </p>
                                          </Grid>
                                </Grid>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    badgeContent={
                                        offer.player.points < 0 ?
                                        <SmallAvatarNegative><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarNegative>
                                        :
                                        <SmallAvatarPositive><p className={classes.pointsSize}>{offer.player.points}</p></SmallAvatarPositive>
                                    }
                                >
                                    <Avatar className={classes.avatarPlayer} alt={offer.player.name} src={offer.player.playerImg} />
                                </Badge>
                                <Grid container >
                                    <Grid item align="center" justifyContent="center" xs={6} md={12}>
                                        <Grid item align="center" justifyContent="center" xs={12}>
                                            <p>
                                                {Utiles.formatoES(offer.offerAmount)} €
                                            </p>
                                        </Grid>
                                        <Grid item align="center" justifyContent="center" xs={12}>
                                            <p>
                                                {offer.actualTeam.name}
                                            </p>
                                        </Grid>
                                    </Grid>
                                    <Grid item align="center" justifyContent="center" xs={12}>
                                        <p>
                                            {offer.status}
                                        </p>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid> 
                    ))
                }
            </Grid>
            <div className = {classes.botonMas}>
                <Button onClick={() => showMoreLessOffersDone('more')} className={classes.botonVerMas}><ExpandMoreIcon /></Button>   
            {indexOffersDone > 6  && (
                <Button onClick={() => showMoreLessOffersDone('less')} className={classes.botonVerMas}><ExpandLessIcon /></Button>   
            )}
            </div>
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress className={classes.circularStyle}/>
                </Backdrop>
                {/* <div>
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
                </div> */}
                <Snackbar open={showSuccessOfferAccepted} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        Oferta aceptada correctamente
                    </Alert>
                </Snackbar> 
                <Snackbar open={showSuccessOfferRejected} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        Oferta rechazada correctamente
                    </Alert>
                </Snackbar> 
        </CardContent>
    )
}