import React from 'react'
import './App.css';
import Login from './pages/Login'
import Signup from './pages/Signup'
import Header from './components/Header'
import clsx from 'clsx'
import { Switch, Route } from 'react-router-dom'
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import useUser from './hooks/useUser';
import Home from './pages/Home';
import Comunity from './pages/Comunity/comunity';
import BottomBar from './components/SimpleBottomNavigation';
import ManageComunity from './pages/Comunity/comunity';

const drawerWidth = 240


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: '1',
    overflowY: 'auto',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    color: 'white',
    backgroundImage: 'linear-gradient(45deg, #f17306 70%, #000000 80%)'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  title: {
    flexGrow: 1,
  },
  colorBar: {
    backgroundColor: 'white',
  },
}))

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#006e85',
    },
    secondary: {
      main: '#00cca0',
    },
  },
});
function App() {
  const classes = useStyles()
  const { isLogged } = useUser()
  return (
    <div className={classes.root}>    
      <ThemeProvider theme={muiTheme}>
        <Header classes={classes} />
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: isLogged,
          })}
        >
          <div className={classes.drawerHeader} />
          <Switch>
            <Route exact path={'/'} component={Home}/>
            <Route exact path={'/login'} component={Login} />
            <Route exact path={'/signup'} component={Signup} />
            <Route exact path={'/community'} component={ManageComunity} />
          </Switch>
        </main>
        <div className={classes.colorBar}>
          <BottomBar />
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
