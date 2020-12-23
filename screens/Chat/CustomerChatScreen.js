import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, TextInput, View, YellowBox, Button } from 'react-native'
import firebase from '../../sdk/firebaseConfigration'
import 'firebase/firestore'
import Loading from '../../components/Loading'
YellowBox.ignoreWarnings(['Setting a timer for a long period of time'])

const db = firebase.firestore()
const chatsRef = db.collection('chats')

export default function CustomerChatScreen(props) {
    const { vendor_id, user } = props.route.params

    const [isLoading, setIsLoading] = useState(true)
    const [messages, setMessages] = useState([])
    const [cahatUser, setcahatUser] = useState({
        _id: user._id,
        name: user.full_name,
        vendor_id: vendor_id,
        cus_id: user._id,
        cus_name: user.full_name
    })

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Chat',
        })
    }, [])

    useEffect(() => {
        if (messages.length > 0)
            setIsLoading(false)
        return () => { }
    }, [messages])

    useEffect(() => {
        var unsubscribe = chatsRef
            .where("user.cus_id", "==", user._id)
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
                if (messagesFirestore.length >= 0)
                    setIsLoading(false)
            })
        return () => unsubscribe()
    }, [user, vendor_id])

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



    return (
        isLoading ?
            <Loading />
            :
            <GiftedChat messages={messages} user={cahatUser} onSend={handleSend} />
    )
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