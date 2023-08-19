'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Alert, Grid, Snackbar} from "@mui/material";
import {useRouter} from "next/navigation";
import {useState} from "react";

//Simple Sign Up Page, based on a template taken from Material UI's page at:
//https://github.com/mui/material-ui/blob/v5.14.5/docs/data/material/getting-started/templates/sign-up/SignUp.tsx
//The only variance with the login page is the amount of data in the post request (first and lastname)
export default function SignUp() {
    const router = useRouter()
    const [open,setOpen] = useState(false)
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        fetch("/new_user",{method:'POST', headers:{
            "content-type": "application/json",
        },
        body:JSON.stringify({
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            username: data.get('username'),
            password: data.get('password'),
        })}).then(async result => {
            if(result.status === 200){
                const resultJson = await result.json()
                localStorage.setItem("USER_ID",resultJson.id)
                router.push('/')
            }
            if(result.status === 401){
                setOpen(true)
            }
        })
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Container component="main" maxWidth="xs">
                <Snackbar open={open} autoHideDuration={6000} onClose={()=>setOpen(false)}>
                    <Alert onClose={()=>setOpen(false)} severity="error" sx={{ width: '100%' }}>
                        User already exists!
                    </Alert>
                </Snackbar>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                    </Grid>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 ,color:'black'}}
                        >
                            Sign Up
                        </Button>
                    </Box>
                    <div>
                        <Link href="/Login" variant="body2">
                            {"Already have an acount? Sign in"}
                        </Link>
                    </div>
                </Box>
            </Container>
        </main>
    );
}
