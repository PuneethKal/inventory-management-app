"use client"
import { Box, Button, Modal, Stack, Table, TextField, Typography, Grid, Paper, ButtonGroup} from "@mui/material";
import { wrapApiHandler } from "next/dist/server/api-utils";
import { firestore } from "@/firebase";
import { collection, getDoc, addDoc, QuerySnapshot, query, onSnapshot, doc, setDoc, deleteDoc, where, documentId } from "firebase/firestore";
import { useEffect, useState  } from "react";
import { blue } from "@mui/material/colors";
import { redirect } from 'next/navigation';

export default function Home() {

  const color1 = "#171717"
  const color2 = "#444444"
  const color3 = "#DA0037"
  const color4 = "#EDEDED"

  const color11 = "#000000"
  const color22 = "#F4DFC8"
  const color33 = "#F4EAE0"
  const color44 = "#FAF6F0"

  const [items, setItems] = useState([]);

  const COLLECTIONS = "one"
  
  
  // const [collectionName, setCollectionName] = useState([]);
  
  //Add items to database
  const addItem = async (item) =>{
    // console.log(item)
    await setDoc(doc(firestore, COLLECTIONS, item), {Quantity:1})
  }
  //Increase Item Count
  const IncreaseItemCount = async (item) =>{
    await setDoc(doc(firestore, COLLECTIONS, item.id), {Quantity:item.data().Quantity+1})
    
  }
  //Decrease Item Count
  const DecreaseItemCount = async (item) =>{
    let newQuantitiy = item.data().Quantity-1
    if (newQuantitiy == 0){
      deleteItem(item.id)
    }else{
      await setDoc(doc(firestore, COLLECTIONS, item.id), {Quantity:newQuantitiy})
    }
    
  }

  //Read Items from database
  function updateLlist(data=""){
    const q = query(collection(firestore, COLLECTIONS))
    const snapshots_query = onSnapshot(q, (querySnapshot) =>{
      let itemsArr = []
      querySnapshot.forEach((doc) => {
        if ((doc.id.toLocaleLowerCase()).includes(data.toLocaleLowerCase())){
          itemsArr.push(doc)
        }
      });
      setItems(itemsArr)
    })
  }

  useEffect(() => {
    updateLlist()  
  },[])
  
    

  //Delete items from database
    const deleteItem = async (item) => {
      // console.log(item)
      await deleteDoc(doc(firestore, COLLECTIONS, item));
    }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      bgcolor={"#1B1B1B"}
    >   
        
      <Box bgcolor={color1} paddingBottom={"10px"} borderRadius={"20px"} display={"flex"} >
      {/* THIS IS THE TITLE FOR STACK */}
      <Box Box width="800px">
        <Box width="800px" height="100px" padding={"10px 15px 10px 10px"} display={"flex"} justifyContent={'center'} >
          <Box 
            width="100%"
            display={"flex"} 
            justifyContent={"flex-start"} 
            padding={"0px 10px 0px 20px"}
            bgcolor={color4}
            boxShadow={"3px 3px 2px 1px #d3d3d3 "}
            borderRadius={"2px"}
          >
            <Typography variant="h2" color={color2} flexGrow={1}>Fruit
            </Typography>
            
            <Box width={"150px"} padding={"20px 10px"} bgcolor={blue}>
              <TextField 
                label="Input / Search" 
                variant="outlined" 
                size="small"
                onChange={(e) =>{ 
                  let timeout = null
                  timeout = setTimeout(function(){updateLlist(e.target.value)},500) }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    addItem(event.target.value)
                    event.target.value = ""
                    updateLlist()
                  }}}
              />
            </Box>
            <Button bgcolor={color3}>Insert</Button>
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
              <Button onClick={ () => { DecreaseItemCount(i) }}>-</Button>
              <Button>{i.data().Quantity}</Button>
              <Button onClick={ () => { IncreaseItemCount(i) }} >+</Button>
            </ButtonGroup>
            
            <Button
              onClick={ () => {
                deleteItem(i.id) 
              }} 
            >Trash</Button>
            
          </Box>
            
          ))}
        </Stack>
        </Box>
      </Box> 

    </Box>
  
    


  )
}
