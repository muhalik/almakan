import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, Alert, ScrollView } from 'react-native'
import Padding from '../../constants/Padding'
import Colors from '../../constants/Colors'
import { Button, Card } from 'react-native-paper'
import axios from 'axios'
import AlMakanConfig from '../../sdk/almakan.config'
import * as Print from 'expo-print';
import moment from 'moment'
const date = moment(new Date()).format('DD/MM/YYYY');

export default function ViewOrder(props) {
    const { order } = props.route.params;
    const [product, setProduct] = useState('')
    const [vendor, setVendor] = useState('')

    useEffect(() => {
        getData();
        getVendor()
        return () => { }
    }, [])

    async function getData() {
        const url_1 = AlMakanConfig.PATH + `/products/product-by-id/${order.p_id}`;
        await axios.get(url_1).then((res) => {
            setProduct(res.data.data)
        }).catch((err) => {
        })
    }
    async function getVendor(user_id) {
        const url = AlMakanConfig.PATH + `/users/user-by-id/${order.user_id}`;
        await axios.get(url).then((res) => {
            setVendor(res.data.data[0])
        }).catch((err) => {
            console.log('Get vendor error:', err)
        })
    }
    const html =
        `<html>
            <body>
                <p class="heading">Almakan</p>
                <p class='date'>${date}</p>
                <p class="line"></p>
                <h1>Order Information</h1> 
                <h3>Order ID: ${order._id}</h3>
                <Card.Content>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Status:</label>
                        <label style={{ flex: 1 }}>${order.status}</label>
                    </h3>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Total Payment:</label>
                        <label style={{ flex: 1 }}>${order.totalPayment}</label>
                    </h3>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Down Payment:</label>
                        <label style={{ flex: 1 }}>${order.downPayment}</label>
                    </h3>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Instalment Price:</label>
                        <label style={{ flex: 1 }}>${order.installmentPrice}</label>
                    </h3>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Total Installments:</label>
                        <label style={{ flex: 1 }}>${order.totalInstallments}</label>
                    </h3>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Installments Paid:</label>
                        <label style={{ flex: 1 }}>${order.installmentsPaid}</label>
                    </h3>
                </Card.Content>

                <h1 className='w-100'>Customer Information</h1>
                <h3>Customer ID: ${order.c_id}</h3>
                <Card.Content>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Name:</label>
                        <label style={{ flex: 1 }}>${order.c_name}</label>
                    </h3>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Mobile:</label>
                        <label style={{ flex: 1 }}>${order.mobile}</label>
                    </h3>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Address:</label>
                        <label style={{ flex: 1 }}>${order.address}</label>
                    </h3>
                </Card.Content>

                <h1 className='w-100'>Seller Information</h1>
                <h3>Seller ID: ${order.user_id}</h3>
                <Card.Content>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Name:</label>
                        <label style={{ flex: 1 }}>${vendor.full_name}</label>
                    </h3>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Mobile:</label>
                        <label style={{ flex: 1 }}>${vendor.mobile}</label>
                    </h3>
                </Card.Content>

                <h1 className='w-100'>Flat Information</h1>
                <h3>Appartment ID: ${order.p_id}</h3>
                <Card.Content>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Building Name:</label>
                        <label style={{ flex: 1 }}>${product.building_name}</label>
                    </h3>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Floor No:</label>
                        <label style={{ flex: 1 }}>${order.floor}</label>
                    </h3>
                    <h3 style={styles.cardBody}>
                        <label style={{ flex: 1 }}>Flat No:</label>
                        <label style={{ flex: 1 }}>${order.flat}</label>
                    </h3>
                </Card.Content>
            </body>
            <style>
                .heading { font-size: 50px; width: 100%; text-align: center; margin: 0px; }
                .line {border-bottom: 1px solid lightgray;}
                .date {position: absolute; top:10; right:10;}
            </style>
        </html>`

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Card>
                <Button color={Colors.primary_color} style={{ position: 'absolute', top: 5, right: 5, width: 50 }} onPress={() => Print.printAsync({ html })} uppercase={false} >Print</Button>
                <Card.Title title={'Order Information'} subtitle={'Order ID: ' + order._id} />
                <Card.Content>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Status: '}</Text>
                        <Text style={{ flex: 1 }}>{order.status}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Total Payment: '}</Text>
                        <Text style={{ flex: 1 }}>{order.totalPayment}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Down Payment: '}</Text>
                        <Text style={{ flex: 1 }}>{order.downPayment}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Instalment Price: '}</Text>
                        <Text style={{ flex: 1 }}>{order.installmentPrice}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Total Installments: '}</Text>
                        <Text style={{ flex: 1 }}>{order.totalInstallments}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Installments Paid: '}</Text>
                        <Text style={{ flex: 1 }}>{order.installmentsPaid}</Text>
                    </View>
                </Card.Content>


                <Card.Title title={'Customer Information'} subtitle={'Customer ID: ' + order.c_id} />
                <Card.Content>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Name: '}</Text>
                        <Text style={{ flex: 1 }}>{order.c_name}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Mobile: '}</Text>
                        <Text style={{ flex: 1 }}>{order.mobile}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Address: '}</Text>
                        <Text style={{ flex: 1 }}>{order.address}</Text>
                    </View>
                </Card.Content>

                <Card.Title title={'Seller Information'} subtitle={'Seller ID: ' + order.user_id} />
                <Card.Content>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Name: '}</Text>
                        <Text style={{ flex: 1 }}>{vendor.full_name}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Mobile: '}</Text>
                        <Text style={{ flex: 1 }}>{vendor.mobile}</Text>
                    </View>
                </Card.Content>

                <Card.Title title={'Flat Information'} subtitle={'Appartment ID: ' + order.p_id} />
                <Card.Content>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Building Name: '}</Text>
                        <Text style={{ flex: 1 }}>{product.building_name}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Floor No: '}</Text>
                        <Text style={{ flex: 1 }}>{order.floor}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }}>{'Flat No: '}</Text>
                        <Text style={{ flex: 1 }}>{order.flat}</Text>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: Padding.page_horizontal * 2,
        // backgroundColor: 'white'
    },
    itemView: {
        marginBottom: 10
    },
    cardBody: {
        flexDirection: 'row',
        marginVertical: 5
    },
})