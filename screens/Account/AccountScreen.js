import { StyleSheet, Text, SafeAreaView, View, ImageBackground, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import CustomListItem from '../../shared/custom-list-item';
import { Button, Avatar, List } from 'react-native-paper';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { removeTokenFromStorage } from '../../sdk/authentication-service';
import Padding from '../../constants/Padding';
import STATUSBAR_HEIGHT from '../../constants/StatusBarHeight';
import TransparentStatusBar from '../../components/TransparentStatusBar';
import { useState } from 'react';

import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AccountScreen(props) {
    const [orderStackShow, setOrderStackShow] = useState(false);
    async function logout() {
        if (removeTokenFromStorage()) {
            props.logout()
        }
    }
    return (
        <ImageBackground source={require('../../assets/images/background.jpg')} style={{ flex: 1, justifyContent: 'center', paddingTop: STATUSBAR_HEIGHT }}>
            <TransparentStatusBar />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.backImgContainer}>
                    {props.user.full_name == '' ?
                        <>
                            <View style={styles.img_login_button_div}>
                                <Button loading={false} icon='login' onPress={() => props.navigation.navigate('Login')} style={{ backgroundColor: Colors.primary_text_color }}>
                                    {'Login'}
                                </Button>
                            </View>
                            <View style={styles.signup}>
                                <Text style={{ color: Colors.primary_text_color }}>{'Don\'t have an account? '}</Text>
                                <Text style={{ color: Colors.primary_text_color, fontSize: 18 }} onPress={() => props.navigation.navigate('Signup')} > {'Signup'} </Text>
                            </View>
                        </>
                        :
                        <View style={{ flex: 1, display: 'flex', flexDirection: 'row', marginLeft: 20 }}>
                            <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {props.user.avatar ?
                                    <Avatar.Image size={80} source={{ uri: props.user.avatar }} />
                                    :
                                    <Entypo name="user" size={80} color={Colors.primary_text_color} />
                                }
                            </View>
                            <View style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18, color: Colors.primary_text_color, fontWeight: 'bold' }}>{props.user.full_name}</Text>
                                <Text style={{ fontSize: 13, color: Colors.primary_text_color, fontWeight: 'bold' }}>{props.user.mobile}</Text>
                                <Text style={{ color: Colors.primary_text_color, position: 'absolute', right: 20, bottom: 20 }} onPress={() => props.navigation.navigate('Personel Info')} > {'View'} </Text>
                            </View>
                        </View>
                    }
                </View>
                <View style={styles.body_container}>
                    <Text style={styles.welcome}>Welcome to Al-Makan</Text>
                    {props.user.full_name != '' && <>
                        <CustomListItem title={'Address'} onPress={() => props.navigation.navigate('My Address')} lefticon="home" righticon='right' />
                        <CustomListItem title={'Change Picture'} onPress={() => props.navigation.navigate('Change Picture')} lefticon="picture" righticon='right' />
                        <CustomListItem title={'Change Password'} onPress={() => props.navigation.navigate('Reset Password')} lefticon="lock1" righticon='right' />
                        {props.user.role == 'customer' && <>
                            <View style={{ marginBottom: '2%' }}>
                                <CustomListItem title={'My Wishlist'} onPress={() => props.navigation.navigate('My Wishlist')} lefticon="hearto" righticon='right' />
                            </View>
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
                                    onPress={() => { setOrderStackShow(!orderStackShow), props.navigation.navigate('Progress Orders', { from: 'user', _id: props.user._id }) }}
                                    style={styles.list}
                                    titleStyle={{
                                        fontSize: 13, margin: 0, padding: 0, color: 'gray'
                                    }}
                                    title={'Progress'}

                                    left={() => <MaterialCommunityIcons name="progress-clock" style={styles.icon} size={25} color={Colors.primary_color} />}
                                    right={() => <AntDesign name={'right'} style={styles.icon} size={15} color={Colors.primary_color} />}
                                />
                                <List.Item
                                    onPress={() => { setOrderStackShow(!orderStackShow), props.navigation.navigate('Completed Orders', { from: 'user', _id: props.user._id }) }}
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
                        </>
                        }
                    </>
                    }
                    {props.user.full_name != '' && <>
                        <View style={{ marginVertical: '3%' }}>
                            <CustomListItem title={'Logout'} onPress={logout} lefticon="logout" righticon='right' />
                        </View>
                    </>}
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
    body_container: {
        opacity: 0.8,
        flex: 1,
        backgroundColor: Colors.body_color,
        borderTopLeftRadius: 50,
        paddingHorizontal: Padding.page_horizontal * 2.5,
        marginLeft: 15,

        shadowColor: Colors.primary_text_color,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.5,
        elevation: 2,
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
        height: 100,
        marginBottom: 10,
        overflow: 'hidden'
    },
    img_login_button_div: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signup: {
        marginTop: -15,
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        display: 'flex',
        alignSelf: 'center',
        margin: 15
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