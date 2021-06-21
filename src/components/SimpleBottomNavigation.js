import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import useUser from '../hooks/useUser';
import Drawer from '@material-ui/core/Drawer';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {
  Home,
  LocalBar,
  AccountCircle,
  EventSeatTwoTone,
} from '@material-ui/icons';

const useStyles = makeStyles({
    root: {
      width: '100%',
      textAlign: 'center',
      margin: 'auto',
    },
  });
export default function SimpleBottomNavigation(props)  {
    const classes = useStyles(); 
    const history = useHistory(); 
    const [value, setValue] = React.useState(0);
    const { auth, isLogged, currentBar, updateCurrentBar } = useUser();

    return (
      <Drawer variant="persistent" anchor="bottom" open={isLogged}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction
          xs={3}
          label="Inicio"
          icon={<Home />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          xs={3}
          label="Bares"
          icon={<LocalBar />}
          component={Link}
          to="/bares"
        />
        {currentBar !== undefined ? (
          <BottomNavigationAction
            xs={3}
            label="Tu bar"
            icon={<EventSeatTwoTone />}
            onClick={() => history.push(`/bares/${currentBar.id}`)}
          />
        ) : (
          <BottomNavigationAction
            xs={3}
            label="Perfil"
            icon={<AccountCircle />}
            component={Link}
            to="/profile"
          />
        )}
      </BottomNavigation>
    </Drawer>
    );
  
}
