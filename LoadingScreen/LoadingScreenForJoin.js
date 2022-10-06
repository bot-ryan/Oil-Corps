import React from 'react';
import './LoadingScreenForJoin.css'
import { useNavigate, useLocation, useParams} from 'react-router-dom'
import { Grid, Button } from '@mui/material';
import BackBtn from '@mui/material/Button';
import UndoIcon from '@mui/icons-material/Undo';
import CircularProgress from '@mui/material/CircularProgress';
import { REG_COMPANY } from '../../constants/routes';

function LoadingScreenForJoin() {
    let navigate = useNavigate();
    let location = useLocation();
    const companyName = location.state.company;
    const {gameID, playerID} = useParams()
    
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
          <span>Please wait for the host to start the game...</span>
        </Grid>
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
        <Grid item xs={12}>
          <span className='tips'>Tips: While waiting, feel free to rename your company by click 'BACK' button.</span>
        </Grid>
        <Grid item xs={6} alignItems='right'>
          <BackBtn
            variant='text'
            size="medium"
            startIcon={<UndoIcon/>}
            onClick={() => {navigate(`${REG_COMPANY}`)}}
            style={{cursor:'pointer'}}
          >
            Back
          </BackBtn>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant='contained'
            color="success"
            size="large"
            onClick={() => {navigate(`/${gameID}/${playerID}/game`, {state: {companyName : companyName}})}}
            atyle={{cursor:'pointer'}}
          >
            Start Game
          </Button>
        </Grid>
      </Grid>
    </Grid>
    );
  }
  
  export default LoadingScreenForJoin;
  