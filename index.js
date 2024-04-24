//index.js
import express from 'express';
import fs from 'fs';

import bodyParser from "body-parser";
const app=express();
app.use(bodyParser.json());
app.use(express.static('public'));

const readGlobalId = () => {
    try {
        const data = fs.readFileSync("./globalId.json");
        return JSON.parse(data).globalId;
    } catch (error) {
        console.log("Error al leer el ID global:", error);
        return 0; // Si hay un error, retornamos 0 por defecto
    }
}
// Función para escribir el ID global en el archivo
const writeGlobalId = (globalId) => {
    try {
        fs.writeFileSync("./globalId.json", JSON.stringify({ globalId }));
    } catch (error) {
        console.log("Error al escribir el ID global:", error);
    }
}

// Función para obtener el próximo ID global y actualizarlo en el archivo
const getNextGlobalIdAndUpdate = () => {
    let globalId = readGlobalId(); // Lee el ID global actual
    const nextGlobalId = globalId + 1; // Incrementa el ID global
    writeGlobalId(nextGlobalId); // Escribe el nuevo ID global en el archivo
    return nextGlobalId; // Devuelve el nuevo ID global
}
const readData=()=>{
    try{
        const data=fs.readFileSync("./db.json");
        return JSON.parse(data);
    }
    catch(error){
        console.log("error al momento de leer la data : "+error);
    }
    
}
const writeData=(data)=>{
    try{
        fs.writeFileSync("./db.json",JSON.stringify(data));
    }
    catch(error){
        console.log(error);
    }
    
}
app.get("/",(req,res)=>{
    fs.readFile('./home.html', 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo HTML:", err);
            res.status(500).send("Error interno del servidor");
            return;
        }
        res.send(data);
    });
});


app.get("/coins",(req,res)=>{
    const data=readData();
    res.json(data.coins);
});
app.get("/coins/:id",(req,res)=>{
    const data=readData();
    const id=parseInt(req.params.id);
    const coin=data.coins.find((coin)=>coin.id===id);
    res.json(coin);
});
app.post("/coins",(req,res)=>{
    const data=readData();
    const body=req.body;
    const newCoin={
        id:getNextGlobalIdAndUpdate(),
        ...body,
    }
    data.coins.push(newCoin);
    writeData(data);
    res.json(newCoin);
});
app.put("/coins/:id",(req,res)=>{
    const data=readData();
    const body=req.body;
    const id=parseInt(req.params.id);
    const coinIndex=data.coins.findIndex((coin) =>coin.id === id);
    data.coins[coinIndex]={
        ...data.coins[coinIndex],...body,
    };
    writeData(data);
    res.json({message : "Moneda actualizada correctamente"});
});
app.delete("/coins/:id",(req,res)=>{
    const data=readData();
    const id=parseInt(req.params.id); 
    const coinIndex=data.coins.findIndex((coin) =>coin.id === id);
    data.coins.splice(coinIndex,1);
    writeData(data);
    res.json({message : "Moneda borrada correctamente"});
});
app.listen(3000,()=>{
    console.log("El servidor esta escuchando en el puerto 3000");
});
