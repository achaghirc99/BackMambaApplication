import React, { useEffect, useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TeamDataService from '../../services/Team/team.service'
import NoticeDataService from '../../services/Notices/notice.service';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Footer from '../../components/Footer';
import '../../styles/home.css';
import {Button, Grid, Paper, useMediaQuery} from '@material-ui/core';
import {useHistory} from 'react-router'
import img1 from "../../static/images/logo.png"
import img2 from "../../static/images/logo.png"
import img3 from "../../static/images/logo.png"
import Logo from "../../static/images/logo.png"
import Slide from '@material-ui/core/Slide';
import {ChevronLeft, ChevronRight} from '@material-ui/icons';
import CarrouselSlide from '../../components/CarrouselSlide';

import './style.css';
import Utiles from '../../hooks/utils';

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
    },
    overflowHidden: {
        overflow: 'hidden',
    },
    divSinNoticias: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '20% auto'
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
                                            Disfruta del placer de ser un entrenador de un auténtico 
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

function Arrow(props) {
    const {direction, clickFunction} = props;
    const icon = direction === 'left' ? <ChevronLeft/> : <ChevronRight/>;

    return (
        <div id={'arrow-' + direction} onClick={clickFunction}>
            {icon}
        </div>
    );
}

function AuthenticatedHome(props) {
    const classes = useStyles();
    const [notices, setNotices] = useState([]);
    const [index, setIndex] = useState(0);
    const [noticesLength, setNoticesLength] =  useState(0);
    const [slideIn, setSlideIn] = useState(true);
    const [slideDirection, setSlideDirection] = useState('down');
    const [open, setOpen] = useState(false);
    const notice = notices && notices.length > 0 ? notices[index] : null;
    let contieneUser = null; 
    if(!(notice === null || notice === undefined)) {
        contieneUser = notice.users.filter(user => user._id === props.user.id).length > 0 ? true : false;
    }

    useState(() => {
        if(!(props.user.comunidad === undefined || props.user.comunidad === null)){
            NoticeDataService.allNoticesForComunity(props.user.comunidad._id).then((res) => {
                if(res.status === 200) { 
                    let noticiasOrdenadas = res.data.sort(Utiles.compareNotices)
                    setNotices(noticiasOrdenadas);
                    setNoticesLength(res.data.length);
                }
            })
        }
    },[index]);

    const onArrowClick = (direction) => {
        const increment = direction === 'left' ? -1 : 1;
        const newIndex = (index + increment + noticesLength) % noticesLength;
        setIndex(newIndex);

        const oppDirection = direction === 'left' ? 'right' : 'left';
        setSlideDirection(direction);
        setSlideIn(false);

        setTimeout(() => {
            setIndex(newIndex);
            setSlideDirection(oppDirection);
            setSlideIn(true);
        }, 200);
    };

    const handleMarkAsShowed = () => {
        NoticeDataService.markAsShow(props.user.id, notice._id).then((res) => {
            if(res.status === 200) { 
                console.log('Noticia actualizada');
                const newNotices = notices; 
                const indexOf = notices.findIndex(n => n._id === res.data._id);
                newNotices.splice(indexOf, 1, res.data); 
                setNotices(newNotices);
                contieneUser = false;
                onArrowClick('right');
            }
        })
    }

    return (
        <div style={{marginBottom: "30px"}}>
            <Container component={"main"}>
                <CssBaseline/>
                <div>
                    <Container>
                        <Grid container spacing={3} alignItems="center" justify="center" align='center' >
                            <Grid item xs={12} md={6} lg={6}>    
                                <div style={{marginTop: "30px"}}>
                                    <img style={{
                                        display: "block",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        width:'50%',
                                        height:'50%',
                                        borderRadius:'125px',
                                        marginTop: '20px'
                                    }} alt="logo" src={Logo} width="35%" height="35%"/>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                {notices && notices.length > 0 ? (
                                    <Grid
                                        container
                                        spacing={1}
                                        alignItems="center"
                                        justify="center"
                                        className={classes.overflowHidden}
                                    >
                                        <Grid item xs={1} align={'center'}>
                                            <Arrow
                                                direction="left"
                                                clickFunction={() => onArrowClick('left')}
                                            />
                                        </Grid>
                                        <Grid item xs={10} align={'center'}>
                                            <Slide in={slideIn} direction={slideDirection}>
                                                <div>
                                                    <CarrouselSlide
                                                        content={notice}
                                                        open={open}
                                                        user={props.user}
                                                        contieneUser={contieneUser}
                                                        clickFunction={() => handleMarkAsShowed()}
                                                    />
                                                </div>
                                            </Slide>
                                        </Grid>
                                        <Grid item xs={1} align={'center'}>
                                            <Arrow
                                                direction="right"
                                                clickFunction={() => onArrowClick('right')}
                                            />
                                        </Grid>
                                    </Grid>
                                    ) 
                                    :
                                    (
                                    <div className={classes.divSinNoticias}align="center">
                                        <Typography
                                            align='center'
                                            variant="h6" 
                                            color="textSecondary"
                                            paragraph
                                            >
                                            No tienes noticias sin leer disponibles
                                        </Typography>
                                    </div>
                                    )
                                }
                            </Grid>
                        </Grid>
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
                                <Typography
                                    variant="p" 
                                    component="body"
                                    align="center"
                                    color="textSecondary"
                                    paragraph
                                    >
                                        La mejor plataforma de juego de baloncesto.<br></br> Conectate con todos tus amigos dentro de una competición, 
                                        disfruta del placer de ser un entrenador de un auténtico equipo de baloncesto. 
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
    const history = useHistory()
    const auth = JSON.parse(sessionStorage.getItem('user')) != null ? JSON.parse(sessionStorage.getItem('user')) : null;
    useEffect(() => {
        if(auth != null && auth.rol !== 'ADMINISTRADOR'){
            TeamDataService.getTeam(auth.id).then((res) => {
                if(res.data === ""){
                    history.push('/createTeam');
                }
            })
        }
    },[])


    return Boolean(auth) ? (
        <AuthenticatedHome history={props.history} user={auth}/>
    ) : (
        <Landing></Landing>
    );
}
