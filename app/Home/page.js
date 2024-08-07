"use client"
import { Box, Button, Modal, Stack, Table, TextField, Typography, Grid, Paper, ButtonGroup } from "@mui/material";
import { wrapApiHandler } from "next/dist/server/api-utils";
import { firestore } from "@/firebase";
import { collection, getDoc, addDoc, QuerySnapshot, query, onSnapshot, doc, setDoc, deleteDoc, where, documentId } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { RequestCookiesAdapter } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import Head from "next/head";

export default function Home() {

  const color1 = "#171717"
  const color2 = "#444444"
  const color3 = "#DA0037"
  const color4 = "#EDEDED"

  const [items, setItems] = useState([]);
  const router = useRouter()
  const COLLECTIONS = "pantry"
  const USERS = "users"
  const [user, setUser] = useState(null);

  const [msg, setMsg] = useState('');
  const [output, setOutput] = useState('');

  //Add items to database
  const addItem = async (item) => {
    // console.log(item)
    await setDoc(doc(firestore, USERS, user.uid, COLLECTIONS, item), { Quantity: 1 })
  }
  //Increase Item Count
  const IncreaseItemCount = async (item) => {
    await setDoc(doc(firestore, USERS, user.uid, COLLECTIONS, item.id), { Quantity: item.data().Quantity + 1 })

  }
  //Decrease Item Count
  const DecreaseItemCount = async (item) => {
    let newQuantitiy = item.data().Quantity - 1
    if (newQuantitiy == 0) {
      deleteItem(item.id)
    } else {
      await setDoc(doc(firestore, USERS, user.uid, COLLECTIONS, item.id), { Quantity: newQuantitiy })
    }

  }

  //Delete items from database
  const deleteItem = async (item) => {
    // console.log(item)
    await deleteDoc(doc(firestore, USERS, user.uid, COLLECTIONS, item));
  }

  //Read Items from database
  async function updateList(data = "", c_user = user) {
    const q = query(collection(firestore, USERS, c_user.uid, COLLECTIONS))
    const snapshots_query = onSnapshot(q, (querySnapshot) => {
      let itemsArr = []
      querySnapshot.forEach((doc) => {
        if ((doc.id.toLocaleLowerCase()).includes(data.toLocaleLowerCase())) {
          itemsArr.push(doc)
        }
      });
      setItems(itemsArr)
    })
  }

  useEffect(() => {
    const authenicate = async () => {
      const auth = getAuth()
      onAuthStateChanged(auth, (current_user) => {
        setUser(current_user)
        if (current_user) {
          updateList("", current_user)
        } else {
          // User is signed out
          router.push("/")
        }
      });
    }
    authenicate()
  }, [output])

  async function logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("Signout Success")
      router.push("/")
    }).catch((error) => {
      // An error happened.
    });
  }

  //AI Feature


  const sendMsg = async () => {

    let list = []
    items.forEach((doc) => {
      list.push(doc.id)
    });

    const input_msg = `Please list 1 recipes that an be made using the items below. The recipes can have items not in the list but
    prioritize recipes with ingredients from the ingredients below.\n`    

    const response = fetch('./api/Gemini', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: `${input_msg + list}` })
    }).then(async (res) => {
      const data = await res.json()
      //console.log(data)
      //console.log(data.output)
      setOutput(data.output)
      return data
    })

  }

  return (
    <Box
      width="100vw"
      height="100vh"
      overflow={"auto"}
      display={"flex"}
      alignItems={"center"}
      flexDirection={"column"}
      bgcolor={"#1B1B1B"}
      gap={5}
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
      </Head>
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
      >
        <Button
          onClick={(e) => {
            logout()
          }}
        >Sign out</Button>

        <Typography variant="h2" color={color2} fontFamily={"Comic-Sans"} paddingLeft={"20%"}>
          Inventory Manager
        </Typography>
      </Box>

      {/* Inital colors were  bgcolor={"#0A0A0A"} border={"2px solid #252525"}*/}
      <Box bgcolor={"#1B1B1B"} border={"2px solid #1B1B1B"} paddingBottom={"10px"} borderRadius={"20px"} gap={5} display={"flex"} flexDirection={"column"}  >
        {/* THIS IS THE TITLE FOR STACK */}
        <Box Box width="800px">
          <Box width="800px" height="80px" padding={"10px 15px 10px 10px"} display={"flex"} justifyContent={'center'} >
            <Box
              width="100%"
              display={"flex"}
              justifyContent={"flex-start"}
              padding={"0px 10px 0px 20px"}
              bgcolor={color4}
              boxShadow={"3px 3px 2px 1px #d3d3d3 "}
              borderRadius={"2px"}
            >
              <Typography variant="h3" color={color2} flexGrow={1}>Inventory
              </Typography>

              <Box width={"250px"} padding={"10px 10px"}>
                <TextField
                  label="Input / Search"
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    let timeout = null
                    timeout = setTimeout(function () { updateList(e.target.value) }, 500)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      addItem(event.target.value)
                      event.target.value = ""
                      updateList()
                    }
                  }}
                />
              </Box>
              {/* <Button bgcolor={color3} >Insert</Button> */}
            </Box>
          </Box>


          {/* THIS IS THE STACK */}
          <Stack width='800px' padding={"5px 0px"} height='200px' spacing={2} overflow={'auto'} alignItems={"center"}>
            {items.map((i) => (
              <Box
                container
                key={i}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                height="20%"
                width="90%"
                bgcolor={color4}
                boxShadow={"3px 3px 2px 1px #d3d3d3 "}
                borderRadius={"2px"}

              >
                <Typography variant="h6" color={color2} flexGrow={1} paddingLeft={"30px"} >
                  {i.id.charAt(0).toLocaleUpperCase() + i.id.slice(1)}
                </Typography>
                <ButtonGroup size="small">
                  <Button onClick={() => { DecreaseItemCount(i) }}>-</Button>
                  <Button>{i.data().Quantity}</Button>
                  <Button onClick={() => { IncreaseItemCount(i) }} >+</Button>
                </ButtonGroup>

                <Button
                  onClick={() => {
                    deleteItem(i.id)
                  }}
                >Trash</Button>

              </Box>

            ))}
          </Stack>

        </Box>

        < Box width="800px" height="80px" padding={"10px 15px 10px 10px"} display={"flex"} flexDirection={"column"}>

          <Box
            width="100%"
            display={"flex"}
            justifyContent={"center"}
            padding={"0px 10px 0px 20px"}
            bgcolor={color4}
            boxShadow={"3px 3px 2px 1px #d3d3d3 "}
            borderRadius={"2px"}
            alignContent={"flex-start"}
            mb={"30px"}
          >
            <Typography variant="h3" color={color2} flexGrow={1} padding={"auto"} >
              Recipe Suggestion
            </Typography>
            <Button
              onClick={(e) => {
                setOutput("")
                sendMsg()
              }}>
              Get
            </Button>

          </Box>
          <Box
            display={"flex"}
            flexWrap={"wrap"}
            padding={"10px"}
            bgcolor={color4}
            boxShadow={"3px 3px 2px 1px #d3d3d3 "}
            borderRadius={"2px"}
          >
            <Typography variant="caption">
              {output.split("\n")}
            </Typography>
          </Box>
        </Box>

      </Box>

    </Box>




  )
}
