import React from 'react'
import { List } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors'

export default function CustomListItem(props) {
    return (
        <List.Item
            onPress={props.onPress}
            style={styles.list}
            titleStyle={{
                fontSize: 13, margin: 0, padding: 0, color: 'gray'
            }}
            title={props.title}
            left={() => <AntDesign name={props.lefticon} style={{ display: 'flex', alignSelf: 'center', margin: 15 }} size={25} color={Colors.primary_color} />}
            right={() => <AntDesign name={props.righticon} style={{ alignSelf: 'center', marginRight: 15 }} size={15} color={Colors.primary_color} />}
        />
    )
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: Colors.primary_text_color,
        paddingBottom: 0,
        paddingTop: 0,
        margin: 0,
        marginVertical: 5,

        shadowColor: Colors.primary_color,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        elevation: 2,
        borderRadius: 5,
    }
});