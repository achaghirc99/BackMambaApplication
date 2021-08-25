import React, {useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles'
import {Typography } from '@material-ui/core'
import Offers from "./offers";
import {MarketPlayers} from "./marketPlayers";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import Box from '@material-ui/core/Box';
import {useHistory} from 'react-router'
import TeamDataService from '../../services/Team/team.service'
import useUser from '../../hooks/useUser';


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
  styleTabBar: {
    backgroundImage: 'linear-gradient(45deg, #f17306 70%, #000000 80%)',
    
  }
}));

export default function Market(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const history = useHistory();
    const {auth} = useUser();
    const [team, setTeam] = useState();
    useEffect(() => {
      if(auth){
          TeamDataService.getTeam(auth.id).then((res) => {
            sessionStorage.setItem("team", JSON.stringify(res.data));
            setTeam(res.data);
          })
      }else{
          history.push('/signup');
      }
  },[history,auth])

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
            <LinkTab icon={<AddShoppingCartIcon />} label="Mercado" href="/drafts" {...a11yProps(0)} />
            <LinkTab icon={<MonetizationOnIcon />} label="Ofertas" href="/trash" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <MarketPlayers {...team} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Offers {...team} />
        </TabPanel>
      </div>
    );
}