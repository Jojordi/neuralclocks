'use client'
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {
    Grid,
    List,
    ListItem,
    ListItemButton,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import TextField from "@mui/material/TextField";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Timer from "@/app/Timer";

//Function to fetch the timers stored in the database, utilizes userid
async function getTimers(userId:string) {
    let timers = []
    const res = await fetch("/get_timers",{method:'POST', headers:{
            "content-type": "application/json",
        },
        body:JSON.stringify({
            userid: userId,
        })}).then(async result => {
        if(result.status === 200){
            timers = await result.json()
        }
        if(result.status === 401){
            return
        }
    })
    return timers
}
//TODO: Add logout button and reset button
export default function TimerGallery() {
    //State used to control the inner working of the Gallery component
    const [timerGalleryState,setTimerGalleryState] =
        useState({timers:[],
            userid:"",
            selectedTimer:{added:'Always been here',pomodoro:25,shortbreak:5,longbreak:15,timername:'Default'}})
    const router = useRouter()
    //Call API to add a timer
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        fetch("/set_timer",{method:'POST', headers:{
                "content-type": "application/json",
            },
            body:JSON.stringify({
                timername: data.get('timername'),
                pomodoro: data.get('pomodoro'),
                shortbreak: data.get('shortbreak'),
                longbreak: data.get('longbreak'),
                userid: timerGalleryState.userid,

            })}).then(async result => {
            if(result.status === 200){
                getTimers(timerGalleryState.userid).then(result=>{
                    setTimerGalleryState(prevState => ({...prevState,timers: result}))
                })
            }
        })
    }
    //Handle a call to change a timer selected from the Timer history
    const handleChangeTimer = (timer) => {
        setTimerGalleryState(prevState => ({...prevState,selectedTimer: timer}))
    }
    //Effect used to redirect the user to a login page if no credentials are stored in local storage.
    //If the credentials are indeed valid it sets the user id to be used when a timer is added later.
    useEffect(()=>{
        if(window){
            const id = localStorage.getItem("USER_ID")
            if(!id){
                router.push("/Login")
            }
            getTimers(id?id:"").then(result=>{
                setTimerGalleryState(prevState => ({...prevState,userid: id?id:"", timers: result}))
            })
        }
    },[])
    return (
        <div>
            <Timer name={timerGalleryState.selectedTimer.timername}
                   pomodoro={timerGalleryState.selectedTimer.pomodoro}
                   shortbreak={timerGalleryState.selectedTimer.shortbreak}
                   longbreak={timerGalleryState.selectedTimer.longbreak}/>
            <br/>
            New Timer
            <br/>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 5 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <TextField
                        autoComplete="Timer"
                        name="timername"
                        required
                        fullWidth
                        id="timerName"
                        label="Timer Name"
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        required
                        fullWidth
                        type={"number"}
                        id="pomodoro"
                        label="Pomodoro (Minutes)"
                        name="pomodoro"
                        autoComplete="main timer"
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        required
                        fullWidth
                        type={"number"}
                        id="shortbreak"
                        label="Short Break (Minutes)"
                        name="shortbreak"
                        autoComplete="small break"
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        required
                        fullWidth
                        type={"number"}
                        id="longbreak"
                        label="Long Break (Minutes)"
                        name="longbreak"
                        autoComplete="long break"
                    />
                </Grid>
            </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 ,color:'black'}}
                >
                    Add timer
                </Button>
                </Box>
            <br/>
            <h3>Timer History</h3>
            <br/>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Timer Name</TableCell>
                            <TableCell align="right">Pomodoro</TableCell>
                            <TableCell align="right">Short Break</TableCell>
                            <TableCell align="right">Long Break</TableCell>
                            <TableCell align="right">Date of Creation</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timerGalleryState.timers.map((timer) => (
                            <TableRow
                                key={timer.timername}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {timer.timername}
                                </TableCell>
                                <TableCell align="right">{timer.pomodoro}</TableCell>
                                <TableCell align="right">{timer.shortbreak}</TableCell>
                                <TableCell align="right">{timer.longbreak}</TableCell>
                                <TableCell align="right">{timer.added}</TableCell>
                                <TableCell align="right"><Button onClick={()=>handleChangeTimer(timer)}>
                                    USE</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
