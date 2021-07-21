import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyB6kAf9rk7d5S5GwWQupKx_h6zU7RGEkJg",
  authDomain: "luxor-chat.firebaseapp.com",
  projectId: "luxor-chat",
  storageBucket: "luxor-chat.appspot.com",
  messagingSenderId: "188125463717",
  appId: "1:188125463717:web:e76772c31916056c4db94c",
  measurementId: "G-L27JFTPYEZ"

})
const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {

    const [user] =  useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>💻🔥💰</h1>
         <SignOut />
      </header>
      <section>
        {user? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}
 function SignIn() {
   
   const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);


   }

    return (<>
      
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or your blood will dry!</p>
    </>)
 }

 function SignOut() {
   return auth.currentUser && (

    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
   )
 }

 function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy('createdAt').limit(25);
  
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue ] = useState('');

  const sendMessage = async (e) => {
      e.preventDefault();

      const { uid, photoURL } = auth.currentUser;

      await messagesRef.add({
           text: formValue,
           createdAt: firebase.firestore.FieldValue.serverTimestamp(),
           uid,
           photoURL
      })

      setFormValue('');
      dummy.current.scrollIntoView({ behaviour: 'smooth' });
  }

 return (
     <>
     <main>
       {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    <div ref={dummy}></div>
    
  </main>  

 <form onSubmit={sendMessage}>

    <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something good na" />

   <button type="submit">🐦</button>

 </form>

 
</>)
}

function ChatMessage(props) {
const { text, uid, photoURL } = props.message;

const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

return (<>
     <div className={'message ${messageClass}'}>
   <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
<p>{text}</p>
     </div>
 </>  )
}



export default App;
