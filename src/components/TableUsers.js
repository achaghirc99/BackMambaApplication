import * as React from 'react';
import PropTypes from 'prop-types';
import {useTheme,makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box';
import {  Button,Table,TableBody,TableHead, TableCell, TableContainer, TableFooter, TablePagination, TableRow,IconButton, Paper} from '@material-ui/core'
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';


const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: "16%",
    },
    cardAction: {
        width: '100%',
    },
    createComunity: { 

    }, 
    title : {
        margin : "5% 0px 0px 0px"
    },
    containerCards : {
        marginTop:"5%", 
        marginBottom:"5%"
    },
    formStyle: {
        marginTop: '50px', 
        marginBottom: '100px' 
    },
    nameGrid: {
        margin: "3% 0px 0px 0px"
    }, divForm :{
        margin: "0px 0px 0px 50px"
    },
    table: {
        minWidth: 500,
    },
    containerTable: {
        marginBottom:"5%"
    },
    buttonJoin : {
        backgroundColor: theme.palette.warning.dark,
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #f17306',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        margin: "20% 0% 20% 40%"
    },
    buttonFinalizar : {
        float: "rigth",
        backgroundColor: theme.palette.warning.dark,
        margin: "10px 10px 0px 0px"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularStyle : {
        color: theme.palette.warning.dark
    }
}));

const columns = [
    {id: 'firstName', label: 'Nombre', minWidth: 170 },
    {id: 'lastName', label: 'Apellidos', minWidth: 100, align: 'right' },
    {id: 'nickName', label: 'Nombre de usuario', minWidth: 170, align: 'right'},
    {id: 'comunidad',label: 'Comnunidad',minWidth: 170,align: 'right'},
    {id: 'action',label: '',minWidth: 170,align: 'right'},
];

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }
  
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
    
export default function CustomPaginationActionsTable(props){
    const classes = useStyles();
    const rows = props.users;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
                <TableRow>
                    {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                    >
                        {column.label}
                    </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
                ).map((row) => (
                    <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                            {row.firstName}
                        </TableCell>
                        <TableCell style={{ width: 160 }} align="right">
                            {row.lastName}
                        </TableCell>
                        <TableCell style={{ width: 160 }} align="right">
                            {row.nickName}
                        </TableCell>
                        <TableCell style={{ width: 160 }} align="right">
                            {row.comunidad != undefined && row.comunidad.name}
                        </TableCell>
                        <TableCell style={{ width: 160 }} align="right">
                            <Button variant="contained" className={classes.buttonJoin}>Eliminar</Button> 
                        </TableCell>
                    </TableRow>
                ))}
    
                {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                </TableRow>
                )}
            </TableBody>
            <TableFooter>
                <TableRow>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                    inputProps: {
                        'aria-label': 'rows per page',
                    },
                    native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                />
                </TableRow>
            </TableFooter>
        </Table>
      </TableContainer>
    );
  }