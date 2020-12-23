import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AlMakanConfig from '../../sdk/almakan.config';
import getUsersPageLimit from '../../hooks/getUsersPageLimit';
import Padding from '../../constants/Padding';
import Colors from '../../constants/Colors';
import NoDataFound from '../../components/NoDataFound';
import Loading from '../../components/Loading';
import { Button, Card, Searchbar } from 'react-native-paper';
import CustomTextField from '../../shared/custom-text-field';
import FullWidthCustomButton from '../../shared/full-width-custom-button';

export default function EditInstallment(props) {
    const { user, token } = props
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState('')
    const [installmentsPaid, setInstallmentsPaid] = useState()

    const handleSearch = val => {
        setSearch(val)
    }

    useEffect(() => {
        if (search !== '') {
            setIsLoading(true)
            const _url = AlMakanConfig.PATH + `/orders/orders/${search}`;
            axios({
                method: 'GET',
                url: _url,
                headers: {
                    'authorization': token
                },
            }).then(res => {
                setOrder(res.data.data.docs[0])
                setInstallmentsPaid(res.data.data.docs[0].installmentsPaid)
                setIsLoading(false)
            }).catch(err => {
                setOrder('')
                console.log('order getting error:', err)
                setIsLoading(false)
            })
        }
        return () => { }
    }, [search])

    const [product, setProduct] = useState('')
    const [vendor, setVendor] = useState('')

    useEffect(() => {
        if (order !== '') {
            getData();
            getVendor()
        }
        return () => { }
    }, [order])

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

    const handleUpdateInstallment = async () => {
        let data = order;
        data.installmentsPaid = installmentsPaid;
        setLoading(true);
        const _url = AlMakanConfig.PATH + `/orders/update/order/${data._id}`
        await axios.put(_url, data, {
            headers: {
                'authorization': token
            }
        }).then((res) => {
            setLoading(false)
            Alert.alert('Success', 'Installment Updated Successfully')
        }).catch((error) => {
            setLoading(false)
            Alert.alert('Error', 'Installment Update Failed.')
        })
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Searchbar
                    placeholder="Search by Building Name"
                    onChangeText={handleSearch}
                    value={search}
                    placeholderTextColor={Colors.secondary_color}
                    style={{ marginBottom: 2 }}
                    inputStyle={{ fontSize: 14, color: Colors.secondary_color }}
                    onIconPress={() => handleSearch(search)}
                    iconColor={Colors.secondary_color}
                />
                {order !== '' ?
                    <>
                        <Card style={{ marginVertical: 5 }}>
                            <Card.Title title={'Order Information'} subtitle={'Appartment ID: ' + order.p_id} />
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
                        <Card style={{ marginVertical: 5 }}>
                            <Card.Title title={'Edit Installment'} subtitle={'Edit Paid Installments'} />
                            {/* 5fccad8d6664d50024f6e2c8 */}
                            <Card.Content>
                                <CustomTextField disabled={true} label={'Installments Paid'} value={installmentsPaid} onChangeText={() => { }} />
                            </Card.Content>
                            <Card.Actions>
                                <Button color={'white'} onPress={() => { installmentsPaid > 0 && setInstallmentsPaid(installmentsPaid - 1) }} uppercase={false} style={styles.btn}>-</Button>
                                <View style={{ flex: 1 }}></View>
                                <Button color={'white'} onPress={() => { installmentsPaid < order.totalInstallments && setInstallmentsPaid(parseInt(installmentsPaid) + 1) }} uppercase={false} style={styles.btn}>+</Button>
                            </Card.Actions>
                            <Card.Actions>
                                <FullWidthCustomButton isPrimary={true} onPress={() => handleUpdateInstallment()} loading={loading}>Upldate</FullWidthCustomButton>
                            </Card.Actions>
                        </Card>

                    </>
                    :
                    isLoading ?
                        <Loading />
                        :
                        <NoDataFound />
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Padding.page_horizontal * 2
    },
    picker: {
        height: 40,
        width: '100%',
        alignItems: 'center',
        padding: 10,
        marginBottom: 15,
        backgroundColor: Colors.secondary_color,
        color: Colors.primary_text_color
    },
    btn: {
        backgroundColor: Colors.secondary_color,
        width: '45%',
    },
    itemView: {
        marginBottom: 10
    },
    cardBody: {
        flexDirection: 'row',
        marginVertical: 5
    },
})
