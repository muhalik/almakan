import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, Alert, ScrollView } from 'react-native'
import axios from 'axios'
import AlMakanConfig from '../../sdk/almakan.config'
import getUsersPageLimit from '../../hooks/getUsersPageLimit'
import Padding from '../../constants/Padding'
import Colors from '../../constants/Colors'
import NoDataFound from '../../components/NoDataFound'
import Loading from '../../components/Loading'
import { Button, Card, Searchbar } from 'react-native-paper'
import useFlatsInfiniteScroll from '../../hooks/useFlatsInfiniteScroll'
import useAllProductsSearch from '../../hooks/useAllProductsSearch'
// import { Picker } from '@react-native-picker/picker';
import { Picker } from 'react-native'

export default function SellerInventoryScreen(props) {
    const [isSearch, setIsSearch] = useState(false)
    const [search, setSearch] = useState('')
    const [searchBy, setSearchBy] = useState('_id')
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Inventory',
        })
    }, [])

    const handleSearch = val => {
        setSearch(val)
        if (val == '') {
            setIsSearch(false)
        } else {
            setIsSearch(true)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
                <Searchbar
                    placeholder="Search by Building Name"
                    onChangeText={handleSearch}
                    value={search}
                    placeholderTextColor={Colors.primary_color}
                    style={{ marginBottom: 2 }}
                    inputStyle={{ fontSize: 14, color: Colors.primary_color }}
                    onIconPress={() => setIsSearch(true)}
                    iconColor={Colors.primary_color}
                />
                <Picker
                    selectedValue={props.flat}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => setSearchBy(itemValue)}>
                    <Picker.Item label={'ID'} value={'_id'} />
                    <Picker.Item label={'Building Name'} value={'building_name'} />
                </Picker>

                {isSearch ?
                    <Search query={search} field={searchBy} />
                    :
                    <Inventory />
                }
            </ScrollView>
        </View>
    )
}

function Search(props) {
    const [pageNumber, setPageNumber] = useState(1)
    const { search_loading, search_error, search_products, search_hasMore, search_total } = useAllProductsSearch(props.field, props.query, pageNumber, '10')

    function handleLoadMore() {
        if (search_hasMore) {
            setTimeout(() => {
                setPageNumber(pageNumber + 1)
            }, 500);
        }
    }
    return (
        <View style={styles.container}>
            {search_total > 0 ?
                <FlatList
                    data={search_products}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    numColumns={1}
                    ListFooterComponent={() => {
                        return (
                            search_loading &&
                            <Loading />
                        );
                    }}
                    initialNumToRender={1}
                    onEndThreshold={0}
                    onEndReached={handleLoadMore}
                />
                :
                search_loading ?
                    <Loading />
                    :
                    <NoDataFound />
            }
        </View>
    )
}

function Inventory(props) {
    const [pageNumber, setPageNumber] = useState(1)
    const { flats_loading, flats_error, flats_array, flats_pages, flats_total, flats_hasMore } = useFlatsInfiniteScroll(pageNumber, '10')

    function handleLoadMore() {
        if (flats_hasMore) {
            setTimeout(() => {
                setPageNumber(pageNumber + 1)
            }, 500);
        }
    }

    return (
        <View>
            {flats_total > 0 ?
                <FlatList
                    data={flats_array}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    numColumns={1}
                    initialNumToRender={1}
                    ListFooterComponent={() => {
                        return (
                            flats_loading &&
                            <Loading />
                        );
                    }}
                    onEndReached={handleLoadMore}
                    onEndThreshold={0}
                />
                :
                flats_loading ?
                    <Loading />
                    :
                    <NoDataFound />
            }
        </View>
    )
}

function renderItem({ item }) {
    return (
        <View style={styles.itemView}>
            <Card>
                <Card.Title title={item.building_name} subtitle={'ID:' + item._id} />
                <Card.Content>
                    <View style={styles.cardBody}>
                        <Text style={{ flex: 1 }} style={{ fontSize: 16, color: item.isDeleted ? 'red' : 'green' }}>{item.isDeleted ? 'Sold Out' : 'Available'}</Text>
                    </View>
                </Card.Content>
                <Card.Actions style={{
                    flexDirection: 'row',
                    marginRight: 10,
                    marginBottom: 5,
                    marginLeft: 6
                }}>
                    <Text numberOfLines={1} style={[styles.cardBody, { marginRight: 'auto' }]}>
                        {'Rs: '}
                        {item.two_bed_price > 0 && item.two_bed_price}
                        {item.two_bed_price > 0 && item.three_bed_price > 0 && '-'}
                        {item.three_bed_price > 0 && item.three_bed_price}
                        {item.three_bed_price > 0 && item.four_bed_price > 0 && '-'}
                        {item.four_bed_price > 0 && item.four_bed_price}
                    </Text>
                    <Button color={'white'} onPress={() => props.navigation.navigate('ShowAppartment', { _id: item._id, vendor_id: item.user_id, isSellerAdmin: true })} uppercase={false} style={{ backgroundColor: Colors.secondary_color, color: Colors.primary_text_color }}>View</Button>
                </Card.Actions>
            </Card>
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
    picker: {
        height: 40,
        width: '100%',
        alignItems: 'center',
        padding: 10,
        marginBottom: 15,
        backgroundColor: Colors.secondary_color,
        color: Colors.primary_text_color
    },
})
