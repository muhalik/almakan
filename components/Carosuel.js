import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json

import Padding from '../constants/Padding';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_WIDTH = SCREEN_WIDTH - (Padding.page_horizontal * 4);
const ITEM_WIDTH = SLIDER_WIDTH;
const ITEM_HEIGHT = SLIDER_WIDTH / 1.8;


const DATA = [];
for (let i = 0; i < 10; i++) {
    DATA.push(i)
}

class Carosuel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }
        this._renderItem = this._renderItem.bind(this)
    }

    _renderItem({ item }) {
        return (
            <TouchableOpacity style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.push('ShowAppartment', { _id: item._id })}>
                <ImageBackground source={{ uri: item.image_link1 }} style={styles.backgroud_image}>
                    <View style={{ marginBottom: 'auto' }}></View>
                    <Text style={{ color: 'white', padding: 5, marginBottom: 5, marginLeft: 5, marginRight: 'auto', borderRadius: 5, opacity: 1 }}>{item.building_name}</Text>
                </ImageBackground>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Carousel
                    data={this.props.data}
                    renderItem={this._renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    slideStyle={{ alignItems: 'center', justifyContent: 'center' }}
                    enableSnap={true}
                    loop={true}
                    autoplay={true}
                    autoplayDelay={1000}
                    autoplayInterval={5000}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    backgroud_image: {
        minWidth: ITEM_WIDTH,
        maxWidth: ITEM_WIDTH,
        minHeight: ITEM_HEIGHT,
        maxHeight: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        // flex: 1,
    },
    itemLabel: {
        color: 'white',
        fontSize: 24
    },
    counter: {
        marginTop: 25,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

export default Carosuel
