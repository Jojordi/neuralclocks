'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Alert, Snackbar} from "@mui/material";

//Simple Sign in Page, based on a template taken from Material UI's page at:
//https://github.com/mui/material-ui/blob/v5.14.5/docs/data/material/getting-started/templates/sign-in/SignIn.tsx

export default function SignIn() {
    //Used to route pages
    const router = useRouter()
    //Used to control displaying the snackbar which in turn displays the error alert in case of unsuccessful login
    const [open,setOpen] = useState(false)
    //Submit Login form
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        fetch("/check_user",{method:'POST', headers:{
                "content-type": "application/json",
            },
            body:JSON.stringify({
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
                        Invalid credentials!
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
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 ,color:'black'}}
                        >
                            Sign In
                        </Button>
                    </Box>
                    <div>
                        <Link href="/SignUp" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </div>
                </Box>
            </Container>
        </main>
    );
}
