import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native'
import axios from 'axios'
import AlMakanConfig from '../../sdk/almakan.config'
import Padding from '../../constants/Padding'
import Colors from '../../constants/Colors'
import NoDataFound from '../../components/NoDataFound'
import Loading from '../../components/Loading'
import { Button, Card } from 'react-native-paper'

export default function ProgressOrders(props) {
    const { from, _id } = props.route.params;
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const { user, token } = props;

    useEffect(() => {
        const getData = async () => {
            let _url = ''
            if (from == 'admin') {
                _url = AlMakanConfig.PATH + `/orders/`
            } else if (from == 'seller') {
                _url = AlMakanConfig.PATH + `/orders/user/orders/${_id}`
            } else if (from == 'user') {
                _url = AlMakanConfig.PATH + `/orders/customer/orders/by/${_id}`
            }
            setIsLoading(true)
            await axios({
                method: 'GET',
                url: _url,
                headers: {
                    'authorization': token
                },
            }).then(res => {
                let array = []
                res.data.data && res.data.data.docs.forEach(element => {
                    if (element.status == 'progress')
                        array.push(element)
                });
                setOrders(array)
            }).catch(err => {
                console.log('order getting error:', err)
                setIsLoading(false)
            })
        }
        getData()
        return () => { }
    }, [])

    function renderItem({ item }) {
        return (
            <View style={styles.itemView}>
                <Card>
                    <Card.Title title={item.c_name} subtitle={'Order ID:' + item._id} />
                    <Card.Content>
                        {/* <View style={styles.cardBody}>
                            <Paragraph style={{ flex: 1 }}>{'Due Installments: '}</Paragraph>
                            <Paragraph style={{ flex: 1 }}>{moment(item.entry_date, 'MM-DD-YYY, HH:MM:ss') }</Paragraph>
                        </View> */}
                        <View style={styles.cardBody}>
                            <Text style={{ flex: 1 }}>{'Mobile: '}</Text>
                            <Text style={{ flex: 1 }}>{item.mobile}</Text>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={{ flex: 1 }}>{'Address: '}</Text>
                            <Text style={{ flex: 1 }}>{item.address}</Text>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={{ flex: 1 }}>{'Entry Date: '}</Text>
                            <Text style={{ flex: 1 }}>{item.entry_date && item.entry_date.substring(0, 10)}</Text>
                        </View>
                    </Card.Content>
                    <Card.Actions style={{
                        justifyContent: 'flex-end', marginRight: 10,
                        marginBottom: 5
                    }}>
                        <Button color={'white'} onPress={() => props.navigation.navigate('View Order', { order: item })}
                            uppercase={false} style={{ backgroundColor: Colors.primary_color, }}
                        >
                            {'View'}
                        </Button>
                    </Card.Actions>
                </Card>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {orders.length > 0 ?
                <FlatList
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    numColumns={1}
                    initialNumToRender={1}
                    onEndThreshold={0}
                />
                :
                isLoading ?
                    <Loading />
                    :
                    <NoDataFound />
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Padding.page_horizontal * 2
    },
    itemView: {
        marginBottom: 10
    },
    cardBody: {
        flexDirection: 'row',
        marginVertical: 5
    },
})