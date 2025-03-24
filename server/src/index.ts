import { PORT, HOST } from "./config"
import WebSocket,{WebSocketServer} from "ws"

interface Mesdata{
    senderId: string
    to: string
    message: any  
}


const sendMes =(sender:WebSocket ,senderId:string, to: string , mes:any)=>{

    const recipient = clients.get(to)
    if(recipient && recipient.readyState === WebSocket.OPEN){

        recipient.send(JSON.stringify({from:senderId ,message: mes}))
        console.log("mess sent")
    }
    else{
        
       
    }
}

const wss= new WebSocketServer({host: HOST, port: PORT})

const clients = new Map<string, WebSocket>()
wss.on("connection", (ws)=>{
    
console.log("client connected")

ws.on("message", (data)=>{
    const mesMeta: Mesdata = JSON.parse(data.toString());

    if(!clients.get(mesMeta.senderId)){
        
        clients.set(mesMeta.senderId, ws)
        console.log(mesMeta)
        sendMes(ws,mesMeta.senderId, mesMeta.to, mesMeta.message)
    }else{
        sendMes(ws,mesMeta.senderId, mesMeta.to, mesMeta.message)
    }

    
    
})

ws.on("close", () => {
    for (const [key, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(key); // 🔹 Fixed: Removes the disconnected client properly
        console.log(`Client ${key} disconnected`);
        break;
      }
    }
  });



})


 

