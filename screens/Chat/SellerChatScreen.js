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
    const { chats, customer_id, customer_name } = props.route.params

    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState([])
    const [cahatUser, setcahatUser] = useState({
        _id: props.user._id,
        vendor_id: props.user._id,
        name: props.user.full_name,
        cus_id: customer_id,
        cus_name: customer_name
    })

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: customer_name,
        })
    }, [])

    useEffect(() => {
        setIsLoading(true)
        let array = []
        chats && chats.forEach(element => {
            if (element.user.cus_id == customer_id) {
                array.push(element)
            }
        });
        setMessages(array)
        setIsLoading(false)
        return () => { }
    }, [props.user, props.route.params])

    const appendMessages = useCallback((messages) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
    }, [messages])

    async function handleSend(messages) {
        const writes = messages.map((m) => chatsRef.add(m))
        await Promise.all(writes)
        appendMessages(messages)
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