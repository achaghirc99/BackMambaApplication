import {Avatar, withStyles} from '@material-ui/core';

export const SmallAvatarPositive = withStyles((theme) => ({
    root: {
      width: 25,
      height: 25,
      border: `1px solid ${theme.palette.warning.light}`,
      backgroundColor:'#32ab62'
    },
  }))(Avatar);
export const SmallAvatarNegative = withStyles((theme) => ({
    root: {
      width: 25,
      height: 25,
      border: `1px solid ${theme.palette.warning.light}`,
      backgroundColor:'#ff3b00f2'
    },
}))(Avatar);

export const SmallAvatarPosition = withStyles((theme) => ({
  root: {
    width: 25,
    height: 25,
    border: `1px solid ${theme.palette.warning.light}`,
    backgroundColor: "#fafafa",
    color: theme.palette.warning.dark
  },
}))(Avatar);

export const SmallAvatarTeamPoints = withStyles((theme) => ({
  root: {
    width: 60,
    height: 60,
    border: `1px solid ${theme.palette.warning.light}`,
    backgroundColor:'#32ab62'
  },
}))(Avatar);


export const MyAvatar = withStyles((theme) => ({
  root: {
    marginRight: 15
  },
  img: {
    marginRight: 15,
    filter : 'brightness(1.1)',
    mixBlendMode: 'multiply',
  }
}))(Avatar);