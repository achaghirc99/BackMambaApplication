import React, { useState, useEffect, useContext} from 'react'
import TeamDataService from "../../services/Team/team.service"
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography, InputLabel, Input, Modal, Avatar } from '@material-ui/core'
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
import comunityService from '../../services/Comunidad/comunity.service'

function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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
        margin: "0 auto",
    },
    imagenPopUp: {
        margin: "0px 0px 10px 0px",
        height:theme.spacing(15),
        width:theme.spacing(15),
        objectFit: "fill"
    
    },
    paper: {
        position: 'absolute',
        width: 700,
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #f17306',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    },
    buttonFinalizar : {
        float: "rigth",
        backgroundColor: theme.palette.warning.dark,
        margin: "10px 10px 0px 0px"
    },
}));
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export default function CreateTeam() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState('')
    const [images, setImages] = useState('')
    const [allImages, setAllImages] = useState([])
    const [fileName, setFileName] = useState('');
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const history = useHistory()
    const {setCurrentTeam, setAuth } = useContext(Context)
    const auth = JSON.parse(sessionStorage.getItem('user')) !== undefined ? JSON.parse(sessionStorage.getItem('user')) : "";
    const [errors, setErrors] = useState({});
    const [openModalImages, setOpenModalImages] = useState(false);
    
    useEffect(() => {
        if (auth === "") {
            history.push('/')
        }
        if (auth === null ){
            history.push('/')
        }else{
            TeamDataService.getTeam(auth.id).then((res) => {
                if(res.data === null || res.data === "") {
                    //Si no tiene equipo y tampoco comunidad se le del sistema a iniciar sesión de nuevo
                    comunityService.getOneComunity(auth.id).then((res) => {
                        if (res.data === "") {
                            sessionStorage.removeItem("user");
                            sessionStorage.removeItem("team");
                            setAuth(undefined);
                            history.push('/')    
                        }
                        //Si tiene comunidada no se hace nada, seria el else
                    })            
                }else {
                    history.push('/')
                }
            })
        }

    }, [history])

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
        setAllImages(images);
        setImages(images[random]);
    },[history])
    
    const handleSubmit = (evt) => {
        setLoading(true)
        evt.preventDefault();
        if (handleValidation()) {

            const object = {
                name: state.name,
                image: images
            }

            TeamDataService.createTeam(object,auth.id, auth.comunidad._id).then(response => {
                TeamDataService.insertEquipoEnComnunidad(auth.comunidad._id, response.data._id).then(res => {
                    if (response.status === 200 && res.status === 200) {
                        sessionStorage.setItem("team", JSON.stringify(response.data));
                        setCurrentTeam(response.data);
                        setAuth(auth)
                        history.push({ pathname: '/' , state: { data: true } });    
                    } else {
                        setOpenSubmitIncorrect(true)
                        console.log(response.data);
                    }
                }) 
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

    const setearImagenYCerrarPopUp = (imagen) => {
        setImages(imagen)
        setOpenModalImages(false)
    }

    return (

        <Container fixed>
            <div style={{ marginTop: '90px', marginBottom: '100px' }}>
                <Typography align="center" className='h5' variant="h5" gutterBottom>
                    Introduce un nombre para tu equipo
            <div>
                <Modal
                  open={openModalImages}
                  onClose={handleClose}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  
                >
                    <div style={modalStyle} className={classes.paper}>
                        <h2 id="simple-modal-title">Selecciona tu imagen de perfil</h2>
                            <Grid container justify="center" alignItems="center">
                                {allImages && allImages.map((image) => (
                                <Grid item xs={3} >
                                    <div onClick = {()=> setearImagenYCerrarPopUp(image)}>
                                        <Avatar className={classes.imagenPopUp} alt="image" src={image}/>
                                    </div>
                                </Grid>    
                                    ))
                                }
                            </Grid>
                    </div>
                </Modal>
            </div>
            
            </Typography>
                <div style={{ margin:'0px 0px 0px 20px' }}>
                    <form onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data" className={classes.root}>
                        <Grid container justify="center" alignItems="center" >
                            <Grid item>
                                <div>
                                  <img className={classes.imagen} alt={"image"} src={images} onClick={() => setOpenModalImages(true)} />
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