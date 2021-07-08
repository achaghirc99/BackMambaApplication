import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles'
import {Typography } from '@material-ui/core'
import TeamDetailsPanel from "./teamPanel";
import PlayersDetailsPanel from "./playersPanel";
import AlignementPanel from "./alignementPanel";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import EmojiPeopleOutlinedIcon from '@material-ui/icons/EmojiPeopleOutlined';
import SportsBasketballOutlinedIcon from '@material-ui/icons/SportsBasketballOutlined';
import Box from '@material-ui/core/Box';
import {useHistory} from 'react-router'
import TeamDataService from '../../services/Team/team.service'
import useUser from '../../hooks/useUser';
import backgroundBasketCourt from "../../static/images/basketballCourtOrange.jpg"


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`nav-tabpanel-${index}`}
        aria-labelledby={`nav-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `nav-tab-${index}`,
      'aria-controls': `nav-tabpanel-${index}`,
    };
  }
  
  function LinkTab(props) {
    return (
      <Tab
        component="a"
        onClick={(event) => {
          event.preventDefault();
        }}
        {...props}
      />
    );
  }

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "3% auto",
    flexGrow: 1,
    width: '90%',
    backgroundColor: theme.palette.background.paper,
  },
  fondoBasket: {
    background: `url(${backgroundBasketCourt}) no-repeat center center fixed`,
    backgroundSize : '33%'
  },

  styleTabBar: {
    backgroundImage: 'linear-gradient(45deg, #f17306 70%, #000000 80%)',
    
  }
}));




export default function TeamDetails(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const history = useHistory();
    const {auth} = useUser();
    useEffect(() => {
      if(auth){
          TeamDataService.getTeam(auth.id).then((res) => {
            sessionStorage.setItem("team", JSON.stringify(res.data));
          })
      }else{
          history.push('/signup');
      }
  },[auth])

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
      
    return (
        <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            aria-label="nav tabs example"
            className={classes.styleTabBar}
          >
            <LinkTab icon={<GroupOutlinedIcon />} label="Equipo" href="/drafts" {...a11yProps(0)} />
            <LinkTab icon={<EmojiPeopleOutlinedIcon />} label="Jugadores" href="/trash" {...a11yProps(1)} />
            <LinkTab icon={<SportsBasketballOutlinedIcon />} label="Alineación" href="/spam" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <TeamDetailsPanel props={props} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PlayersDetailsPanel props={props} />
        </TabPanel>
        <TabPanel value={value} index={2} className={classes.fondoBasket}>
          <AlignementPanel props={props} />
        </TabPanel>
      </div>
    );
}