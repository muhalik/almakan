import React, { useState } from 'react'
import { SafeAreaView, ScrollView, StatusBar } from 'react-native'
import { Searchbar } from 'react-native-paper';
import Padding from '../constants/Padding';
import { FormattedMessage } from 'react-intl'
import Colors from '../constants/Colors';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);

export default function Layout(props) {
    const [searchQuery, setSearchQuery] = useState('');
    const onChangeSearch = query => setSearchQuery(query);

    function handleSearch() {
        props.navigation.push('Search', { search: searchQuery })
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 0 }}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false} style={{ margin: Padding.page_horizontal }}>
                <Searchbar style={{ margin: Padding.page_horizontal }}
                    placeholder={'Search here'}
                    onChangeText={onChangeSearch}
                    onSubmitEditing={handleSearch}
                    value={searchQuery}
                    placeholderTextColor={Colors.primary_color}
                    inputStyle={{ fontSize: 14, color: Colors.primary_color }}
                    onIconPress={handleSearch}
                    iconColor={Colors.primary_color}
                />
                {props.children}
            </ScrollView>
        </SafeAreaView>
    )
}
