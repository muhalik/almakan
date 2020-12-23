import React from 'react'
import { Text } from 'react-native'
import Colors from '../constants/Colors'

export default function FieldErrorText(props) {
    return (
        <Text style={{ color: Colors.error_color, marginBottom: 8, marginTop: 3 }}>
            {props.children}
        </Text>
    )
}
