import './MainScreen.css';
import { useNavigate, useLocation, useParams} from 'react-router-dom'
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import GroupsIcon from '@mui/icons-material/Groups';
import { IconButton } from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import Avatar from '@mui/material/Avatar';
import { blue, deepOrange, green } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {SERVER} from '../../constants/routes';
import {UNOWNED,OWNED,STUDIED,EXPLORED} from '../../constants/concessionStates';

function MainScreen() {
  let navigate = useNavigate();
  const location = useLocation();
  const {gameID, playerID} = useParams();
  const client = axios.create({baseURL: `${SERVER}`});

  const [concessions, setConcessions] = useState([]);  
  const [concession, setConcession] = useState(null);
  const [player, setPlayer] = useState(null);  
  const [game, setGame] = useState(null);
  
  //useEffect
  useEffect(() => {
    console.log("initial GetAllConcession")
    getAllConcessions();
    
    console.log("initial GetPlayer")
    const getPlayer = () => (
      client.get(`/player/${playerID}`)
      .then(res => {
        setPlayer(res?.data)
      })
      .catch(function (error) {
          console.log(error);
      })
    )
    getPlayer();

    console.log("initial getGame")
    getGame();
  }, [])

  useEffect(() => {
    console.log("ConcessionDetails useeffect")
    concessionDetails()
  }, [concession]);

  //Concession API  
  const getAllConcessions = () => {
    try{
      client.get(`/concession`)
      .then(res => {
        console.log("getAllConcessions",res)
        res.data.map(v => {
          setConcessions(concessions => [...concessions, v])
        })
      })
      .catch(function (error) {
          console.log(error);
      })
    } catch(e) {
      console.log(e);
    }
  };

  const updateConcession = (id, newStat) => {
    try{
      client.put(`concession/${id}`,{
        location: concession?.location,
        cost: concession?.cost,
        resource: concession?.resource,
        status: `${newStat}`
      }).then(res => {
        console.log("updateConcession")
        setConcession(res?.data)
      })
      .catch(function (error) {
          console.log(error);
      })
    } catch(error) {
      console.log(error);
    }
  }

  const resetConcessions = () => {
    console.log("resetConcessions")
    concessions.map((v) => {
      if(v?.status != UNOWNED){
        updateConcession(v?._id,UNOWNED)
       };
    })
  }

  //Player API
  const updatePlayer = (capital) => (
    client.patch(`/player/${player?._id}`,{
      name: player?.name,
      capital: capital,
      score: 0
    })
    .then(res => {
      console.log("updatePlayer",res)
      setPlayer(res?.data)
    })
    .catch(function (error) {
        console.log(error);
    })
  );

  //Game API
  const getGame = () => {
    try{
      client.get(`/game/${gameID}`)
      .then(res => {
        console.log("getGame",res)
        setGame(res?.data)
      })
      .catch(function (error) {
          console.log(error);
      })
    } catch(e) {
      console.log(e);
    }
  };

  const addRound = () => (
    client.patch(`/game/${game?._id}`,{
      round: (game?.round) + 1
    })
    .then(res => {
      console.log("addRound",res)
      setGame(res?.data)
    })
    .catch(function (error) {
        console.log(error);
    })
  );

  //UI
  const concessionDetails = () => {
    return(
      <>
        <span>{concession?.location}</span>
        <status>Status: {concession?.status}</status>
        <owner>Owner: {player?.name}</owner>
        <value>Concession Value: ${concession?.cost}</value>
      </>
    )
  }

  //Button on Click  
  const concessionOnClick = (location) =>{
    setConcession(concessions.find(area => area?.location == location))
    console.log("concessionOnClick",concession,location)
  }

  const buyOnClick = () => {
    console.log("buyOnClick")
    var capital = player?.capital - concession?.cost;
    updatePlayer(capital);
    updateConcession(concession?._id,OWNED);
    addRound();
 
    // let playerUpdateConn = `${SERVER}/player/${player?._id}`;
    // let concessionUpdateConn = `${SERVER}/concession/${concession?._id}`;
    
    // const playerUpdateReq = axios.patch(playerUpdateConn,{
    //   name: player?.name,
    //   capital: capital,
    //   score: 0
    // });
    // const concessionUpdateReq = axios.put(concessionUpdateConn, {
    //   location: concession?.location,
    //   cost: concession?.cost,
    //   resource: concession?.resource,
    //   status: `${OWNED}`
    // });
    
    // axios.all([playerUpdateReq, concessionUpdateReq]).then(axios.spread((...responses) => {
    //   const playerUpdateRes = responses[0]
    //   const concessionUpdateRes = responses[1]
    //   setPlayer(playerUpdateRes?.data)
    //   setConcession(concessionUpdateRes?.data)
    // })).catch(errors => {
    //   console.log(errors)
    // })
  }
  const studyOnClick = () => {
    var capital = player?.capital - concession?.cost;
    updatePlayer(capital);
    updateConcession(concession?._id,STUDIED);
    addRound();
  }
  
  const exploreOnClick = () => {
    var capital = player?.capital - concession?.cost;
    updatePlayer(capital);
    updateConcession(concession?._id,EXPLORED);
    addRound();
  }

  const arrayBlock = (concessionsLst, x) => {
    const array = concessionsLst.slice();
    const blocks = [];
    
    while (array.length) blocks.push(array.splice(0, x));
    
    return blocks;
  };
  
  let count = 0;
  let amt = 0;
  const countAmount = () => {
    count = amt++;
};

  return(
    <Grid className="Screen-box">
    <Grid
        container spacing={1}
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Grid item xs= {12} justifyContent="space-between" style={{display: "flex"}} className='header' >
        <companyName>{player?.name}</companyName>
        <capital>${player?.capital}</capital>
        <Avatar sx={{ bgcolor: deepOrange[500] }} variant="square"></Avatar>
        <round>{`${game?.round} / 15`}</round>
        </Grid>

        {/* VIVIAN TEST */}
        {/* {arrayBlock([...Array(concessions.length).keys()], 15).map((row, i) => (
            <div key={i} className="row justify-content-center">
                {row.map((value, i) => (
                    <div key={i} className="col">
                        {countAmount()}
                        <img src={require("./images/15.png")} height={35} width={35}/>
                    </div>
                ))}
            </div>
        ))} */}
        {/* END TEST */}

        <Grid item xs={10} container spacing={1} justifyContent="space-evenly" alignItems="center">
            <Grid>
              <Grid className='Column' justifyContent="space-between">
                <img src={require("./images/transparent cell.png")} height={30} width={35} onClick={() => resetConcessions()}/>
                <img src={require("./images/15.png")} height={35} width={35}/>
                <img src={require("./images/14.png")} height={35} width={35}/>
                <img src={require("./images/13.png")} height={35} width={35}/>
                <img src={require("./images/12.png")} height={35} width={35}/>
                <img src={require("./images/11.png")} height={35} width={35}/>
                <img src={require("./images/10.png")} height={35} width={35}/>
                <img src={require("./images/9.png")} height={35} width={35}/>
                <img src={require("./images/8.png")} height={35} width={35}/>
                <img src={require("./images/7.png")} height={35} width={35}/>
                <img src={require("./images/6.png")} height={35} width={35}/>
                <img src={require("./images/5.png")} height={35} width={35}/>
                <img src={require("./images/4.png")} height={35} width={35}/>
                <img src={require("./images/3.png")} height={35} width={35}/>
                <img src={require("./images/2.png")} height={35} width={35}/>
                <img src={require("./images/1.png")} height={35} width={35}/>
                
              </Grid>
              <Grid className='Column1'>
                <img src={require("./images/A.png")} height={30} width={35}/>
                <img className='A15' id='a15' src={require("./images/A15.png")} height={35} width={35} onClick={() => {A1('a15');}}/>
                <img className='A14' id='a14' src={require("./images/A14.png")} height={35} width={35}/>
                <img className='A13' id='a13' src={require("./images/A13.png")} height={35} width={35}/>
                <img className='A12' id='a12' src={require("./images/A12.png")} height={35} width={35}/>
                <img className='A11' id='a11' src={require("./images/A11.png")} height={35} width={35}/>
                <img className='A10' id='a10' src={require("./images/A10.png")} height={35} width={35}/>
                <img className='A9' id='a9' src={require("./images/A9.png")} height={35} width={35}/>
                <img className='A8' id='a8' src={require("./images/A8.png")} height={35} width={35}/>
                <img className='A7' id='a7' src={require("./images/A7.png")} height={35} width={35}/>
                <img className='A6' id='a6' src={require("./images/A6.png")} height={35} width={35}/>
                <img className='A5' id='a5' src={require("./images/A5.png")} height={35} width={35}/>
                <img className='A4' id='a4' src={require("./images/A4.png")} height={35} width={35}/>
                <img className='A3' id='a3' src={require("./images/A3.png")} height={35} width={35}/>
                <img className='A2' id='a2' src={require("./images/A2.png")} height={35} width={35}/>
                <img className='A1' id='a1' src={require("./images/A1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 2'>
                <img src={require("./images/B.png")} height={30} width={35}/>
                <img className='B15' id='b15'  src={require("./images/B15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='B14' id='b14' src={require("./images/B14.png")} height={35} width={35}/>
                <img className='B13' id='b13' src={require("./images/B13.png")} height={35} width={35}/>
                <img className='B12' id='b12' src={require("./images/B12.png")} height={35} width={35}/>
                <img className='B11' id='b11' src={require("./images/B11.png")} height={35} width={35}/>
                <img className='B10' id='b10' src={require("./images/B10.png")} height={35} width={35}/>
                <img className='B9' id='b9' src={require("./images/B9.png")} height={35} width={35}/>
                <img className='B8' id='b8' src={require("./images/B8.png")} height={35} width={35}/>
                <img className='B7' id='b7' src={require("./images/B7.png")} height={35} width={35}/>
                <img className='B6' id='b6' src={require("./images/B6.png")} height={35} width={35}/>
                <img className='B5' id='b5' src={require("./images/B5.png")} height={35} width={35}/>
                <img className='B4' id='b4' src={require("./images/B4.png")} height={35} width={35}/>
                <img className='B3' id='b3' src={require("./images/B3.png")} height={35} width={35}/>
                <img className='B2' id='b2' src={require("./images/B2.png")} height={35} width={35}/>
                <img className='B1' id='b1' src={require("./images/B1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 3'>
                <img src={require("./images/C.png")} height={30} width={35}/>
                <img className='C15' id='c15'  src={require("./images/C15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='C14' id='c14' src={require("./images/C14.png")} height={35} width={35}/>
                <img className='C13' id='c13' src={require("./images/C13.png")} height={35} width={35}/>
                <img className='C12' id='c12' src={require("./images/C12.png")} height={35} width={35}/>
                <img className='C11' id='c11' src={require("./images/C11.png")} height={35} width={35}/>
                <img className='C10' id='c10' src={require("./images/C10.png")} height={35} width={35}/>
                <img className='C9' id='c9' src={require("./images/C9.png")} height={35} width={35}/>
                <img className='C8' id='c8' src={require("./images/C8.png")} height={35} width={35}/>
                <img className='C7' id='c7' src={require("./images/C7.png")} height={35} width={35}/>
                <img className='C6' id='c6' src={require("./images/C6.png")} height={35} width={35}/>
                <img className='C5' id='c5' src={require("./images/C5.png")} height={35} width={35}/>
                <img className='C4' id='c4' src={require("./images/C4.png")} height={35} width={35}/>
                <img className='C3' id='c3' src={require("./images/C3.png")} height={35} width={35}/>
                <img className='C2' id='c2' src={require("./images/C2.png")} height={35} width={35}/>
                <img className='C1' id='c1' src={require("./images/C1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 4'>
                <img src={require("./images/D.png")} height={30} width={35}/>
                <img className='D15' id='d15'  src={require("./images/D15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='D14' id='d14' src={require("./images/D14.png")} height={35} width={35}/>
                <img className='D13' id='d13' src={require("./images/D13.png")} height={35} width={35}/>
                <img className='D12' id='d12' src={require("./images/D12.png")} height={35} width={35}/>
                <img className='D11' id='d11' src={require("./images/D11.png")} height={35} width={35}/>
                <img className='D10' id='d10' src={require("./images/D10.png")} height={35} width={35}/>
                <img className='D9' id='d9' src={require("./images/D9.png")} height={35} width={35}/>
                <img className='D8' id='d8' src={require("./images/D8.png")} height={35} width={35}/>
                <img className='D7' id='d7' src={require("./images/D7.png")} height={35} width={35}/>
                <img className='D6' id='d6' src={require("./images/D6.png")} height={35} width={35}/>
                <img className='D5' id='d5' src={require("./images/D5.png")} height={35} width={35}/>
                <img className='D4' id='d4' src={require("./images/D4.png")} height={35} width={35}/>
                <img className='D3' id='d3' src={require("./images/D3.png")} height={35} width={35}/>
                <img className='D2' id='d2' src={require("./images/D2.png")} height={35} width={35}/>
                <img className='D1' id='d1' src={require("./images/D1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 5'>
                <img src={require("./images/E.png")} height={30} width={35}/>
                <img className='E15' id='e15'  src={require("./images/E15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='E14' id='e14' src={require("./images/E14.png")} height={35} width={35}/>
                <img className='E13' id='e13' src={require("./images/E13.png")} height={35} width={35}/>
                <img className='E12' id='e12' src={require("./images/E12.png")} height={35} width={35}/>
                <img className='E11' id='e11' src={require("./images/E11.png")} height={35} width={35}/>
                <img className='E10' id='e10' src={require("./images/E10.png")} height={35} width={35}/>
                <img className='E9' id='e9' src={require("./images/E9.png")} height={35} width={35}/>
                <img className='E8' id='e8' src={require("./images/E8.png")} height={35} width={35}/>
                <img className='E7' id='e7' src={require("./images/E7.png")} height={35} width={35}/>
                <img className='E6' id='e6' src={require("./images/E6.png")} height={35} width={35}/>
                <img className='E5' id='e5' src={require("./images/E5.png")} height={35} width={35}/>
                <img className='E4' id='e4' src={require("./images/E4.png")} height={35} width={35}/>
                <img className='E3' id='e3' src={require("./images/E3.png")} height={35} width={35}/>
                <img className='E2' id='e2' src={require("./images/E2.png")} height={35} width={35}/>
                <img className='E1' id='e1' src={require("./images/E1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 6'>
                <img src={require("./images/F.png")} height={30} width={35}/>
                <img className='F15' id='f15'  src={require("./images/F15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='F14' id='f14' src={require("./images/F14.png")} height={35} width={35}/>
                <img className='F13' id='f13' src={require("./images/F13.png")} height={35} width={35}/>
                <img className='F12' id='f12' src={require("./images/F12.png")} height={35} width={35}/>
                <img className='F11' id='f11' src={require("./images/F11.png")} height={35} width={35}/>
                <img className='F10' id='f10' src={require("./images/F10.png")} height={35} width={35}/>
                <img className='F9' id='f9' src={require("./images/F9.png")} height={35} width={35}/>
                <img className='F8' id='f8' src={require("./images/F8.png")} height={35} width={35}/>
                <img className='F7' id='f7' src={require("./images/F7.png")} height={35} width={35}/>
                <img className='F6' id='f6' src={require("./images/F6.png")} height={35} width={35}/>
                <img className='F5' id='f5' src={require("./images/F5.png")} height={35} width={35}/>
                <img className='F4' id='f4' src={require("./images/F4.png")} height={35} width={35}/>
                <img className='F3' id='f3' src={require("./images/F3.png")} height={35} width={35}/>
                <img className='F2' id='f2' src={require("./images/F2.png")} height={35} width={35}/>
                <img className='F1' id='f1' src={require("./images/F1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 7'>
                <img src={require("./images/G.png")} height={30} width={35}/>
                <img className='G15' id='g15'  src={require("./images/G15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='G14' id='g14' src={require("./images/G14.png")} height={35} width={35}/>
                <img className='G13' id='g13' src={require("./images/G13.png")} height={35} width={35}/>
                <img className='G12' id='g12' src={require("./images/G12.png")} height={35} width={35}/>
                <img className='G11' id='g11' src={require("./images/G11.png")} height={35} width={35}/>
                <img className='G10' id='g10' src={require("./images/G10.png")} height={35} width={35}/>
                <img className='G9' id='g9' src={require("./images/G9.png")} height={35} width={35}/>
                <img className='G8' id='g8' src={require("./images/G8.png")} height={35} width={35}/>
                <img className='G7' id='g7' src={require("./images/G7.png")} height={35} width={35}/>
                <img className='G6' id='g6' src={require("./images/G6.png")} height={35} width={35}/>
                <img className='G5' id='g5' src={require("./images/G5.png")} height={35} width={35}/>
                <img className='G4' id='g4' src={require("./images/G4.png")} height={35} width={35}/>
                <img className='G3' id='g3' src={require("./images/G3.png")} height={35} width={35}/>
                <img className='G2' id='g2' src={require("./images/G2.png")} height={35} width={35}/>
                <img className='G1' id='g1' src={require("./images/G1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 8'>
                <img src={require("./images/H.png")} height={30} width={35}/>
                <img className='H15' id='h15'  src={require("./images/H15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='H14' id='h14' src={require("./images/H14.png")} height={35} width={35}/>
                <img className='H13' id='h13' src={require("./images/H13.png")} height={35} width={35}/>
                <img className='H12' id='h12' src={require("./images/H12.png")} height={35} width={35}/>
                <img className='H11' id='h11' src={require("./images/H11.png")} height={35} width={35}/>
                <img className='H10' id='h10' src={require("./images/H10.png")} height={35} width={35}/>
                <img className='H9' id='h9' src={require("./images/H9.png")} height={35} width={35}/>
                <img className='H8' id='h8' src={require("./images/H8.png")} height={35} width={35}/>
                <img className='H7' id='h7' src={require("./images/H7.png")} height={35} width={35}/>
                <img className='H6' id='h6' src={require("./images/H6.png")} height={35} width={35}/>
                <img className='H5' id='h5' src={require("./images/H5.png")} height={35} width={35}/>
                <img className='H4' id='h4' src={require("./images/H4.png")} height={35} width={35}/>
                <img className='H3' id='h3' src={require("./images/H3.png")} height={35} width={35}/>
                <img className='H2' id='h2' src={require("./images/H2.png")} height={35} width={35}/>
                <img className='H1' id='h1' src={require("./images/H1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 9'>
                <img src={require("./images/I.png")} height={30} width={35}/>
                <img className='I15' id='i15'  src={require("./images/I15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='I14' id='i14' src={require("./images/I14.png")} height={35} width={35}/>
                <img className='I13' id='i13' src={require("./images/I13.png")} height={35} width={35}/>
                <img className='I12' id='i12' src={require("./images/I12.png")} height={35} width={35}/>
                <img className='I11' id='i11' src={require("./images/I11.png")} height={35} width={35}/>
                <img className='I10' id='i10' src={require("./images/I10.png")} height={35} width={35}/>
                <img className='I9' id='i9' src={require("./images/I9.png")} height={35} width={35}/>
                <img className='I8' id='i8' src={require("./images/I8.png")} height={35} width={35}/>
                <img className='I7' id='i7' src={require("./images/I7.png")} height={35} width={35}/>
                <img className='I6' id='i6' src={require("./images/I6.png")} height={35} width={35}/>
                <img className='I5' id='i5' src={require("./images/I5.png")} height={35} width={35}/>
                <img className='I4' id='i4' src={require("./images/I4.png")} height={35} width={35}/>
                <img className='I3' id='i3' src={require("./images/I3.png")} height={35} width={35}/>
                <img className='I2' id='i2' src={require("./images/I2.png")} height={35} width={35}/>
                <img className='I1' id='i1' src={require("./images/I1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 10'>
                <img src={require("./images/J.png")} height={30} width={35}/>
                <img className='J15' id='f15' src={require("./images/J15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='J14' id='f14' src={require("./images/J14.png")} height={35} width={35}/>
                <img className='J13' id='f13' src={require("./images/J13.png")} height={35} width={35}/>
                <img className='J12' id='f12' src={require("./images/J12.png")} height={35} width={35}/>
                <img className='J11' id='f11' src={require("./images/J11.png")} height={35} width={35}/>
                <img className='J10' id='f10' src={require("./images/J10.png")} height={35} width={35}/>
                <img className='J9' id='f9' src={require("./images/J9.png")} height={35} width={35}/>
                <img className='J8' id='f8' src={require("./images/J8.png")} height={35} width={35}/>
                <img className='J7' id='f7' src={require("./images/J7.png")} height={35} width={35}/>
                <img className='J6' id='f6' src={require("./images/J6.png")} height={35} width={35}/>
                <img className='J5' id='f5' src={require("./images/J5.png")} height={35} width={35}/>
                <img className='J4' id='f4' src={require("./images/J4.png")} height={35} width={35}/>
                <img className='J3' id='f3' src={require("./images/J3.png")} height={35} width={35}/>
                <img className='J2' id='f2' src={require("./images/J2.png")} height={35} width={35}/>
                <img className='J1' id='f1' src={require("./images/J1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 11'>
                <img src={require("./images/K.png")} height={30} width={35}/>
                <img className='K15' id='k15' src={require("./images/K15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='K14' id='k14' src={require("./images/K14.png")} height={35} width={35}/>
                <img className='K13' id='k13' src={require("./images/K13.png")} height={35} width={35}/>
                <img className='K12' id='k12' src={require("./images/K12.png")} height={35} width={35}/>
                <img className='K11' id='k11' src={require("./images/K11.png")} height={35} width={35}/>
                <img className='K10' id='k10' src={require("./images/K10.png")} height={35} width={35}/>
                <img className='K9' id='k9' src={require("./images/K9.png")} height={35} width={35}/>
                <img className='K8' id='k8' src={require("./images/K8.png")} height={35} width={35}/>
                <img className='K7' id='k7' src={require("./images/K7.png")} height={35} width={35}/>
                <img className='K6' id='k6' src={require("./images/K6.png")} height={35} width={35}/>
                <img className='K5' id='k5' src={require("./images/K5.png")} height={35} width={35}/>
                <img className='K4' id='k4' src={require("./images/K4.png")} height={35} width={35}/>
                <img className='K3' id='k3' src={require("./images/K3.png")} height={35} width={35}/>
                <img className='K2' id='k2' src={require("./images/K2.png")} height={35} width={35}/>
                <img className='K1' id='k1' src={require("./images/K1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 12'>
                <img src={require("./images/L.png")} height={30} width={35}/>
                <img className='L15' id='l15' src={require("./images/L15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='L14' id='l14' src={require("./images/L14.png")} height={35} width={35}/>
                <img className='L13' id='l13' src={require("./images/L13.png")} height={35} width={35}/>
                <img className='L12' id='l12' src={require("./images/L12.png")} height={35} width={35}/>
                <img className='L11' id='l11' src={require("./images/L11.png")} height={35} width={35}/>
                <img className='L10' id='l10' src={require("./images/L10.png")} height={35} width={35}/>
                <img className='L9' id='l9' src={require("./images/L9.png")} height={35} width={35}/>
                <img className='L8' id='l8' src={require("./images/L8.png")} height={35} width={35}/>
                <img className='L7' id='l7' src={require("./images/L7.png")} height={35} width={35}/>
                <img className='L6' id='l6' src={require("./images/L6.png")} height={35} width={35}/>
                <img className='L5' id='l5' src={require("./images/L5.png")} height={35} width={35}/>
                <img className='L4' id='l4' src={require("./images/L4.png")} height={35} width={35}/>
                <img className='L3' id='l3' src={require("./images/L3.png")} height={35} width={35}/>
                <img className='L2' id='l2' src={require("./images/L2.png")} height={35} width={35}/>
                <img className='L1' id='l1' src={require("./images/L1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 13'>
                <img src={require("./images/M.png")} height={30} width={35}/>
                <img className='M15' id='m15' src={require("./images/M15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='M14' id='m14' src={require("./images/M14.png")} height={35} width={35}/>
                <img className='M13' id='m13' src={require("./images/M13.png")} height={35} width={35}/>
                <img className='M12' id='m12' src={require("./images/M12.png")} height={35} width={35}/>
                <img className='M11' id='m11' src={require("./images/M11.png")} height={35} width={35}/>
                <img className='M10' id='m10' src={require("./images/M10.png")} height={35} width={35}/>
                <img className='M9' id='m9' src={require("./images/M9.png")} height={35} width={35}/>
                <img className='M8' id='m8' src={require("./images/M8.png")} height={35} width={35}/>
                <img className='M7' id='m7' src={require("./images/M7.png")} height={35} width={35}/>
                <img className='M6' id='m6' src={require("./images/M6.png")} height={35} width={35}/>
                <img className='M5' id='m5' src={require("./images/M5.png")} height={35} width={35}/>
                <img className='M4' id='m4' src={require("./images/M4.png")} height={35} width={35}/>
                <img className='M3' id='m3' src={require("./images/M3.png")} height={35} width={35}/>
                <img className='M2' id='m2' src={require("./images/M2.png")} height={35} width={35}/>
                <img className='M1' id='m1' src={require("./images/M1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 14'>
                <img src={require("./images/N.png")} height={30} width={35}/>
                <img className='N15' id='n15' src={require("./images/N15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='N14' id='n14' src={require("./images/N14.png")} height={35} width={35}/>
                <img className='N13' id='n13' src={require("./images/N13.png")} height={35} width={35}/>
                <img className='N12' id='n12' src={require("./images/N12.png")} height={35} width={35}/>
                <img className='N11' id='n11' src={require("./images/N11.png")} height={35} width={35}/>
                <img className='N10' id='n10' src={require("./images/N10.png")} height={35} width={35}/>
                <img className='N9' id='n9' src={require("./images/N9.png")} height={35} width={35}/>
                <img className='N8' id='n8' src={require("./images/N8.png")} height={35} width={35}/>
                <img className='N7' id='n7' src={require("./images/N7.png")} height={35} width={35}/>
                <img className='N6' id='n6' src={require("./images/N6.png")} height={35} width={35}/>
                <img className='N5' id='n5' src={require("./images/N5.png")} height={35} width={35}/>
                <img className='N4' id='n4' src={require("./images/N4.png")} height={35} width={35}/>
                <img className='N3' id='n3' src={require("./images/N3.png")} height={35} width={35}/>
                <img className='N2' id='n2' src={require("./images/N2.png")} height={35} width={35}/>
                <img className='N1' id='n1' src={require("./images/N1.png")} height={35} width={35}/>
              </Grid>
              <Grid className='Column 15'>
                <img src={require("./images/O.png")} height={30} width={35}/>
                <img className='O15' id='o15' src={require("./images/O15.png")} height={35} width={35} onClick={() => {A1();}}/>
                <img className='O14' id='o14' src={require("./images/O14.png")} height={35} width={35}/>
                <img className='O13' id='o13' src={require("./images/O13.png")} height={35} width={35}/>
                <img className='O12' id='o12' src={require("./images/O12.png")} height={35} width={35}/>
                <img className='O11' id='o11' src={require("./images/O11.png")} height={35} width={35}/>
                <img className='O10' id='o10' src={require("./images/O10.png")} height={35} width={35}/>
                <img className='O9' id='o9' src={require("./images/O9.png")} height={35} width={35}/>
                <img className='O8' id='o8' src={require("./images/O8.png")} height={35} width={35}/>
                <img className='O7' id='o7' src={require("./images/O7.png")} height={35} width={35}/>
                <img className='O6' id='o6' src={require("./images/O6.png")} height={35} width={35}/>
                <img className='O5' id='o5' src={require("./images/O5.png")} height={35} width={35}/>
                <img className='O4' id='o4' src={require("./images/O4.png")} height={35} width={35}/>
                <img className='O3' id='o3' src={require("./images/O3.png")} height={35} width={35}/>
                <img className='O2' id='o2' src={require("./images/O2.png")} height={35} width={35}/>
                <img className='O1' id='o1' src={require("./images/O1.png")} height={35} width={35}/>
              </Grid>
            </Grid>
            
            <Grid direction="column" item xs={3} container spacing={2} justifyContent="speace-between" alignItems="center">
              <Grid className='info' direction="column" item xs={3} container spacing={1} justifyContent="space-evenly" alignItems="flex-start">
                {concessionDetails()}
              </Grid>

              <Grid className='buttons' direction="column"  item xs={3} container rowSpacing={0.5} justifyContent="space-between" alignItems="center">
                <Button sx={{ margin: 2 }} variant='contained' color="primary" size="large" startIcon={<CreateIcon/>} onClick={() => {buyOnClick(); }} style={{cursor:'pointer'}}>Buy</Button>
                <Button sx={{ margin: 2 }} variant='contained' color="success" size="large" startIcon={<GroupsIcon/>} onClick={() => {studyOnClick() }} style={{cursor:'pointer'}}>Study</Button>
                <Button sx={{ margin: 2 }} variant='contained' color="secondary" size="large" startIcon={<GroupsIcon/>} onClick={() => {exploreOnClick()}} style={{ cursor:'pointer' }}>Explore</Button>
                <IconButton sx={{ margin: 2 }} size="large" aria-label="Settings"><SettingsRoundedIcon fontSize='large'/></IconButton>
              </Grid>
            </Grid>
        </Grid>
            
        
        
      </Grid>
    </Grid>
  );
}

function A1(cell){
    //cell is the name of cell in map
    document.getElementById('a15').src=require("./images/cat.jpg");
}

export default MainScreen;