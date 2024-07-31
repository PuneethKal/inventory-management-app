"use client"
import { Box, Button, Modal, Stack, Typography} from "@mui/material";
import { wrapApiHandler } from "next/dist/server/api-utils";
import { firestore } from "@/firebase";
import { collection, getDoc, addDoc, QuerySnapshot, query, onSnapshot } from "firebase/firestore";
import { useEffect, useState  } from "react";

export default function Home() {
  const [items, setItems] = useState([]);

  const [open,setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  
  //Add items to database
  // const addItem = async (e) =>{
  //   e.preventDefault()

  //   await addDoc(collection(db, 'pantry')){
  //      name: test_input
  //   }
    
  // }

  //Read Items from database
    useEffect(() => {
      const q = query(collection(firestore, 'pantry'))
      const snapshots_query = onSnapshot(q, (querySnapshot) =>{
        let itemsArr = []
        querySnapshot.forEach((doc) => {
          itemsArr.push(doc.id)
        });
        setItems(itemsArr)
      })
    },[])
  //Delete items from database

  // useEffect( () =>{
  //   const updatePantry = async () => {
  //     const snapshot  = query(collection(firestore,'pantry'))
  //     const docs = await getDoc(snapshot)
  //     docs.forEach((doc) => {
  //       console.log(doc.id, doc.data())
  //     })
  //   }
  //   updatePantry()
  // },[])
  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      borderColor={"white"}
      
    >   

      <Modal
      open={open}
      onClose={handleClose}
      >hello
      </Modal>

      <Button onClick={handleOpen}>Add!</Button>
      <Box Box width="800px" border={"2px solid black"} borderRadius={"5px"}>
      
        <Box width="800px" height="100" bgcolor={"grey"} >
          <Typography variant="h1" color="initial" textAlign={"center"}>Fruit</Typography>
        </Box>
        <Stack width='800px' height='200px' spacing={2} overflow={'auto'}>
          {items.map((i) => (
            <Box
              key={i}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              height="300px"
              width="100%"
              bgcolor={"#D3D3D3"}
              
            >
              <Typography variant="h6" color="initial">
                {i.charAt(0).toLocaleUpperCase() + i.slice(1)}
              </Typography>
            </Box>
          ))}
        </Stack>
      
      </Box> 

    </Box>
  
    


  )
}
