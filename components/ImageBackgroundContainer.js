import React from 'react'
import { View, StyleSheet, ImageBackground, Text } from "react-native";
import { Avatar } from "react-native-paper";
import Padding from "../constants/Padding";
import Colors from '../constants/Colors'
import TransparentStatusBar from '../components/TransparentStatusBar'
import STATUSBAR_HEIGHT from '../constants/StatusBarHeight';

export default function ImageBackgroundContainer(props) {
    return (
        <ImageBackground source={require('../assets/images/background.jpg')} style={{ flex: 1, justifyContent: 'center', paddingTop: STATUSBAR_HEIGHT }}>
            <TransparentStatusBar />
            <Text style={styles.welcome}>{props.title} to Al-Makan </Text>
            <View style={styles.container}>
                <Avatar.Image size={120} style={{ alignSelf: 'center', margin: 20 }}
                    source={props.avatar ? { uri: props.avatar } : require('../assets/images/logo.png')} />
                {props.children}
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        opacity: 0.8,
        flex: 1,
        backgroundColor: Colors.body_color,
        borderTopLeftRadius: 50,
        padding: Padding.page_horizontal * 5,
        marginLeft: 15,
        shadowColor: Colors.primary_text_color,
        shadowRadius: 6,
        shadowOffset: { width: -5, height: -5 },
        shadowOpacity: 0.5,
        elevation: 2,
    },
    // 33997799
    welcome: {
        marginBottom: 30,
        marginTop: 30,
        color: Colors.primary_text_color,
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 25,
        opacity: 0.8,
    },
})