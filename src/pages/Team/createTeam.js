import React, { useState, useEffect, useContext} from 'react'
import TeamDataService from "../../services/Team/team.service"
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography } from '@material-ui/core'
import { useHistory } from 'react-router'
import {Backdrop, CircularProgress} from "@material-ui/core";
import Context from '../../context/UserContext'
import img1 from '../../static/images/teamImages/bedRock.png';
import img2 from '../../static/images/teamImages/brooklynTurtles.png';
import img3 from '../../static/images/teamImages/bulls.png';
import img4 from '../../static/images/teamImages/cellarDyke.png';
import img5 from '../../static/images/teamImages/gadgets.png';
import img6 from '../../static/images/teamImages/ghostyBusters.png';
import img7 from '../../static/images/teamImages/jems.png';
import img8 from '../../static/images/teamImages/masters.png';
import img9 from '../../static/images/teamImages/miamiSnorks.png';
import img10 from '../../static/images/teamImages/vancouver.png';
import img11 from '../../static/images/teamImages/washingtonGijoes.png';
import img12 from '../../static/images/teamImages/woodlandSmurf.png';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularStyle : {
        color: theme.palette.warning.dark
    },
    imagen: {
        borderRadius: "100% 100% 100% 100%",
        width: "50%",
        margin: "0 auto"
    }
}));
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export default function CreateTeam() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState('')
    const [images, setImages] = useState('')
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const history = useHistory()
    const {setCurrentTeam, setAuth } = useContext(Context)
    const auth = JSON.parse(sessionStorage.getItem('user')) !== undefined ? JSON.parse(sessionStorage.getItem('user')) : "";
    const [errors, setErrors] = useState({});
     
    
    const props = {
        data: {
            image: images
        }
    }

    useEffect(() => {
        if (!auth) history.push('/')
    }, [auth, history])

    useEffect(() => {
        const images = [];
        images.push(img1);
        images.push(img2);
        images.push(img3);
        images.push(img4);
        images.push(img5);
        images.push(img6);
        images.push(img7);
        images.push(img8);
        images.push(img9);
        images.push(img10);
        images.push(img11);
        images.push(img12);
        const random = getRandomArbitrary(0,13);
        setImages(images[random]);
    },[history])
    
    const handleSubmit = (evt) => {
        setLoading(true)
        evt.preventDefault();
        if (handleValidation()) {
            const object = {"name": state.name, "image": images}
            TeamDataService.createTeam(object,auth.id, auth.comunidad._id).then(response => {
                if (response.status === 200) {
                    sessionStorage.setItem("team", JSON.stringify(response.data));
                    setAuth(auth)
                    history.push({ pathname: '/' , state: { data: true } });
                } else {
                    setOpenSubmitIncorrect(true)
                }
            }).catch(error => {
                console.log("Error" + error)
            })
        }
    }

    function handleValidation() {
        let objErrors = {};
        let valid = true;

        if(!state.name) {
            valid = false;
            objErrors['name'] = 'Tienes que rellenar este campo con un valor válido'
        }
        setErrors(objErrors);
        return valid;
    }

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSubmitIncorrect(false)
    };

    return (

        <Container fixed>
            <div style={{ marginTop: '90px', marginBottom: '100px' }}>
                <Typography align="center" className='h5' variant="h5" gutterBottom>
                    Introduce un nombre para tu equipo
            </Typography>
                <div style={{ margin:'0px 0px 0px 20px' }}>
                    <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                        <Grid container justify="center" alignItems="center" >
                            <Grid item>
                                <div>
                                  <img className={classes.imagen} alt={"image"} src={images} />
                                </div>
                                <input type="hidden" id="image"  name="image" value={images} />
                            </Grid> 
                            <Grid item>
                                <div>
                                    <TextField className='input-title' id="name" label="Nombre"
                                        helperText={errors.name} name="name" onChange={(e) => handleChange(e)} />
                                </div>
                            </Grid>
                            
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ ...stylesComponent.buttonCrear }}>
                            Enviar
                        </Button>
                        <div className={stylesComponent.snak}>
                            <Snackbar open={openSubmitIncorrect} autoHideDuration={6000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="error">
                                    Tienes que rellenar el formulario correctamente
                            </Alert>
                            </Snackbar>
                        </div>
                    </form>
                </div>
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress className={classes.circularStyle}/>
                </Backdrop>
            </div>
        </Container>

    )
}

const stylesComponent = {
    buttonCrear: {
        backgroundColor: '#006e85',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center',
        margin: 'auto',
        display: 'block',
        marginTop: '30px'
    },
    snak: {
        marginBottom: '20px',
    }
}