import './HomeScreen.css';
import { useNavigate} from 'react-router-dom'
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import GroupsIcon from '@mui/icons-material/Groups';
import { Grid, IconButton } from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import axios from 'axios';
import {SERVER} from '../../constants/routes';
import { CREATE_LOBBY } from '../../constants';

function HomeScreen() {
  let navigate = useNavigate();
  const client = axios.create({baseURL: `${SERVER}`});
    
  const createGame = () => (
    client.post(`/game/create`,{
      gamePin: createGamePin(),
      round: 1,
      players: []
    })
    .then(res => {
      navigate(`/${res?.data?._id}/createCompany`)
  
    })
    .catch(function (error) {
        console.log(error);
    })
  );
  
  const createGamePin = () => {
    var pin = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var ii = 0; ii < 6; ii++ ) {
      pin += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
   return pin;
  };
  
  const createLobbyOnClick = () =>{
    createGame();
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
          <Button
            variant='contained'
            color="success"
            size="large"
            startIcon={<CreateIcon/>}
            onClick={() => {
              createLobbyOnClick();
            }}
            style={{cursor:'pointer'}}
          >
            Create Lobby
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            border-radius='100px'
            variant='contained'
            color="warning"
            size="large"
            startIcon={<GroupsIcon/>}
            onClick={() => {navigate(`${CREATE_LOBBY}`)}}
            style={{cursor:'pointer'}}
          >
            Join Lobby
          </Button>
        </Grid>
        <Grid item xs={12}>
          <IconButton
            size="large"
            aria-label="Settings">
            <SettingsRoundedIcon fontSize='large'/>
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default HomeScreen;
