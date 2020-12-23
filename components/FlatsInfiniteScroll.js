import React, { useState, useEffect } from 'react';
import useFlatsInfiniteScroll from '../hooks/useFlatsInfiniteScroll'
import { View, FlatList, Text } from 'react-native';
import NoDataFound from './NoDataFound';
import FlatsCard from './FlatsCard';
import Loading from './Loading';
import translate from '../i18n/translate';
import data from '../sdk/testData';
import Padding from '../constants/Padding';

React.useLayoutEffect = React.useEffect

export default function FlatsInfiniteScroll(props) {
    const [pageNumber, setPageNumber] = useState(1)

    const { flats_loading, flats_error, flats_array, flats_pages, flats_total, flats_hasMore } =
        useFlatsInfiniteScroll(pageNumber, '10')

    function renderItem({ item }) {
        return (
            <View style={{ paddingHorizontal: Padding.page_horizontal, paddingBottom: 10, width: '50%' }}>
                <FlatsCard item={item} navigation={props.navigation} numberOfCol={2} />
            </View>
        )
    }

    useEffect(() => {
        setPageNumber(1)
    }, []);

    function handleLoadMore() {
        if (flats_hasMore) {
            setTimeout(() => {
                setPageNumber(pageNumber + 1)
            }, 500);
        }
    }

    return (
        <>
            {flats_total > 0 ?
                <>
                    <Text style={{ paddingLeft: 6, marginBottom: 10, fontSize: 18 }}>{translate('you_may_like')}</Text>
                    <FlatList
                        data={flats_array}
                        // data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        numColumns={2}
                        initialNumToRender={3}
                        ListFooterComponent={() => {
                            return (
                                flats_loading && <Loading />
                            );
                        }}
                        onEndReached={handleLoadMore}
                        onEndThreshold={0}
                    />
                </>
                :
                flats_hasMore ?
                    <Loading />
                    :
                    <NoDataFound />
            }
        </>
    )
}

