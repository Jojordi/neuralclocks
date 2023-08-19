'use client'
import {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import * as React from "react";

//Taken directly from Material UI's component examples
//https://mui.com/material-ui/react-progress/
function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number, timer:string },
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    fontSize={54}
                >{`${props.timer}`}</Typography>
            </Box>
        </Box>
    );
}

//The functional timer component which displays the pomodoro specifications, ticks down time and provides visual feedback of the elapsed time to the user
export default function Timer({name,pomodoro,shortbreak,longbreak}){
    //Since we only care if the elapased time matches the current interval we only store the current goal time and elapsed time
    const [timerState,setTimerState] = useState({goalTime:pomodoro,elapsedTime:0,active:false})

    //Function to use the main timer of the selected pomodoro
    const handleUsePomodoro = () => {
        setTimerState({goalTime:pomodoro,elapsedTime:0,active:false})
    }
    //Function to use the short break timer
    const handleUseShortBreak = () => {
        setTimerState({goalTime:shortbreak,elapsedTime:0,active:false})
    }
    //Function to use the long break timer
    const handleUseLongBreak = () => {
        setTimerState({goalTime:longbreak,elapsedTime:0,active:false})
    }
    //Function to reset current timer
    const handleReset = () => {
        setTimerState(prevState => ({...prevState,elapsedTime:0,active:false}))
    }
    //Function to parse elapsed time and format it as a percentage to make the progress spinner advance
    function getPercentage(){
        if(timerState.goalTime*60-timerState.elapsedTime<0){
            return 100
        }
        return (timerState.elapsedTime*100)/(timerState.goalTime*60)
    }
    //Function to diplay the elapsed time as a readable time format at the center of the spinner
    function getClock(){
        if(timerState.goalTime*60-timerState.elapsedTime<0){
            return "00:00"
        }
        const minutes = Math.floor((timerState.goalTime*60-timerState.elapsedTime)/60)
        const seconds = (timerState.goalTime*60-timerState.elapsedTime)%60
        const formattedMinutes = minutes>9?String(minutes):"0"+minutes
        const formattedSeconds = seconds>9?String(seconds):"0"+seconds
        return formattedMinutes+":"+formattedSeconds
    }
    //Effect used to tickdown the time and update the state of the timer
    useEffect(() => {
        if(timerState.active && timerState.goalTime*60-timerState.elapsedTime>0){
            const interval = setInterval(() =>
                setTimerState(prevState => ({...prevState,elapsedTime:prevState.elapsedTime+1})), 1000);
            return () => clearInterval(interval);
        }
    }, [timerState]);
    //Effect used to reset the state when a new timer is selected
    useEffect(() => {
        setTimerState({goalTime:pomodoro,elapsedTime:0,active:false})
    }, [name]);


    return(<div>
        <h1>Name: {name}</h1>
        <h2>Pomodoro: {pomodoro} minutes</h2>
        <h2>Short Break: {shortbreak} minutes</h2>
        <h2>Long Break: {longbreak} minutes</h2>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CircularProgressWithLabel size={400} sx={{color:"#02a1dd"}} value={getPercentage()} timer={getClock()} />
                </Grid>
                <Grid item xs={12} sm={3}>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button
                        onClick={handleUsePomodoro}
                        variant="contained"
                        sx={{ mt: 3, mb: 2 ,color:'black'}}
                    >
                        Pomodoro
                    </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button
                        onClick={handleUseShortBreak}
                        variant="contained"
                        sx={{ mt: 3, mb: 2 ,color:'black'}}
                    >
                        Short Break
                    </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button
                        onClick={handleUseLongBreak}
                        variant="contained"
                        sx={{ mt: 3, mb: 2 ,color:'black'}}
                    >
                        Long Break
                    </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button
                        onClick={()=>setTimerState(prevState => ({...prevState,active:!prevState.active}))}
                        variant="contained"
                        sx={{ mt: 3, mb: 2 ,color:'black'}}
                    >
                        {timerState.active?"Pause":"Resume"}
                    </Button>
                </Grid>
            </Grid>
    </div>)
}
