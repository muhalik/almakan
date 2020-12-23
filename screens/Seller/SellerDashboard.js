import { StyleSheet, Text, StatusBar, View, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { List } from 'react-native-paper';
import React from 'react';
import Padding from '../../constants/Padding';
import TransparentStatusBar from '../../components/TransparentStatusBar'
import STATUSBAR_HEIGHT from '../../constants/StatusBarHeight';

import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SellerDashboard(props) {
    const [orderStackShow, setOrderStackShow] = useState(false);

    return (
        <ImageBackground source={require('../../assets/images/background.jpg')} style={{ flex: 1, justifyContent: 'center', paddingTop: STATUSBAR_HEIGHT }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <TransparentStatusBar />
                <View style={styles.backImgContainer}>
                    <Text style={styles.admin_text}>Seller Dashboard</Text>
                </View>
                <View style={styles.body_container}>
                    {props.user.full_name != 'seller' &&
                        <View>
                            <Text style={styles.welcome}>Welcome to Al-Makan</Text>
                            <List.Item
                                onPress={() => props.navigation.navigate('Upload Data')}
                                style={styles.list}
                                titleStyle={{
                                    fontSize: 13, margin: 0, padding: 0, color: 'gray', marginVertical: 0,
                                    marginHorizontal: 0,
                                }}
                                title={'Upload Data'}
                                left={() => <AntDesign name={'upload'} style={styles.left_icon} size={25} color={Colors.primary_color} />}
                                right={() => <AntDesign name={'right'} style={styles.left_icon} size={15} color={Colors.primary_color} />}
                            />
                            <List.Item
                                onPress={() => props.navigation.navigate('Inventory')}
                                style={styles.list}
                                titleStyle={{
                                    fontSize: 13, margin: 0, padding: 0, color: 'gray', marginVertical: 0,
                                    marginHorizontal: 0,
                                }}
                                title={'Inventry'}
                                left={() => <AntDesign name={'dashboard'} style={styles.left_icon} size={25} color={Colors.primary_color} />}
                                right={() => <AntDesign name={'right'} style={styles.left_icon} size={15} color={Colors.primary_color} />}
                            />
                            <List.Item
                                onPress={() => props.navigation.navigate('Edit Installment')}
                                style={styles.list}
                                titleStyle={{
                                    fontSize: 13, margin: 0, padding: 0, color: 'gray'
                                }}
                                title={'Edit Installment'}
                                left={() => <AntDesign name={'edit'} style={styles.icon} size={25} color={Colors.primary_color} />}
                                right={() => <AntDesign name={'right'} style={styles.icon} size={15} color={Colors.primary_color} />}
                            />
                            <List.Item
                                onPress={() => setOrderStackShow(!orderStackShow)}
                                style={styles.list}
                                titleStyle={{
                                    fontSize: 13, margin: 0, padding: 0, color: 'gray'
                                }}
                                title={'Orders'}
                                left={() => <AntDesign name={'edit'} style={styles.icon} size={25} color={Colors.primary_color} />}
                                right={() => <AntDesign name={orderStackShow ? 'up' : 'down'} style={styles.icon} size={15} color={Colors.primary_color} />}
                            />
                            {orderStackShow && <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                <List.Item
                                    onPress={() => { setOrderStackShow(!orderStackShow), props.navigation.navigate('Progress Orders', { from: 'seller', _id: props.user._id }) }}
                                    style={styles.list}
                                    titleStyle={{
                                        fontSize: 13, margin: 0, padding: 0, color: 'gray'
                                    }}
                                    title={'Progress'}

                                    left={() => <MaterialCommunityIcons name="progress-clock" style={styles.icon} size={25} color={Colors.primary_color} />}
                                    right={() => <AntDesign name={'right'} style={styles.icon} size={15} color={Colors.primary_color} />}
                                />
                                <List.Item
                                    onPress={() => { setOrderStackShow(!orderStackShow), props.navigation.navigate('Completed Orders', { from: 'seller', _id: props.user._id }) }}
                                    style={styles.list}
                                    titleStyle={{
                                        fontSize: 13, margin: 0, padding: 0, color: 'gray'
                                    }}
                                    title={'Completed'}
                                    left={() => <AntDesign name={'checkcircleo'} style={styles.icon} size={25} color={Colors.primary_color} />}
                                    right={() => <AntDesign name={'right'} style={styles.icon} size={15} color={Colors.primary_color} />}
                                />
                            </View>
                            }
                            <List.Item
                                onPress={() => props.navigation.navigate('Messages', { user_id: props.user._id })}
                                style={styles.list}
                                titleStyle={{
                                    fontSize: 13, margin: 0, padding: 0, color: 'gray', marginVertical: 0,
                                    marginHorizontal: 0,
                                }}
                                title={'Messages'}
                                left={() => <AntDesign name={'message1'} style={styles.left_icon} size={25} color={Colors.primary_color} />}
                                right={() => <AntDesign name={'right'} style={styles.left_icon} size={15} color={Colors.primary_color} />}
                            />
                        </View>
                    }
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    welcome: {
        marginBottom: 15,
        marginTop: 10,
        color: Colors.primary_color,
        textAlign: "center",
        fontSize: 20,
    },
    admin_text: {
        textAlign: "center",
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
    body_container: {
        opacity: 0.8,
        flex: 1,
        backgroundColor: Colors.body_color,
        borderTopLeftRadius: 50,
        paddingHorizontal: Padding.page_horizontal * 2.5,
        marginLeft: 15,
        paddingBottom: 30,

        shadowColor: Colors.primary_text_color,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.5,
        elevation: 2,
    },
    icon: {
        display: 'flex',
        alignSelf: 'center',
        margin: 15
    },
    list: {
        backgroundColor: Colors.primary_text_color,
        marginVertical: 5,
        paddingVertical: 0,
        marginHorizontal: 0,
        shadowColor: Colors.primary_color,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        elevation: 2,
        borderRadius: 5,
    },
    backImgContainer: {
        height: 80,
        marginBottom: 10,
        justifyContent: "center"
    },
    left_icon: {
        display: 'flex',
        alignItems: 'center',
        margin: 15
    },
    list: {
        backgroundColor: Colors.primary_text_color,
        marginVertical: 5,
        paddingVertical: 0,
        marginHorizontal: 0,
        shadowColor: Colors.primary_color,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        elevation: 2,
        borderRadius: 5,
    },
    picker_view: {
        flex: 1,
        alignItems: "center",
    },
    picker: {
        height: 50,
        width: '90%',
        marginVertical: '2%',
        borderColor: 'white'
    },
});