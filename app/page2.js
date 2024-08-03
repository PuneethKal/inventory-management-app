
"use client"
import { Box, Button, Modal, Stack, Table, TextField, Typography, Grid, Paper, ButtonGroup} from "@mui/material";
import { wrapApiHandler } from "next/dist/server/api-utils";
import { firestore } from "@/firebase";
import { } from "firebase/firestore";
import { useEffect, useState  } from "react";

export default function Home() {
    return(
        <Box>
            <Button href="page2.js">
                Click here
            </Button>
        </Box>
    )
}