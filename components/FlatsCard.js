import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Padding from '../constants/Padding';
import Colors from '../constants/Colors';

export default function FlatsCard(props) {
    const SCREEN_WIDTH = Dimensions.get('window').width;
    const IMAGE_HEIGHT = props.numberOfCol == 2 ? ((SCREEN_WIDTH - (Padding.page_horizontal * 6)) / 2) / 1.3
        :
        ((SCREEN_WIDTH - (Padding.page_horizontal * 8)) / 3) / 1.3;

    let item = props.item
    return (
        <TouchableOpacity style={{
            borderRadius: 5,
            overflow: 'hidden',
            padding: 0,
            backgroundColor: Colors.primary_text_color,
            borderWidth: 0.1,
            borderColor: Colors.secondary_color
        }}
            onPress={() => props.navigation.push('ShowAppartment', { _id: item._id, vendor_id: item.user_id })}
        >
            <View style={{ padding: 0, margin: 0 }}>
                <Image
                    style={{ minHeight: IMAGE_HEIGHT, maxHeight: IMAGE_HEIGHT, minWidth: '100%', maxWidth: '100%' }}
                    source={{
                        uri: item.image_link1 !== '' ?
                            item.image_link1
                            :
                            item.image_link2 !== '' ?
                                item.image_link2
                                :
                                item.image_link3
                    }}
                    defaultSource={require('../assets/images/logo.jpg')}
                />
                <View style={{ padding: 5 }}>
                    <Text style={styles.product_labels} numberOfLines={1}>{item.building_name}</Text>
                    <Text style={styles.reviews_label} numberOfLines={1}>{'Reviews: '}{item.reviews && item.reviews.length || '0'}</Text>
                    <Text numberOfLines={1} style={styles.price_label}>
                        {'Rs: '}
                        {item.two_bed_price > 0 && item.two_bed_price}
                        {item.two_bed_price > 0 && item.three_bed_price > 0 && '-'}
                        {item.three_bed_price > 0 && item.three_bed_price}
                        {item.three_bed_price > 0 && item.four_bed_price > 0 && '-'}
                        {item.four_bed_price > 0 && item.four_bed_price}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    product_labels: {
        color: Colors.secondary_color,
        fontSize: 13,
        marginBottom: 3
    },
    reviews_label: {
        color: 'lightgray',
        fontSize: 11
    },
    price_label: {
        marginVertical: 1.5,
        color: Colors.secondary_color,
        fontSize: 11,
        marginRight: 'auto',
    },
});