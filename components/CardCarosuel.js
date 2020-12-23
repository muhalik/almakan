import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json
import Padding from '../constants/Padding';
import FlatsCard from './FlatsCard';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_WIDTH = SCREEN_WIDTH - (Padding.page_horizontal * 2);
const ITEM_WIDTH = SLIDER_WIDTH / 3;


class CardCarosuel extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this._renderItem = this._renderItem.bind(this)
    }

    _renderItem({ item }) {
        return (
            <View style={{ padding: Padding.page_horizontal }}>
                <FlatsCard item={item} navigation={this.props.navigation} />
            </View>
        );
    }

    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.props.type == 'New Arrival' ?
                        this.props.navigation.navigate('FlatsScreen', { q: 'new-arrivals' }) :
                        this.props.navigation.navigate('FlatsScreen', { q: 'new-arrivals' })
                    }
                >
                    <View style={{ flexDirection: 'row', padding: Padding.page_horizontal + 2 }}>
                        <Text style={{ marginRight: 'auto', fontSize: 16, color: Colors.secondary_color }}>{this.props.type}</Text>
                        <Text style={{ color: 'blue', fontSize: 13 }}>{'Show More'}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <Carousel
                        data={this.props.data}
                        renderItem={this._renderItem}
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={ITEM_WIDTH}
                        activeSlideAlignment={'start'}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                    />
                </View>
            </View >
        );
    }
}

export default CardCarosuel
