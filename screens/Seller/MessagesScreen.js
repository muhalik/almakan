import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import firebase from '../../sdk/firebaseConfigration'
import 'firebase/firestore'
import Loading from '../../components/Loading'
import Colors from '../../constants/Colors';
import Padding from '../../constants/Padding';
import NoDataFound from '../../components/NoDataFound';

const db = firebase.firestore()
const chatsRef = db.collection('chats')

export default function MessagesScreen(props) {
    const { user_id } = props.route.params
    const [isLoading, setIsLoading] = useState(true)
    const [chats, setChats] = useState([])
    const [customers, setCustomers] = useState([])

    useEffect(() => {
        const unsubscribe = chatsRef
            .where("user.vendor_id", "==", user_id)
            .onSnapshot((querySnapshot) => {
                const messagesFirestore = querySnapshot
                    .docChanges()
                    .filter(({ type }) => type === 'added')
                    .map(({ doc }) => {
                        const message = doc.data()
                        return { ...message, createdAt: message.createdAt.toDate() }
                    })
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                setChats(messagesFirestore)
                if (messagesFirestore.length == 0)
                    setIsLoading(false)
                let arr = []
                messagesFirestore.forEach((element) => {
                    var flag = true
                    arr && arr.forEach((e) => {
                        if (element.user.cus_id == e.cus_id) {
                            flag = false;
                            return;
                        }
                    })
                    if (flag)
                        arr.push({ name: element.user.cus_name, cus_id: element.user.cus_id })
                })
                setCustomers(arr)
            })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (chats.length > 0)
            setIsLoading(false)
        return () => {
        }
    }, [chats])

    return (
        isLoading ?
            <Loading />
            :
            chats.length > 0 ?
                <View style={styles.container}>
                    {customers.map((element, index) => (
                        <TouchableOpacity style={styles.chatItem} key={index} onPress={() =>
                            props.navigation.navigate('SellerChat', {
                                chats: chats,
                                customer_id: element.cus_id,
                                customer_name: element.name
                            })}>
                            <FontAwesome name="user-circle-o" size={35} color={Colors.secondary_color} />
                            <Text numberOfLines={1} style={styles.text}>{element.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                :
                <NoDataFound />
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Padding.page_horizontal * 2,
        backgroundColor: Colors.primary_text_color
    },
    chatItem: {
        borderRadius: 5,
        flexDirection: 'row',
        marginVertical: 4,
        alignItems: 'center',
        padding: 5,
        borderColor: 'lightgray',
        borderWidth: 0.1
    },
    text: {
        marginLeft: 20,
        textAlign: 'center',
        fontSize: 16
    }
})