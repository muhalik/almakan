import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, FlatList, Alert } from 'react-native';
import axios from 'axios'
import AlMakanConfig from '../sdk/almakan.config'
import Colors from '../constants/Colors'
import useFlatsInfiniteScroll from '../hooks/useFlatsInfiniteScroll'
import Padding from '../constants/Padding'
import Loading from '../components/Loading';
import { List, FAB, Card, Paragraph, Button } from 'react-native-paper';
import FullWidthCustomButton from '../shared/full-width-custom-button';
import NoDataFound from '../components/NoDataFound';
import FlatsCard from '../components/FlatsCard';
import Layout from '../components/Layout'
import toastAndroid from '../components/toastAndroid'
import CustomTextField from '../shared/custom-text-field';
// import { Picker } from '@react-native-picker/picker';
import { Picker } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
const SCREEN_WIDTH = Dimensions.get('window').width - (Padding.page_horizontal * 2) - 10;
const SCREEN_HEIGHT = Dimensions.get('window').height - 100;

export default function ShowProductScreen(props) {
    const { _id, vendor_id, isSellerAdmin } = props.route.params;
    const [single_product, setSingle_product] = useState(null)
    const [productLoading, setProductLoading] = useState(true)

    const [vendor, setVendor] = useState({})
    const [_loading, cartLoading] = useState(false)
    const [isWishListLoading, setIsWishListLoading] = useState(false)
    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        async function getData() {
            const url_1 = AlMakanConfig.PATH + `/products/product-by-id/${_id}`;
            await axios.get(url_1).then((res) => {
                console.log('sgsgs;', res.data.data)
                setSingle_product(res.data.data)
                setProductLoading(false)
            }).catch((err) => {
                setProductLoading(false)
            })
        }
        getData()
        if (vendor_id !== 'undefined')
            getVendor(vendor_id)
        return () => {
            unmounted = false
            source.cancel();
        };
    }, []);

    useEffect(() => {
        if (single_product != null) {
            getVendor(single_product.user_id)
        }
        return () => { }
    }, [single_product])

    async function getVendor(user_id) {
        const url = AlMakanConfig.PATH + `/users/user-by-id/${user_id}`;
        await axios.get(url).then((res) => {
            setVendor(res.data.data[0])
        }).catch((err) => {
            console.log('Get vendor error:', err)
        })
    }

    async function addToWishlist() {
        if (props.user.full_name == '') {
            props.navigation.navigate('Login')
        } else {
            setIsWishListLoading(true)
            let data = {}
            data = {
                p_id: single_product._id,
            }
            const _url = AlMakanConfig.PATH + `/users/add-to-wishlist/${props.user._id}`;
            await axios({
                method: 'PUT',
                url: _url,
                params: { p_id: single_product._id },
                headers: {
                    'authorization': props.token,
                }
            }).then(function (res) {
                props.reloadUser()
                setIsWishListLoading(false)
            }).catch(function (err) {
                setIsWishListLoading(false)
                alert('ERROR')
            });
        }
    }

    async function removeToWishlist(obj_id) {
        if (props.user.full_name == '') {
            props.navigation.navigate('Login')
        } else {
            setIsWishListLoading(true)
            const _url = AlMakanConfig.PATH + `/users/delete/user-wishlist/${props.user._id}`;
            axios({
                method: 'PUT',
                url: _url,
                params: { p_id: single_product._id },
                headers: {
                    'authorization': props.token,
                }
            }).then(res => {
                props.reloadUser()
                setIsWishListLoading(false)
            }).catch(err => {
                setIsWishListLoading(false)
                alert('ERROR')
            })
        }
    }

    async function reloadProduct() {
        const url_1 = AlMakanConfig.PATH + `/products/product-by-id/${_id}`;
        await axios.get(url_1).then((res) => {
            setSingle_product(res.data.data)
        }).catch((err) => {
        })
    }

    return (
        <Layout navigation={props.navigation}>
            {productLoading ?
                <View style={{ minHeight: SCREEN_HEIGHT }}>
                    <Loading />
                </View>
                :
                single_product == null ?
                    <View style={{ flex: 1, minHeight: SCREEN_HEIGHT, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                        <Text>{'We are sorry no data found'}</Text>
                    </View>
                    :
                    <View>
                        <AppartmentComponent
                            single_product={single_product}
                            vendor={vendor}
                            token={props.token}
                            user={props.user}
                            addToWishlist={addToWishlist}
                            removeToWishlist={removeToWishlist}
                            loading={_loading}
                            reloadProduct={reloadProduct}
                            isWishListLoading={isWishListLoading}
                            navigation={props.navigation}
                            isSellerAdmin={isSellerAdmin}
                            {...props}
                        />
                        {!isSellerAdmin && <RelatedAppartments
                            navigation={props.navigation}
                        />}
                    </View>
            }
        </Layout>
    )
}
function AppartmentComponent(props) {
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [wish_list_obj_id, setwish_list_obj_id] = useState('')

    useEffect(() => {
        setIsInWishlist(false)
        props.user.wishlist && props.user.wishlist.forEach((element, index) => {
            if (element.p_id == props.single_product._id) {
                setIsInWishlist(true)
                setwish_list_obj_id(element._id)
                return
            }
        })
        return () => {
        }
    }, [props])

    const [bedTwoSelectedFloor, setBedTwoSelectedFloor] = useState()
    const [bedTwoSelectedFlat, setBedTwoSlectedFlat] = useState()

    const [bedThreeSelectedFloor, setBedThreeSelectedFloor] = useState()
    const [bedThreeSelectedFlat, setBedThreeSelectedFlat] = useState()

    const [bedFourSelectedFloor, setBedFourSelectedFloor] = useState()
    const [bedFourSelectedFlat, setBedFourSelectedFlat] = useState()

    const handlePlaceOrderPress = () => {
        if (props.user.role === 'customer') {
            props.navigation.navigate('Place Order', { product: props.single_product, vendor: props.vendor })
        } else if (props.user.role === 'admin' || props.user.role === 'vendor') {
            Alert.alert("Info", "Please Login with Customer Account for Place Order!")
        } else {
            props.navigation.navigate('Login')
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <Card style={styles.card}>
                <Card.Title title={props.single_product.building_name} subtitle={'Id: ' + props.single_product._id} />
                <Card.Content>
                    <View style={styles.flex_row}>
                        <Paragraph style={styles.flex}>{'Instalments:'}</Paragraph>
                        <Paragraph style={styles.flex}>{'2/3/4'}</Paragraph>
                    </View>
                    {props.user.role == 'customer' || props.user.role === '' ?
                        <View style={[styles.flex_row, { marginTop: 5 }]}>
                            <Paragraph style={styles.flex}>{isInWishlist ? 'Remove to Whishlist' : 'Add to Wishlist'}</Paragraph>
                            {props.isWishListLoading ?
                                <Text style={styles.flex}>{isInWishlist ? 'Removing...' : 'Adding...'}</Text>
                                :
                                <AntDesign name="heart" style={styles.flex} onPress={() => isInWishlist ? props.removeToWishlist(wish_list_obj_id) : props.addToWishlist()} size={24} color={isInWishlist ? Colors.primary_color : Colors.lightblue} />
                            }
                        </View>
                        :
                        <></>
                    }
                </Card.Content>
            </Card>

            {props.single_product.two_bed_price !== '' &&
                <BedTypeCard
                    title={'2-Bed Flat Info'}
                    img={props.single_product.image_link1}
                    price={props.single_product.two_bed_price}
                    width={props.single_product.two_bed_width}
                    length={props.single_product.two_bed_length}
                    bedType={2}
                    floor={bedTwoSelectedFloor}
                    setFloor={(itemValue) => setBedTwoSelectedFloor(itemValue)}
                    variations={props.single_product.variations}
                    flat={bedTwoSelectedFlat}
                    setFlat={(itemValue) => setBedTwoSlectedFlat(itemValue)}
                />
            }
            {props.single_product.three_bed_price !== '' &&
                <BedTypeCard
                    title={'3-Bed Flat Info'}
                    img={props.single_product.image_link2}
                    price={props.single_product.three_bed_price}
                    width={props.single_product.three_bed_width}
                    length={props.single_product.three_bed_length}
                    bedType={3}
                    floor={bedThreeSelectedFloor}
                    setFloor={(itemValue) => setBedThreeSelectedFloor(itemValue)}
                    variations={props.single_product.variations}
                    flat={bedThreeSelectedFlat}
                    setFlat={(itemValue) => setBedThreeSelectedFlat(itemValue)}
                />}
            {props.single_product.four_bed_price != '' &&
                <BedTypeCard
                    title={'4-Bed Flat Info'}
                    img={props.single_product.image_link3}
                    bedType={4}
                    price={props.single_product.four_bed_price}
                    width={props.single_product.four_bed_width}
                    length={props.single_product.four_bed_length}
                    floor={bedFourSelectedFloor}
                    setFloor={(itemValue) => setBedFourSelectedFloor(itemValue)}
                    variations={props.single_product.variations}
                    flat={bedFourSelectedFlat}
                    setFlat={(itemValue) => setBedFourSelectedFlat(itemValue)}
                />
            }

            <Card style={styles.card}>
                <Card.Title title={'Description'} />
                <Card.Content>
                    <Paragraph>{props.single_product.description || 'No Description'}</Paragraph>
                </Card.Content>
            </Card>

            {!props.isSellerAdmin &&
                <Card style={styles.card}>
                    <Card.Title title={'Place Order'} />
                    <Card.Actions>
                        <FullWidthCustomButton isPrimary={true} onPress={() => handlePlaceOrderPress()}
                        >{'Proceed to Order'}</FullWidthCustomButton>
                    </Card.Actions>
                </Card>
            }
            <TabComponent {...props} />
            <VendorInfo {...props} />
        </View >
    )
}
const BedTypeCard = props => (
    <Card style={styles.card}>
        {!props.isBtn &&
            <>
                <Card.Cover style={styles.image} source={{ uri: props.img }} />
                <Card.Title title={props.title} />
                <Card.Content>
                    <View style={styles.flex_row}>
                        <Paragraph style={styles.flex}>{'Price: '}</Paragraph>
                        <Paragraph style={styles.flex}>{props.price}</Paragraph>
                    </View>
                    <View style={styles.flex_row}>
                        <Paragraph style={styles.flex}>{'Dimentions(w*l): '}</Paragraph>
                        <Paragraph style={styles.flex}>{props.width + ' * ' + props.length}</Paragraph>
                    </View>
                </Card.Content>
            </>
        }
        <Card.Actions>
            <View style={styles.actionContainer}>
                <View style={styles.pickerContainer}>
                    <Paragraph style={styles.flex}>Available Floors</Paragraph>
                    <Picker
                        selectedValue={props.floor}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) => props.setFloor(itemValue)}>
                        <Picker.Item label={'Select'} value={'Select'} />
                        {props.variations && props.variations.map((element, index) => {
                            var found = false
                            element.flats && element.flats.forEach((e, i) => {
                                if (e.bed_type == props.bedType)
                                    found = true
                            })
                            if (found)
                                return <Picker.Item key={index + 1 + ''} label={index + 1 + ''} value={index + 1 + ''} />
                        })}
                    </Picker>
                </View>
                <View style={styles.pickerContainer}>
                    <Paragraph style={styles.flex}>Available Flats</Paragraph>
                    <Picker
                        selectedValue={props.flat}
                        style={styles.picker}
                        disabled={!props.floor}
                        onValueChange={(itemValue, itemIndex) => props.setFlat(itemValue)}
                    >
                        <Picker.Item label={'Select'} value={'Select'} />
                        {props.variations[props.floor - 1] && props.variations[props.floor - 1].flats.map((element, index) => {
                            if (element.bed_type == props.bedType)
                                return <Picker.Item key={index + 1 + ''} label={index + 1 + ''} value={index + 1 + ''} />
                        })}
                    </Picker>
                </View>
            </View>
        </Card.Actions>
    </Card>
)


function VendorInfo(props) {
    return (
        <Card style={styles.card}>
            <Card.Title title={'Seller Info'} />
            <Card.Content>
                <View style={styles.flex_row}>
                    <Paragraph style={styles.flex}>{'Name:'}</Paragraph>
                    <Paragraph style={styles.flex}>{props.vendor.full_name}</Paragraph>
                </View>
                <View style={styles.flex_row}>
                    <Paragraph style={styles.flex}>{'Contact No:'}</Paragraph>
                    <Paragraph style={styles.flex}>{props.vendor.mobile}</Paragraph>
                </View>
            </Card.Content>
            <Card.Actions>
                {!props.isSellerAdmin && <Chat {...props} />}
            </Card.Actions>
        </Card >
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
                    vendor_id: props.vendor._id,
                    user: props.user
                })}
            />
        </View>
    )
}

function TabComponent(props) {
    const [review, setReview] = useState('')
    const [reviewError, setReviewError] = useState('')
    const [loading, setLoading] = useState(false)

    let reviews = []
    if ('reviews' in props.single_product) {
        reviews = props.single_product.reviews;
    }

    function handleSetReview() {
        setLoading(true)
        let parameters = {}
        parameters = { _id: props.single_product._id }

        const _url = AlMakanConfig.PATH + '/products/review/abc'
        axios({
            method: 'PUT',
            url: _url,
            headers: { 'authorization': props.token },
            params: parameters,
            data: { review: review, c_name: props.user.full_name }
        }).then(res => {
            props.reloadProduct()
            setReview('')
            setLoading(false)
            toastAndroid(true, 'Thanks for review, Your review added successfully')
        }).catch(err => {
            setLoading(false)
            Alert.alert('Error', 'Error in review')
        })
    }

    return (
        <Card style={styles.card}>
            <Card.Title title={'Reviews'} />
            <Card.Content>
                <List.AccordionGroup>
                    <List.Accordion title={'Reviews'} id="2" titleStyle={styles.accordin_title} style={styles.accordian}>
                        <View style={{ paddingVertical: 10 }}>
                            {reviews != '' ?
                                reviews && reviews.map((element, index) =>
                                    <View key={index} style={{ padding: 5, marginBottom: 2, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                                        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                            <Text style={{ fontSize: 13, marginRight: 'auto' }}>{element.c_name}</Text>
                                            <Text style={{ fontSize: 13 }}>{element.entry_date.substring(0, 10)}</Text>
                                        </View>
                                        <Text style={styles.color_font}>{element.review}</Text>
                                    </View>
                                )
                                :
                                <Text style={styles.text_center}>{'No Reviews'}</Text>
                            }
                        </View>
                    </List.Accordion>
                    <View style={{ height: 10 }}></View>

                    {props.user.role != '' && props.user.role == 'customer' ?
                        <List.Accordion title={'Give Review'} id="3" titleStyle={styles.accordin_title} style={styles.accordian}>
                            <View style={{ paddingVertical: 5 }}>
                                <CustomTextField
                                    placeholder='Type here'
                                    onChangeText={(val) => { setReview(val), setReviewError('') }}
                                    error={reviewError}
                                    value={review}
                                />
                                {reviewError != '' && <Text style={{ color: Colors.error_color, fontSize: 12 }}>
                                    {reviewError}
                                </Text>}
                                <FullWidthCustomButton onPress={handleSetReview} disabled={!review} loading={loading}>
                                    {loading ? 'Adding...' : 'Add Review'}
                                </FullWidthCustomButton>
                            </View>
                        </List.Accordion>
                        :
                        null
                    }
                </List.AccordionGroup>
            </Card.Content>
        </Card >
    )
}

function RelatedAppartments(props) {
    const { flats_loading, flats_error, flats_array, flats_pages, flats_total, flats_hasMore } = useFlatsInfiniteScroll('1', '6')

    function renderItem({ item }) {
        return (
            <View style={{ padding: 5, width: '33.333%' }}>
                <FlatsCard item={item} navigation={props.navigation} numberOfCol={3} />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, marginTop: 10, marginBottom: 20 }}>
            <Text style={{ color: Colors.secondary_color, marginVertical: 10, paddingLeft: 5 }}>{'You may like'}</Text>
            {flats_total > 0 ?
                <FlatList
                    data={flats_array}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    numColumns={3}
                    initialNumToRender={3}
                    renderFooter={() => {
                        return (
                            flats_loading &&
                            <Loading />
                        );
                    }}
                />
                :
                flats_hasMore ?
                    <Loading />
                    :
                    <NoDataFound />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    div_container: {
        backgroundColor: 'white',
        padding: 5,
        marginVertical: 5,
        marginHorizontal: 5,
        paddingBottom: 10,
        borderRadius: 5
    },
    image: {
        width: '100%',
        height: SCREEN_WIDTH / 2,
        borderRadius: 5,
        overflow: 'hidden',
        borderWidth: 0.2,
        borderColor: 'lightgray',
        marginBottom: 10
    },
    flex: {
        flex: 1
    },
    pickerContainer: {
        width: '50%',
        flexDirection: 'column',
        paddingLeft: 2
    },
    picker: {
        height: 40,
        width: '80%',
        alignItems: 'center',
        padding: 5,
        marginTop: 5,
        backgroundColor: Colors.secondary_color,
        color: Colors.primary_text_color
    },
    accordian: {
        backgroundColor: 'lightblue',
    },
    accordin_title: {
        color: Colors.secondary_color,
        fontSize: 15,
    },
    chat: {
        backgroundColor: Colors.s,
        borderRadius: 33,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        backgroundColor: Colors.primary_text_color,
        margin: 10,
    },
    card: {
        marginBottom: 10,
    },
    actionContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flex_row: {
        flexDirection: 'row'
    },
    color_font: {
        color: 'gray',
        fontSize: 13
    },
    text_center: {
        textAlign: 'center'
    },
})

