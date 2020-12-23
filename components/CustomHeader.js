import React from 'react'
import { Text, View } from 'react-native'
import Colors from '../constants/Colors'
import { MaterialIcons } from '@expo/vector-icons';

export default function CustomHeader(props) {
    return (
        <View style={{ backgroundColor: Colors.primary_color, height: 64, flexDirection: 'row', alignItems: 'center', }}>
            <MaterialIcons onPress={() => props.navigation.goBack()} name="arrow-back" size={24} style={{ marginLeft: 14, marginRight: -33 }} color={Colors.primary_text_color} />
            <Text style={{ fontSize: 18, marginHorizontal: 'auto', color: Colors.primary_text_color, fontWeight: '500' }}>{props.title}</Text>
        </View>
    )
}
