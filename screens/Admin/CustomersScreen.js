import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native'
import axios from 'axios'
import AlMakanConfig from '../../sdk/almakan.config'
import getUsersPageLimit from '../../hooks/getUsersPageLimit'
import Padding from '../../constants/Padding'
import Colors from '../../constants/Colors'
import NoDataFound from '../../components/NoDataFound'
import Loading from '../../components/Loading'
import { Button, Card } from 'react-native-paper'

export default function CustomersScreen(props) {
    const [page, setPage] = useState(1)
    const [pageNumber, setPageNumber] = useState(1)

    const { users_loading, users_error, users, users_pages, hasMore, users_total } = getUsersPageLimit(props.token, 'customers', pageNumber, '20')

    function handleLoadMore() {
        if (hasMore) {
            setTimeout(() => {
                setPageNumber(pageNumber + 1)
            }, 500);
        }
    }

    async function deleteVendor(_id) {
        const _url = AlMakanConfig.PATH + `/users/user/${_id}`
        await axios({
            method: 'DELETE',
            url: _url,
            headers: {
                'authorization': props.token
            },
        }).then(res => {

        }).catch(err => {

        })
    }

    function showConfirmAlert(_id) {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete user?",
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: "cancel"
                },
                { text: "Sure", onPress: () => deleteVendor(_id) }
            ],
            { cancelable: false }
        );
    }

    function renderItem({ item }) {
        return (
            <View style={styles.itemView}>
                <Card>
                    <Card.Title title={item.full_name} subtitle={'ID:' + item._id} />
                    <Card.Content>
                        <View style={styles.cardBody}>
                            <Text style={{ flex: 1 }}>{'Mobile: '}</Text>
                            <Text style={{ flex: 1 }}>{item.mobile}</Text>
                        </View>
                        {item.email &&
                            <View style={styles.cardBody}>
                                <Text style={{ flex: 1 }}>{'Emil: '}</Text>
                                <Text style={{ flex: 1 }}>{item.email}</Text>
                            </View>
                        }
                        <View style={styles.cardBody}>
                            <Text style={{ flex: 1 }}>{'Address: '}</Text>
                            <Text style={{ flex: 1 }}>{item.address}</Text>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={{ flex: 1 }}>{'Entry Date: '}</Text>
                            <Text style={{ flex: 1 }}>{item.entry_date.substring(0, 10)}</Text>
                        </View>
                    </Card.Content>
                    <Card.Actions style={{
                        justifyContent: 'flex-end', marginRight: 10,
                        marginBottom: 5
                    }}>
                        <Button color={'white'} onPress={() => showConfirmAlert(item._id)} uppercase={false} style={{ backgroundColor: Colors.primary_color, color: Colors.primary_text_color }}>Delete</Button>
                    </Card.Actions>
                </Card>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {users_total > 0 ?
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    numColumns={1}
                    initialNumToRender={1}
                    ListFooterComponent={() => {
                        return (
                            users_loading &&
                            <Loading />
                        );
                    }}
                    onEndReached={handleLoadMore}
                    onEndThreshold={0}
                />
                :
                users_loading ?
                    <Loading />
                    :
                    <NoDataFound />
            }
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
})
