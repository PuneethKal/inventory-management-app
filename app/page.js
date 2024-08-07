"use client"
import { Box, Button, Modal, Stack, Table, TextField, Typography, Grid, Paper, ButtonGroup } from "@mui/material";
import { wrapApiHandler } from "next/dist/server/api-utils";
import { app, firestore } from "@/firebase";
import { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Login() {
    const color1 = "#171717"
    const color2 = "#444444"
    const color3 = "#DA0037"
    const color4 = "#EDEDED"

    const [email, setEmail] = useState([])
    const [password, setPassword] = useState([])
    const router = useRouter()
    const [user, setUser] = useState(null);
    const [errorMsg, setErrorMsg] = useState([]);

    const register = async (e) => {
        // console.log(email, password)
        const auth = getAuth(app);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Success")
                // Signed up 
                setUser(userCredential.user)
                //console.log(user)
                router.push('/Home')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(`Error [${errorCode}]: ${errorMessage}`);
                console.log(error.code)
                if (error.code == 'auth/invalid-email') {
                    setErrorMsg("Invalid Email")
                } else if (error.code == 'auth/weak-password') {
                    setErrorMsg("Length of 6 characters required")
                }
                else if (error.code == 'auth/email-already-in-use') {
                    setErrorMsg("Email already in use")
                }
                else if (error.code == 'auth/weak-password') {
                    setErrorMsg("Length of 6 characters required")
                } else {

                }

            });

    }

    const signIn = async (e) => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                setUser(userCredential.user)
                //console.log(user)
                router.push('/Home')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    return (
        <Box
            width="100vw"
            height="100vh"
            display={"flex"}
            alignItems={"center"}
            bgcolor={"#1B1B1B"}
            flexDirection={"column"}
            gap={20}
        >
            <Box
                width={"90%"}
                maxHeight={"80px"}
                minWidth={"800px"}
                padding={"20px"}
                display={"flex"}
                alignItems={"center"}
                margin={"40px"}
                bgcolor={color4}
                boxShadow={"3px 3px 2px 1px #d3d3d3 "}
                borderRadius={"2px"}
                justifyContent={"center"}
            >
                <Typography variant="h3" color={color2} fontFamily={"Comic-Sans"}>
                    Inventory Manager
                </Typography>
            </Box>
            <Box
                width="600px"
                height="320px"
                maxWidth={"60%"}
                minWidth={"400px"}
                display={"flex"}
                padding={"20px"}
                bgcolor={color4}
                boxShadow={"3px 3px 2px 1px #d3d3d3 "}
                borderRadius={"2px"}
                gap={2}
                flexDirection={"column"}
            >
                <Typography variant="h2" color={color2}>Login</Typography>
                <Stack spacing={2} width={"80%"}>
                    <TextField
                        type="email"
                        label={"Email"}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    ></TextField>
                    <TextField
                        label={"Password"}
                        type={"password"}
                        helperText={errorMsg}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    ></TextField>
                    <Box display={"flex"} flexDirection={"row"}>
                        <Box flexGrow={1} onClick={(e) => { signIn(); setErrorMsg("") }}><Button>Login</Button></Box>
                        <Button onClick={(e) => { register(); setErrorMsg("") }} >Register</Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}