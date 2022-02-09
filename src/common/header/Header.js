import React, { useState } from "react";
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Modal from 'react-modal'; 
import logo from '../../assets/logo.svg';
import './Header.css';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other} >
        {value === index && (
            <Typography>{children}</Typography>
        )}
      </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Header(props) {
    const { location: { pathname }} = props;
    let pathnames = pathname.split('/');

    const [modalIsOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [form, setForm] = useState('');
    const [log, setLog] = useState('LOGIN');
    const [display, setDisplay] = useState(false);
    const [errorUname, setErrorUname] = useState(false);
    const [errMsgUname, setErrMsgUname] = useState('');
    const [errorPd, setErrorPd] = useState(false);
    const [errMsgPd, setErrMsgPd] = useState('');
    const [errorFname, setErrorFname] = useState(false);
    const [errMsgFname, setErrMsgFname] = useState('');
    const [errorLname, setErrorLname] = useState(false);
    const [errMsgLname, setErrMsgLname] = useState('');
    const [errorPWD, setErrorPWD] = useState(false);
    const [errMsgPWD, setErrMsgPWD] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [errMsgEmail, setErrMsgEmail] = useState('');
    const [errorContact, setErrorContact] = useState(false);
    const [errMsgContact, setErrMsgContact] = useState('');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function openModal() {
        setIsOpen(true);
    }
      
    function closeModal() {
        setIsOpen(false);
    }

    function handleFormChange(e) {
        const { name, value } = e.target;  
        setForm((prevState) => {
            return {
              ...prevState,
              [name]: value,
            };
        });
    }

    function login() {
        if((form.Username === '')) {
            setErrorUname(true);
            setErrMsgUname('Required');
            setIsOpen(true);
        } else if((form.Password === '')) {
            setErrorPd(true);
            setErrMsgPd('Required');
            setIsOpen(true);
        } else {
            if(log === 'LOGIN') {
                const accessTkn = window.btoa(`${form.Username}:${form.Password}`);
                sessionStorage.setItem("access-token", accessTkn);
                fetch(props.baseUrl + "auth/login", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    Authorization: "Basic " + accessTkn,
                    },
                })
                .then((response) => {
                    response.json();
                    if(response.statusText === 'OK') {
                        setLog('LOGOUT');
                        setErrorUname(false);
                        setErrMsgUname('');
                        setErrorPd(false);
                        setErrMsgPd('');
                    }
                    })
                    setIsOpen(false);
            }
            if(log === 'LOGOUT') {
                setLog('LOGIN');
                sessionStorage.setItem("access-token", '');
                setIsOpen(false);
            }
        }
    }

    function signup() {
        if((form.firstName === '')) {
            setErrorFname(true);
            setErrMsgFname('Required');
            setIsOpen(true);
        } else if((form.password === '')) {
            setErrorPWD(true);
            setErrMsgPWD('Required');
            setIsOpen(true);
        } else if((form.email === '')) {
            setErrorEmail(true);
            setErrMsgEmail('Required');
            setIsOpen(true);
        } else if((form.lastName === '')) {
            setErrorLname(true);
            setErrMsgLname('Required');
            setIsOpen(true);
        } else if((form.contactNo === '')) {
            setErrorContact(true);
            setErrMsgContact('Required');
            setIsOpen(true);
        } else {

            const accessTkn = window.btoa(`${form.Username}:${form.Password}`);
            sessionStorage.setItem("access-token", accessTkn);

            const params = {
                email_address: form.email,
                first_name: form.firstName,
                last_name: form.lastName,
                mobile_number: form.contactNo,
                password: form.password
            }

            fetch(props.baseUrl + "signup", {
                body: JSON.stringify(params),
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                Authorization: "Basic " + accessTkn,
                },
            })
            .then((response) => {
                response.json()
                if(response.status === 201) {
                    setDisplay(true);
                    setErrorFname(false);
                    setErrMsgFname('');
                    setErrorLname(false);
                    setErrMsgLname('');
                    setErrMsgPWD('');
                    setErrorPWD(false);
                    setErrorEmail(false);
                    setErrorEmail('');
                    setErrorContact(false);
                    setErrMsgContact('');
                }
                });
        }
    }

    function bookShow() {
        props.history.push(`/bookshow/${pathnames[2]}`)
    }

    return(
        <div className="header-container" id="header-container">
            <span className="logo-wrapper">
                <img className="logo-icon" src={logo} alt="logo" />
            </span>
            <span className="btn-container">
                {pathnames.includes('movie') && <span className="book-btn-wrapper">
                    <Button color="primary" variant="contained" onClick={bookShow}>Book Show</Button>
                </span>}
                <span className="log-btn-wrapper">
                    <Button variant="contained" onClick={openModal}>{log}</Button>
                </span>
            </span>
            <Modal ariaHideApp={false} isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Example Modal">
                <Tabs value={value} onChange={handleChange} aria-label="login-modal">
                    <Tab label="LOGIN" {...a11yProps(0)} />
                    <Tab label="REGISTER" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}> 
                <div className="form-container">
                    <TextField className="form-field" required id="standard-basic" error={errorUname} helperText={errMsgUname} onChange={handleFormChange} label="Username" name="Username" variant="standard" /> 
                    <TextField className="form-field" type="password" required id="standard-basic" error={errorPd} helperText={errMsgPd} onChange={handleFormChange} label="Password" name="Password" variant="standard" />
                    <Button className="form-btn" color="primary" variant="contained" onClick={login}>LOGIN</Button>
                </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div className="form-container">
                        <TextField className="form-field" required id="standard-basic" label="First Name" name="firstName" error={errorFname} helperText={errMsgFname} onChange={handleFormChange} variant="standard" /> 
                        <TextField className="form-field" required id="standard-basic" label="Last Name" name="lastName" error={errorLname} helperText={errMsgLname} onChange={handleFormChange} variant="standard" /> 
                        <TextField className="form-field" required id="standard-basic" label="Email" name="email" error={errorEmail} helperText={errMsgEmail} onChange={handleFormChange} variant="standard" /> 
                        <TextField className="form-field" required id="standard-basic" label="Password" name="password" error={errorPWD} helperText={errMsgPWD} onChange={handleFormChange} variant="standard" /> 
                        <TextField className="form-field" required id="standard-basic" label="Contact No." name="contactNo" error={errorContact} helperText={errMsgContact} onChange={handleFormChange} variant="standard" /> 
                        {display && <span className="register-success">Registration Successful. Please Login!</span>}
                        <Button className="form-btn" color="primary" variant="contained" onClick={signup}>REGISTER</Button>
                    </div>
                </TabPanel>
            </Modal>
        </div>
    );
};