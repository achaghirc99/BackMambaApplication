import React, {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import Footer from '../../components/Footer';
import useUser from '../../hooks/useUser';

import '../../styles/home.css';
import {Button, Grid, Paper, useMediaQuery, ThemeProvider} from '@material-ui/core';

import img1 from "../../static/images/logo.png"
import img2 from "../../static/images/logo.png"
import img3 from "../../static/images/logo.png"
import Logo from "../../static/images/logo.png"


import './style.css';

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(0, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    center1: {
        margin: 'auto',
        display: 'block',
    },
    image: {
        float: "right",
        marginTop: "40px",
        borderRadius: "60px 60px 60px 60px"
    },
    paper: {
        padding: '30px',
        height: '100%',
    },
    logContainer: {
        margin: "auto",
        justifyContent: "center",
        marginTop: "30px",
        backgroundColor: "#1d1dd505",
        borderRadius: "10px",
        textAlign: "center",
        position: "relative",
        paddingBottom: "50px",
        marginBottom: "20px"
    },
    submit: {
        backgroundColor: theme.palette.warning.dark
    },
    imagenPequeña : {
        borderRadius: "60px 60px 60px 60px"
    }
}));

function Landing() {
    const classes = useStyles();
    const theme = useTheme();
    const phoneScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <CssBaseline/>
            <main>
                <div className={classes.heroContent}>
                    <div style={{background: '#fff', paddingBottom: 80}}>
                        <Container>
                            <Grid container>
                                <Grid item md={6} xs={12}>
                                    <Typography
                                        variant="h4"
                                        align="left"
                                        style={{marginTop: 60}}
                                        className="text"
                                    >
                                       BlackMamba el juego definitivo. 
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        align="left"
                                        color="textSecondary"
                                        paragraph
                                    >
                                        Con Blackmamba llega el juego definitivo con el que disfrutar con tus amigos, 
                                        compartir la experiencia y liderar tu equipo hasta la cima del campeonato. Comienza 
                                        tu experiencia. 
                                    </Typography>
                                    <Button
                                        href="/#/signup"
                                        variant="contained"
                                        className={classes.submit}
                                    >
                                        Empezar ahora
                                    </Button>
                                    <Button
                                        href="/#/login"
                                        variant="contained"
                                        color="light"
                                        style={{marginLeft: 10}}
                                    >
                                        Iniciar sesión
                                    </Button>
                                </Grid>
                                {!phoneScreen && (
                                    <Grid item md={6} xs={12} className={classes.center1}>
                                        <img className={classes.image} alt="logo" src={Logo} width="60%" height="60%"/>
                                    </Grid>
                                )}
                            </Grid>
                        </Container>
                    </div>
                    <div style={{backgroundColor: '#f7f7f7', padding: '50px 0'}}>
                        <Typography
                            align="center"
                            style={{color: '#006e85', fontWeight: 'bold'}}
                        >
                            ¿QUÉ OFRECEMOS?
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            style={{fontWeight: 'bold', marginBottom: 30}}
                        >
                            Las mejor plataforma de juego de baloncesto. 
                        </Typography>
                        <Container style={{maxWidth: 1200}}>
                            <Grid container alignItems="stretch" spacing={3}>
                                <Grid item md={4} xs={12}>
                                    <Paper className={classes.paper}>
                                        <img
                                            src={img2}
                                            width="60px"
                                            alt="feature"
                                            className = {classes.imagenPequeña}
                                        />
                                        <Typography variant="h6">Comparte</Typography>
                                        <Typography>
                                            Conectate con todos tus amigos dentro de una competición 
                                            donde podreis disfrutar la experiencia de sentiros auténticos 
                                            entrenadores. 
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Paper className={classes.paper}>
                                        <img
                                            src={img1}
                                            width="60px"
                                            alt="feature"
                                            className = {classes.imagenPequeña}
                                        />
                                        <Typography variant="h6">Disfruta</Typography>
                                        <Typography>
                                            Disfrutal del placer de ser un entrenador de un auténtico 
                                            equipo de baloncesto, dirigiendolo como mejor te parezca. 
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Paper className={classes.paper}>
                                        <img
                                            src={img3}
                                            width="60px"
                                            alt="feature"
                                            className = {classes.imagenPequeña}
                                        />
                                        <Typography variant="h6">Compite</Typography>
                                        <Typography>
                                            Y no te olvides de ser el más listo de la clase. Compite para ser 
                                            el mejor formando el mejor equipo fichando aquellos jugadores que 
                                            mejor puntuación consigan.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
}

function AuthenticatedHome(props) {
    const classes = useStyles();
    const [paymentSuccess, setPaymentSuccess] = useState(props.history?.location.state?
        props.history.location.state.data : false)
    const [location, setLocation] = useState();
    const [error, setError] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setPaymentSuccess(false)
    };

    return (
        <div style={{marginBottom: "30px"}}>
            <Container component={"main"}>
                <CssBaseline/>
                <div>
                    <Container>
                        <div style={{marginTop: "30px"}}>
                            <img style={{
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto"
                            }} alt="logo" src={Logo} width="35%" height="35%"/>
                        </div>
                        <div className={classes.logContainer}>
                            <div className="typo">
                                <Typography
                                    variant="h6"
                                    align="center"
                                    color="textSecondary"
                                    paragraph
                                >
                                    Bienvenido a BlackMamba
                                </Typography>
                            </div>
                        </div>
                    </Container>
                </div>
            </Container>
            <Footer/>
        </div>
    );

}



export default function Home(props) {
    const {isLogged} = useUser();

    return isLogged ? (
        <AuthenticatedHome history={props.history} />
    ) : (
        <Landing></Landing>
    );
}
