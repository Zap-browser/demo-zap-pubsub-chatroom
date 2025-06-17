// import { useState, useEffect, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { BackgroundBeams } from './components/BacxkBEams';
// import { DoorOpen, House, SendHorizontal  } from 'lucide-react';
// import { toast } from 'sonner';

// export default function BTFSChatApp() {
//   const [topic, setTopic] = useState('');
//   const [joined, setJoined] = useState(false);
//   type Message = { sender: string; text: any };
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const unsubscribeRef = useRef<(() => void) | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   const joinRoom = async () => {
//     if (!topic || topic == "") { toast.error("Please enter a topic to join the chat room."); return; } 
//     try {
//       const unsub = await window.btfs.pubsub.sub(
//         topic,
//         (msg: any) => setMessages((prev) => [...prev, { sender: 'Peer', text: msg }]),
//         (err: any) => setMessages((prev) => [...prev, { sender: 'Error', text: err }])
//       );
//       unsubscribeRef.current = unsub;
//       setJoined(true);
//     } catch (err) {
//       toast.error('Failed to join room: ' + err);
//     }
//   };

//   const leaveRoom = () => {
//     window.location.reload();
//   };

//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     try {
//       await window.btfs.pubsub.pub(topic, input);
//       setMessages((prev) => [...prev, { sender: 'You', text: input }]);
//       setInput('');
//     } catch (err) {
//       toast.error('Failed to send message: ' + err);
//     }
//   };
//   console.log();
//   if (!joined) {
//     return (
//         <>
//         <BackgroundBeams />
//         <div className="h-screen bg-black flex flex-col items-center justify-center  text-white dark">
//             <h1 className="text-4xl font-bold mb-6">BTFS Injections Powered Chat-Room</h1>
//             <Input
//             placeholder="Enter the chat topic here."
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//             className="w-1/4 text-white font-bold mb-4 text-xl z-100 text-center"
//             />
//             <Button className="bg-white text-purple-800 font-semibold px-6 py-2 rounded-xl shadow-xl hover:bg-purple-100 z-100" onClick={joinRoom}>
//             Join Chat
//             </Button>
//         </div>
//         </>
//     );
//   }

//   return (
//     <div className="h-screen flex flex-col bg-[linear-gradient(135deg,_#d91784_0%,_#ef3354_25%,_#ef4944_50%,_#f56a3b_75%,_#fb9e2c_100%)]  text-white">
//       <div className="flex justify-between items-center p-4 border-b border-white/20">
//         <h2 className="text-2xl font-semibold flex gap-2 items-center"><House  />{topic}</h2>
//         <Button onClick={leaveRoom} className="bg-black/40 hover:bg-black px-4 py-1 rounded-lg">Leave <DoorOpen /></Button>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`max-w-md px-4 py-2 rounded-xl shadow-md ${
//               msg.sender === 'You' ? 'bg-pink-500    self-end ml-auto' : msg.sender === 'Peer' ? 'bg-purple-600' : 'bg-red-500'
//             }`}
//           >
//             <p className="text-sm opacity-80">{msg.sender}</p>
//             <p className="text-lg">{msg.text}</p>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="flex p-2 border-t border-white/20 bg-black">
//         <Input
//           className="flex-1 mr-4 text-white border-2 text-xl"
//           placeholder="Type your message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//         />
//         <Button onClick={sendMessage} className="bg-transparent text-white border-2 font-bold w-[100px] hover:bg-white hover:text-black rounded-xl px-10 items-center flex justify-center">
//           <SendHorizontal  />
//         </Button>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackgroundBeams } from './components/BacxkBEams';
import { DoorOpen, House, SendHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export default function BTFSChatApp() {
  const [topic, setTopic] = useState('');
  const [joined, setJoined] = useState(false);
  type Message = { sender: string; text: any };
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 🟡 Echo suppression state
  const lastSentRef = useRef<string | null>(null);
  const skipNextEchoRef = useRef<boolean>(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const joinRoom = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic to join the chat room.");
      return;
    }
    try {
      const unsub = await window.btfs.pubsub.sub(
        topic,
        (msg: any) => {
          // ✅ Echo suppression logic
          if (
            skipNextEchoRef.current &&
            lastSentRef.current === msg
          ) {
            skipNextEchoRef.current = false; // suppress only once
            return;
          }
          setMessages((prev) => [...prev, { sender: 'Peer', text: msg }]);
        },
        (err: any) => {
          setMessages((prev) => [...prev, { sender: 'Error', text: err }]);
        }
      );
      unsubscribeRef.current = unsub;
      setJoined(true);
    } catch (err) {
      toast.error('Failed to join room: ' + err);
    }
  };

  const leaveRoom = () => {
    window.location.reload(); // Quick reset
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    try {
      // 🟡 Set echo suppression state
      lastSentRef.current = trimmed;
      skipNextEchoRef.current = true;

      await window.btfs.pubsub.pub(topic, trimmed);
      setMessages((prev) => [...prev, { sender: 'You', text: trimmed }]);
      setInput('');
    } catch (err) {
      toast.error('Failed to send message: ' + err);
    }
  };

  if (!joined) {
    return (
      <>
        <BackgroundBeams />
        <div className="h-screen bg-black flex flex-col items-center justify-center text-white dark">
          <h1 className="text-4xl font-bold mb-6">BTFS Injections Powered Chat-Room</h1>
          <Input
            placeholder="Enter the chat topic here."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-1/4 text-white font-bold mb-4 text-xl z-100 text-center"
          />
          <Button
            className="bg-white text-purple-800 font-semibold px-6 py-2 rounded-xl shadow-xl hover:bg-purple-100 z-100"
            onClick={joinRoom}
          >
            Join Chat
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[linear-gradient(135deg,_#d91784_0%,_#ef3354_25%,_#ef4944_50%,_#f56a3b_75%,_#fb9e2c_100%)]  text-white">
      <div className="flex justify-between items-center p-4 border-b border-white/20">
        <h2 className="text-2xl font-semibold flex gap-2 items-center"><House />{topic}</h2>
        <Button onClick={leaveRoom} className="bg-black/40 hover:bg-black px-4 py-1 rounded-lg">
          Leave <DoorOpen />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-md px-4 py-2 rounded-xl shadow-md ${
              msg.sender === 'You'
                ? 'bg-[#d91784] self-end ml-auto'
                : msg.sender === 'Peer'
                ? 'bg-[#fb9e2c]'
                : 'bg-red-500'
            }`}
          >
            <p className="text-sm text-white opacity-80">{msg.sender}</p>
            <p className="text-lg text-white">{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex p-2 border-t border-white/20 bg-black">
        <Input
          className="flex-1 mr-4 text-white border-2 text-xl"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button
          onClick={sendMessage}
          className="bg-transparent text-white border-2 font-bold w-[100px] hover:bg-white hover:text-black rounded-xl px-10 items-center flex justify-center"
        >
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
