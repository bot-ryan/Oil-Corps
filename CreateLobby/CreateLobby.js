import './CreateLobby.css';
import { useNavigate} from 'react-router-dom'
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import BackBtn from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import { REG_COMPANY, HOME_SCREEN } from '../../constants/routes';

function CreateLobby() {
  let navigate = useNavigate();

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
          <span>Please enter a pin for the lobby: </span>
        </Grid>
        <Grid item xs={12}>
          <input type="text" placeholder='Game Pin' className='pin'></input>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='contained'
            color="success"
            size="large"
            startIcon={<CheckIcon/>}
            onClick={() => {navigate(`${REG_COMPANY}`)}}
            atyle={{cursor:'pointer'}}
          >
            Confirm
          </Button>
        </Grid>
        <Grid item xs={12}>
          <BackBtn
            variant='text'
            size="medium"
            startIcon={<UndoIcon/>}
            onClick={() => {navigate(`${HOME_SCREEN}`)}}
            style={{cursor:'pointer'}}
          >
            Back
          </BackBtn>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CreateLobby;
