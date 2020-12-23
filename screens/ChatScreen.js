// import React, { useState, useEffect, useCallback } from 'react'
// import { GiftedChat } from 'react-native-gifted-chat'
// import { StyleSheet, TextInput, View, YellowBox, Button } from 'react-native'
// import * as firebase from 'firebase'
// import 'firebase/firestore'

// const firebaseConfig = {
//     apiKey: "AIzaSyCKBVD4Y0PJQNXoEm_8mQZgXLIYAZ8lWMo",
//     authDomain: "almakan-2e492.firebaseapp.com",
//     databaseURL: "https://almakan-2e492.firebaseio.com",
//     projectId: "almakan-2e492",
//     storageBucket: "almakan-2e492.appspot.com",
//     messagingSenderId: "743065719366",
//     appId: "1:743065719366:web:84d40615e9a62db741f047"
// }

// if (firebase.apps.length === 0) {
//     firebase.initializeApp(firebaseConfig)
// }

// YellowBox.ignoreWarnings(['Setting a timer for a long period of time'])

// const db = firebase.firestore()
// const chatsRef = db.collection('cus_ven')

// export default function App() {
//     const [user, setUser] = useState(null)
//     const [from, setFrom] = useState(null)
//     const [messages, setMessages] = useState([])

//     useEffect(() => {
//         readUser()
//         const unsubscribe = chatsRef
//             // .where("user", "==", user)
//             .onSnapshot((querySnapshot) => {
//                 const messagesFirestore = querySnapshot
//                     .docChanges()
//                     .filter(({ type }) => type === 'added')
//                     .map(({ doc }) => {
//                         const message = doc.data()
//                         return { ...message, createdAt: message.createdAt.toDate() }
//                     })
//                     .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
//                 appendMessages(messagesFirestore)
//             })
//         return () => {
//             unsubscribe()
//         }
//     }, [user])

//     async function readUser() {
//         const user = await AsyncStorage.getItem('user')
//         if (user) {
//             setUser(JSON.parse(user))
//         }
//     }

//     const appendMessages = useCallback(
//         (messages) => {
//             setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
//         },
//         [messages]
//     )

//     async function handlePress() {
//         await AsyncStorage.setItem('user', JSON.stringify(from))
//         setUser(from)
//     }

//     async function handleSend(messages) {
//         const writes = messages.map((m) => chatsRef.add(m))
//         await Promise.all(writes)
//     }

//     if (!user) {
//         return (
//             <View style={styles.container}>
//                 <TextInput style={styles.input} placeholder="Enter id" value={from} onChangeText={setFrom} />
//                 {/* <TextInput style={styles.input} placeholder="To" value={to} onChangeText={setTo} /> */}
//                 <Button onPress={handlePress} title="Enter the chat" />
//             </View>
//         )
//     }
//     return <GiftedChat messages={messages} user={user} onSend={handleSend} />
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 30,
//     },
//     input: {
//         height: 50,
//         width: '100%',
//         borderWidth: 1,
//         padding: 15,
//         marginBottom: 20,
//         borderColor: 'gray',
//     },
// })





import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, TextInput, View, YellowBox, Button } from 'react-native'
import * as firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCKBVD4Y0PJQNXoEm_8mQZgXLIYAZ8lWMo",
    authDomain: "almakan-2e492.firebaseapp.com",
    databaseURL: "https://almakan-2e492.firebaseio.com",
    projectId: "almakan-2e492",
    storageBucket: "almakan-2e492.appspot.com",
    messagingSenderId: "743065719366",
    appId: "1:743065719366:web:84d40615e9a62db741f047"
}

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
}

YellowBox.ignoreWarnings(['Setting a timer for a long period of time'])

const db = firebase.firestore()
const chatsRef = db.collection('chats')

export default function App(props) {
    const [user, setUser] = useState(props.user)
    const [cahatUser, setcahatUser] = useState(null)
    const [cus_id, setCus_id] = useState('')

    const [messages, setMessages] = useState([])

    useEffect(() => {
        var unsubscribe
        if (props.user.role == 'customer') {
            unsubscribe = chatsRef
                .where("user.cus_id", "==", props.user._id)
                .onSnapshot((querySnapshot) => {
                    const messagesFirestore = querySnapshot
                        .docChanges()
                        .filter(({ type }) => type === 'added')
                        .map(({ doc }) => {
                            const message = doc.data()
                            return { ...message, createdAt: message.createdAt.toDate() }
                        })
                        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    appendMessages(messagesFirestore)
                })
        } else {
            unsubscribe = chatsRef
                .where("user.cus_id", "==", cus_id)
                .onSnapshot((querySnapshot) => {
                    const messagesFirestore = querySnapshot
                        .docChanges()
                        .filter(({ type }) => type === 'added')
                        .map(({ doc }) => {
                            const message = doc.data()
                            return { ...message, createdAt: message.createdAt.toDate() }
                        })
                        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    appendMessages(messagesFirestore)
                })
        }
        return () => unsubscribe()
    }, [props.user, cus_id])

    useEffect(() => {
        if (props.user.role == 'customer') {
            setcahatUser({
                _id: props.user._id,
                name: props.user.full_name,
                vendor_id: '5fb921dfb2a820001732c492',
                cus_id: props.user._id,
                cus_name: props.user.full_name
            })
        } else {
            const { c_id, c_name } = props.route.params
            setcahatUser({
                _id: props.user._id,
                name: props.user.full_name,
                vendor_id: '5fb921dfb2a820001732c492',
                cus_name: c_name,
                cus_id: c_id
            })
            setCus_id(c_id)
        }

        return () => {
        }
    }, [props.user, props.route.params])

    const appendMessages = useCallback(
        (messages) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
        },
        [messages]
    )

    async function handleSend(messages) {
        const writes = messages.map((m) => chatsRef.add(m))
        await Promise.all(writes)
    }

    return <GiftedChat messages={messages} user={cahatUser} onSend={handleSend} />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    input: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        padding: 15,
        marginBottom: 20,
        borderColor: 'gray',
    },
})