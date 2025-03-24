'use client'
import { useEffect, useState } from "react";


const SOCKET_URL = "ws://localhost:8080";
interface Mesdata{
  senderId: string
  to: string
  message: string
}



















const Chat = () =>{ 
  const [mesMeta , setMesMeta ] = useState<Mesdata|any>({
    senderId: "",
    to: "",
    message: "",
  })
  const [recMessages , setRecMessages] = useState<string[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null);




useEffect(()=>{
  const ws =  new WebSocket(SOCKET_URL)

  ws.onmessage = (event) => {
    const mes = JSON.parse(event.data);
    console.log(mes)
    setRecMessages((prev) => [...prev, `${mes.from}: ${mes.message}`]);
  };


  setSocket(ws);


  return () => {
    ws.close(); 
  };

},[])








const handleChange= (e: React.ChangeEvent<HTMLInputElement>)=>{
   setMesMeta({...mesMeta, [e.target.name]: e.target.value })
}


const handleMessageSubmit =(e: React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault()
  if (socket && socket.readyState === WebSocket.OPEN) { 
    console.log("WebSocket connected, sending message...");
    socket.send(JSON.stringify({ ...mesMeta }));
    setMesMeta((prevState: Mesdata) => ({
      ...prevState,   
      message: ""    
    }));
    setRecMessages((prev) => [...prev, `me: ${mesMeta.message}`]);


    
  };
}









  
 

  return (
    <div>
      <h2>Start Talking</h2>
     
      <div>
        {recMessages.map((msg, i) => (
          <p key={i}>
            {msg}:
          </p>
        ))}
      </div>

      <form onSubmit={handleMessageSubmit}>
        
        <div>
          <input 
          name="senderId"
          type="text"
          placeholder="enter ur id"
          value={mesMeta.senderId}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
          required
          />
          
        </div>

        <div>
          <input 
          name="to"
          type="text"
          placeholder="send to"
          value={mesMeta.to}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
          required
          />
          
        </div>

        <div>
          <input 
          name="message"
          type="text"
          placeholder="your message"
          value={mesMeta.message}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
          required
          />
          
        </div>
        <button type="submit"  className="flex items-center justify-center cursor-pointer  w-32 h-14 bg-blue-700 text-blue-50  rounded-4xl active:bg-blue-900 ">send Message</button>
      </form>




      </div>
  );
};

export default Chat;

