// import { Picker } from '@react-native-picker/picker'
import { Alert, Picker, ScrollView } from 'react-native'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Button, Card, FAB, Paragraph } from 'react-native-paper'
import Colors from '../../constants/Colors'
import Padding from '../../constants/Padding'
import AlMakanConfig from '../../sdk/almakan.config'
import CustomTextField from '../../shared/custom-text-field'
import FullWidthCustomButton from '../../shared/full-width-custom-button'
import toastAndroid from '../../components/toastAndroid'

export default function PlaceOrderSCreen(props) {
    const [isLoading, setIsLoading] = useState(false)
    const { product, vendor } = props.route.params
    const { user, token } = props

    const [mobile, setmobile] = useState(user.mobile)
    const [full_name, setfull_name] = useState(user.full_name)
    const [address, setaddress] = useState(user.address)

    const [totalPayment, setTotalPayment] = useState(0)
    const [downPayment, setDownPayment] = useState(0)
    const [bedTypePrice, setBedTypePrice] = useState(0)
    const [installmentPrice, setInstallmentPrice] = useState(0)
    const [installmentType, setInstallmentType] = useState('')

    const [bedType, setBedType] = useState('')
    const [selectedFloor, setselectedFloor] = useState(0)
    const [selectedFlat, setselectedFlat] = useState(0)


    const handlePlaceOrder = async () => {
        console.log('ghyss gys')
        if (mobile == '' || full_name == '' || address == '' || bedType == '' || bedType == 'Select' ||
            selectedFloor == '' || selectedFloor == 'Select' || selectedFlat == '' || selectedFlat == 'Select' ||
            installmentType == '' || installmentType == 'Select') {
            alert('Please Provide all Information')
            Alert.alert('Error', 'Please Provide all Information')
            return
        } else {
            setIsLoading(true)
            var data = {};
            data = {
                c_id: user._id,
                c_name: full_name,
                mobile: mobile,
                address: address,
                user_id: product.user_id,
                p_id: product._id,
                floor: selectedFloor,
                flat: selectedFlat,
                totalPayment: totalPayment,
                downPayment: downPayment,
                totalInstallments: installmentType * 12,
                installmentsPaid: 0,
                installmentPrice: installmentPrice,
                status: 'progress'
            }
            const url = AlMakanConfig.PATH + `/orders/add`;
            await axios.post(url, data, {
                headers: {
                    'authorization': token
                }
            }).then((res) => {
                setLoading(false)
                if (res.data.code == 200) {
                    toastAndroid(true, 'Your order placed successfully')
                    setIsLoading(false)
                    Alert.alert('Success', 'Your Order Placed Successfully')
                } else if (res.data.code == 201) {
                    setIsLoading(false)
                    Alert.alert('Error', 'We are sorry this flat is not available.')
                }
            }).catch((error) => {
                setIsLoading(false)
                Alert.alert('Error', 'Place Order Failed')
            })
        }
    }

    useEffect(() => {
        if (bedType == 2) {
            setDownPayment(Math.floor(0.1 * product.two_bed_price));
            setBedTypePrice(product.two_bed_price)
        } else if (bedType == 3) {
            setDownPayment(Math.floor(0.1 * product.three_bed_price));
            setBedTypePrice(product.three_bed_price)
        } else if (bedType == 4) {
            setDownPayment(Math.floor(0.1 * product.four_bed_price));
            setBedTypePrice(product.four_bed_price)
        }
        return () => { }
    }, [bedType])

    useEffect(() => {
        let price = parseInt(bedTypePrice)
        if (installmentType == 1) {
            setTotalPayment(price + (0.05 * price))
            setInstallmentPrice(Math.floor(((price + (0.05 * price)) - downPayment) / 12))
        } else if (installmentType == 2) {
            setTotalPayment(price + (0.05 * price))
            setInstallmentPrice(Math.floor(((price + (0.1 * price)) - downPayment) / 24))
        } else if (installmentType == 3) {
            setTotalPayment(price + (0.05 * price))
            setInstallmentPrice(Math.floor(((price + (0.15 * price)) - downPayment) / 36))
        } else if (installmentType == 4) {
            setTotalPayment(price + (0.05 * price))
            setInstallmentPrice(Math.floor(((price + (0.2 * price)) - downPayment) / 48))
        } else {
            setInstallmentPrice('')
        }
        return () => { }
    }, [bedTypePrice, installmentType])

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Card.Title style={{ alignSelf: 'center' }} title={'Personel Information'} />
                <CustomTextField
                    label={'Name'}
                    value={full_name}
                    onChangeText={(val) => setfull_name(val)}
                    error={full_name == '' && 'Required *'}
                />
                <CustomTextField
                    label={'Mobile'}
                    value={mobile}
                    onChangeText={(val) => setmobile(val)}
                    error={mobile == '' && 'Required *'}
                />
                <CustomTextField
                    label={'Address'}
                    value={address}
                    onChangeText={(val) => setaddress(val)}
                    error={address == '' && 'Required *'}
                />

                <Card.Title style={{ alignSelf: 'center' }} title={'Flat Information'} />
                {/* Bed Type */}
                <View>
                    <Paragraph style={styles.flex}>Bed Type</Paragraph>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={bedType}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => setBedType(itemValue)}
                        >
                            <Picker.Item label='Select' value='Select' />
                            <Picker.Item label='2 Bed' value='2' />
                            <Picker.Item label='3 Bed' value='3' />
                            <Picker.Item label='4 Bed' value='4' />
                        </Picker>
                    </View>
                </View>
                {/* Floor */}
                <View>
                    <Paragraph style={styles.flex}>Floor</Paragraph>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedFloor}
                            style={styles.picker}
                            disabled={bedType == '' || bedType == 'Select'}
                            onValueChange={(itemValue, itemIndex) => setselectedFloor(itemValue)}>
                            <Picker.Item label={'Select'} value={'Select'} />
                            {product.variations && product.variations.map((element, index) => {
                                var found = false
                                element.flats && element.flats.forEach((e, i) => {
                                    if (e.bed_type == bedType)
                                        found = true
                                })
                                if (found)
                                    return <Picker.Item key={index + 1 + ''} label={index + 1 + ''} value={index + 1 + ''} />
                            })}
                        </Picker>
                    </View>
                </View>
                {/* Flat */}
                <View>
                    <Paragraph style={styles.flex}>Flat</Paragraph>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedFlat}
                            style={styles.picker}
                            disabled={selectedFloor == '' || selectedFloor == 'Select' || bedType == '' || bedType == 'Select'}
                            onValueChange={(itemValue, itemIndex) => setselectedFlat(itemValue)}
                        >
                            <Picker.Item label={'Select'} value={'Select'} />
                            {product.variations[selectedFloor - 1] && product.variations[selectedFloor - 1].flats.map((element, index) => {
                                if (element.bed_type === bedType)
                                    return <Picker.Item key={index + 1 + ''} label={index + 1 + ''} value={index + 1 + ''} />
                            })}
                        </Picker>
                    </View>
                </View>

                {/* Installment */}
                <Card.Title style={{ alignSelf: 'center' }} title={'Installment Information'} subtitle={'First Provide Flat Information'} />
                <View>
                    <Paragraph style={styles.flex}>Installments Type</Paragraph>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={installmentType}
                            disabled={selectedFlat == '' || selectedFlat == 'Select'}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => setInstallmentType(itemValue)}
                        >
                            <Picker.Item label='Select' value='Select' />
                            <Picker.Item label='1 years' value='1' />
                            <Picker.Item label='2 years' value='2' />
                            <Picker.Item label='3 years' value='3' />
                            <Picker.Item label='4 years' value='4' />
                        </Picker>
                    </View>
                </View>
                <CustomTextField
                    label={'Total Payment'}
                    value={totalPayment}
                    disabled={true}
                    onChangeText={(val) => { }}
                />
                <CustomTextField
                    label={'Down Payment'}
                    value={downPayment + ''}
                    disabled={true}
                    onChangeText={(val) => { }}
                />
                <CustomTextField
                    label={'Total Installments'}
                    disabled={true}
                    value={(installmentType * 12) + ''}
                    onChangeText={(val) => { }}
                />
                <CustomTextField
                    label={'Installment Price'}
                    disabled={true}
                    value={installmentType !== '' && installmentType !== 'Select' && bedType !== '' && bedType !== 'Select' ? installmentPrice + '' : '0'}
                    onChangeText={(val) => { }}
                />

                <Card style={styles.card}>
                    <Card.Title title={'Seller Info'} subtitle={'For payment contact to seller'} />
                    <Card.Content>
                        <View style={styles.flex_row}>
                            <Paragraph style={styles.flex}>{'Name:'}</Paragraph>
                            <Paragraph style={styles.flex}>{vendor.full_name}</Paragraph>
                        </View>
                        <View style={styles.flex_row}>
                            <Paragraph style={styles.flex}>{'Contact No:'}</Paragraph>
                            <Paragraph style={styles.flex}>{vendor.mobile}</Paragraph>
                        </View>
                    </Card.Content>
                    <Card.Actions>
                        <Chat user={user} user_id={product.user_id} />
                    </Card.Actions>
                </Card >

                <View style={{ height: 20 }} />
                <FullWidthCustomButton loading={isLoading} onPress={() => handlePlaceOrder()} >
                    {'Confirm Order'}
                </FullWidthCustomButton>
            </ScrollView>
        </View>
    )


}

const Chat = props => {
    return (
        <View style={styles.chat}>
            <FAB
                style={styles.fab}
                uppercase={false}
                label='Chat'
                color={Colors.primary_color}
                icon="chat"
                onPress={() => props.navigation.navigate('CustomerChat', {
                    vendor_id: props.user_id,
                    user: props.user
                })}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: Padding.page_horizontal * 3,
        backgroundColor: Colors.primary_text_color,
        flex: 1
    },
    flex_row: {
        flexDirection: 'row'
    },
    pickerContainer: {
        backgroundColor: 'white',
        height: 56,
        width: '100%',
        marginTop: 8,
        marginBottom: 12,
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 0.4,
        borderColor: 'gray'
    },
    chat: {
        backgroundColor: Colors.s,
        borderRadius: 33,
        justifyContent: 'center',
        alignItems: 'center',
    },
    picker: {
        height: 54,
        width: '100%',
        padding: 14,
        borderWidth: 0,
        borderColor: 'white'
    },
    fab: {
        backgroundColor: Colors.primary_text_color,
        margin: 10,
    },
    card: {
        marginBottom: 10,
    },
})