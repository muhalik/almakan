import React from 'react'
import translate from '../i18n/translate'
import { View, Text } from 'react-native'

export default function NoDataFound() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center' }}>{'No Data Found'}</Text>
        </View>
    )
}
