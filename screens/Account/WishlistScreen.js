import React, { useEffect, useState } from 'react'
import axios from 'axios'
import NoDataFound from '../../components/NoDataFound'
import Padding from '../../constants/Padding'
import { View, Text, StyleSheet, Image, TouchableOpacity, } from 'react-native'
import Colors from '../../constants/Colors'
import AlMakanConfig from '../../sdk/almakan.config'
import { Card, Paragraph, Button } from 'react-native-paper'

export default function WishlistScreen(props) {
    const [my_wishlist, setMy_wishlist] = useState([])
    useEffect(() => {
        setMy_wishlist([])
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        if (props.user.role != 'customer') {
            props.navigation.navigate('Root', { screen: 'Home' })
        } else {
            props.user.wishlist && props.user.wishlist.forEach((element, index) => {
                getProducts(element, index)
            })
        }

        async function getProducts(element, index) {
            const url_1 = AlMakanConfig.PATH + `/products/product-by-id/${element.p_id}`;
            await axios.get(url_1).then((res) => {
                let obj = {}
                obj['_id'] = element._id
                obj['p_id'] = element.p_id
                obj['product'] = res.data.data
                obj['isLoading'] = false
                setMy_wishlist(prev => {
                    return [...new Set([...prev, obj])]
                })
            }).catch((err) => {
                console.log('err:', err)
            })
        }

        return () => {
        }
    }, [props.user.wishlist])

    async function removeToWishlist(obj_id) {
        // const _url = MuhalikConfig.PATH + `/users/delete/user-wishlist/${props.user._id}`;
        // axios({
        //     method: 'PUT',
        //     url: _url,
        //     params: { p_id: obj_id },
        //     headers: {
        //         'authorization': props.token,
        //     }
        // }).then(res => {
        //     props.reloadUser()
        // }).catch(err => {
        //     console.log('remove to wishlist error:', err)
        // })
        const _url = AlMakanConfig.PATH + `/users/delete/user-wishlist/${props.user._id}`;
        axios({
            method: 'PUT',
            url: _url,
            params: { p_id: obj_id },
            headers: {
                'authorization': props.token,
            }
        }).then(res => {
            props.reloadUser()
        }).catch(err => {
            alert('ERROR')
        })
    }

    return (
        <View style={{ flex: 1 }}>
            {my_wishlist == '' ?
                <NoDataFound />
                :
                <View style={{ flex: 1, margin: Padding.page_horizontal * 2 }}>
                    {my_wishlist && my_wishlist.map((element, index) =>
                        <Card key={index}>
                            <Card.Title title={element.product.building_name} subtitle={'ID:' + element.product._id} />
                            <Card.Content>
                                <View style={{ flexDirection: 'column', width: '70%', paddingVertical: 5, paddingLeft: 4 }}>
                                    <Paragraph>
                                        {'Rs: '}
                                        {element.product.two_bed_price > 0 && element.product.two_bed_price}
                                        {element.product.two_bed_price > 0 && element.product.three_bed_price > 0 && '-'}
                                        {element.product.three_bed_price > 0 && element.product.three_bed_price}
                                        {element.product.three_bed_price > 0 && element.product.four_bed_price > 0 && '-'}
                                        {element.product.four_bed_price > 0 && element.product.four_bed_price}
                                    </Paragraph>
                                </View>
                            </Card.Content>
                            <Card.Actions style={{ marginBottom: 5 }}>
                                <Button color={'white'} onPress={() => props.navigation.navigate('ShowAppartment', { _id: element.product._id, vendor_id: element.product.user_id })}
                                    uppercase={false} style={{ backgroundColor: Colors.secondary_color, color: Colors.primary_text_color, marginRight: 'auto' }}
                                >
                                    {'View'}
                                </Button>
                                <Button color={'white'} onPress={() => removeToWishlist(element.p_id)} uppercase={false} style={{ backgroundColor: Colors.primary_color, color: Colors.primary_text_color }}>
                                    {'Delete'}
                                </Button>
                            </Card.Actions>
                        </Card>
                    )}
                </View>

            }
        </View>
    )
}


const styles = StyleSheet.create({
    price_label: {
        marginVertical: 1.5,
        color: Colors.primary_text_color,
        fontSize: 11,
        marginRight: 'auto',
    },
})