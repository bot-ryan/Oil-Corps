import './RegCompany.css';
import { useNavigate, useLocation, useParams} from 'react-router-dom'
import {Grid, Button} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import UndoIcon from '@mui/icons-material/Undo';
import BackBtn from '@mui/material/Button';
import React, { useState } from 'react';
import { LOADING_SCREEN, CREATE_LOBBY } from '../../constants/routes';
import axios from 'axios';
import {SERVER} from '../../constants/routes'

function RegCompany() {
  let navigate = useNavigate();
  const client = axios.create({baseURL: `${SERVER}`});
  const {gameID} = useParams();

  const [player, setPlayer] = useState({
    name: "",
    capital: 10000,
    score: 0
  })
    
  const createPlayer = () => (
    client.post(`/player/create`,{
      name: player?.name,
      capital: 100000,
      score: 0
    })
    .then(res => {
      navigate(`/${gameID}/${res?.data?._id}/loading`, {state: {company: player.name}})

    })
    .catch(function (error) {
        console.log(error);
    })
  );

  const handleReady = () =>{
    createPlayer()
  }
  
  return (
    <Grid className="Screen-box">
      <Grid
        container
        spacing={1}
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Grid item xs={12}>
          <span className="GameName">Oil Corps</span>
        </Grid>
        <Grid item xs={12}>
          <span>Please enter your company name: </span>
        </Grid>
        <Grid item xs={12}>
          <input
            type="text"
            placeholder='Company Name'
            value={player.name}
            onChange={(e) => setPlayer({...player, name: e.target.value})}
          ></input>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='contained'
            color="success"
            size="large"
            startIcon={<HowToRegIcon/>}
            onClick={handleReady}
            style={{cursor:'pointer'}}
          >
            READY
          </Button>
        </Grid>
        <Grid item xs={12}>
          <BackBtn
            variant='text'
            size="medium"
            startIcon={<UndoIcon/>}
            onClick={() => navigate(`${CREATE_LOBBY}`)}
            style={{cursor:'pointer'}}
          >
            Back
          </BackBtn>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default RegCompany;
