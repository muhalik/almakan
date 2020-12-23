import React, { useState, useEffect } from 'react';
import useQueryInfiniteNewArrivalTopRankingScroll from '../hooks/useNewArrivalTopRankingScroll'
import { View, FlatList } from 'react-native';

import CustomStatusBar from '../components/CustomStatusBar';
import Layout from '../components/Layout';
import NoDataFound from '../components/NoDataFound';
import FlatsCard from '../components/FlatsCard';
import Loading from '../components/Loading';
import CustomHeader from '../components/CustomHeader';

React.useLayoutEffect = React.useEffect

export default function FlatsScreen(props) {
    const { q } = props.route.params;

    const [pageNumber, setPageNumber] = useState(1)

    const { loading, error, products, pages, total, hasMore } = useQueryInfiniteNewArrivalTopRankingScroll(q, pageNumber, '12')

    function renderItem({ item }) {
        return (
            <View style={{ padding: 5, width: '50%' }}>
                <FlatsCard item={item} navigation={props.navigation} numberOfCol={2} />
            </View>
        )
    }

    useEffect(() => {
        setPageNumber(1)
    }, [q]);

    function handleLoadMore() {
        if (hasMore) {
            setTimeout(() => {
                setPageNumber(pageNumber + 1)
            }, 500);
        }
    }

    return (
        <View>
            <CustomStatusBar />
            <CustomHeader navigation={props.navigation} title={q == 'new-arrivals' ? 'New Arrivals' : 'Top Ranking'} />
            {total > 0 ?
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    numColumns={2}
                    initialNumToRender={3}
                    ListFooterComponent={() => {
                        return (
                            loading &&
                            <Loading />
                        );
                    }}
                    onEndReached={handleLoadMore}
                    onEndThreshold={0}
                />
                :
                hasMore ?
                    <Loading />
                    :
                    <NoDataFound />
            }
        </View>
    )
}

