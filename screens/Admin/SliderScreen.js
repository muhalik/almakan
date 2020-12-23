import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, Alert, TouchableOpacity, ScrollView } from 'react-native'
import FullWidthCustomButton from '../../shared/full-width-custom-button';
import axios from 'axios'
import AlMakanConfig from '../../sdk/almakan.config';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import Padding from '../../constants/Padding';
import CustomTextField from '../../shared/custom-text-field';
import Colors from '../../constants/Colors';
import { Button, Searchbar } from 'react-native-paper';
import imgUploadCloudinary from '../../hooks/imgUploadCloudinary';

export default function SliderScreen(props) {
    const [img, setImg] = useState(null)
    const [imgPreview, setImgPreview] = useState(null)
    const [showResults, setShowResults] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [building_name, setBuilding_name] = useState('')
    const [_id, set_id] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [url, seturl] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [sliders, setSliders] = useState(props.sliders_list)

    const onChangeSearch = async (query) => {
        setSearchQuery(query)
        const _url = AlMakanConfig.PATH + '/products/search/building-name/abc'
        axios({
            method: 'GET',
            url: _url,
            headers: {
                'authorization': props.token
            },
            params: { q: query },
        }).then((res) => {
            setSearchResults(res.data.data)
        }).catch((error) => {
            alert('get search failed')
        });
    };

    useEffect(() => {
        getPermissionAsync();
        return () => { }
    }, [])

    async function getPermissionAsync() {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    async function _pickImage() {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true
            });
            if (!result.cancelled) {
                setImg(`data:image/jpg;base64,${result.base64}`);
                setImgPreview(result.uri);
            }
        } catch (E) {
            console.log(E);
        }
    };










    // Add Slider
    async function uploadSlider() {
        setIsLoading(true)
        let secure_url = null;

        let data = {
            "file": img,
            "upload_preset": "almakan",
        }
        await fetch('https://api.cloudinary.com/v1_1/dfavoxppv/image/upload', {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        }).then(async res => {
            let dataa = await res.json()
            secure_url = dataa.url;
        }).catch(err => {
            setIsLoading(false)
            Alertalert('Error', 'Slider Upload failed')
        })

        if (secure_url !== null) {
            data = {
                p_id: _id,
                building_name: building_name,
                image_link1: secure_url
            }
            const _url = AlMakanConfig.PATH + '/sliders/add'
            await axios.post(_url, data, {
                headers: {
                    'authorization': props.token,
                }
            }).then((res) => {
                setIsLoading(false)
                seturl('')
                setImgPreview(null)
                setImg(null)
                set_id(null)
                setBuilding_name('')
                setSearchQuery('')
                props.reloadSliders()
                Alert.alert('Success', 'Data Uploaded Successfully')
            }).catch((error) => {
                console.log('error:', error)
                setIsLoading(false)
                Alertalert('Error', 'Slider Upload failed')
            });
        }
    }

    // Delete Slider
    async function deleteSliderImage(_id, index) {
        Alert.alert(
            'Conform',
            'Are you sure, you want to delete slider',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Delete', onPress: () => deleteSliderConfirmed(_id, index) },
            ],
            { cancelable: true },
        );

    }
    const deleteSliderConfirmed = async (_id, index) => {
        let copyArray = Object.assign([], sliders);
        let obj = copyArray[index];
        obj['loading'] = true;
        copyArray[index] = obj;
        setSliders(copyArray)
        console.log('_id:', _id)
        const _url = AlMakanConfig.PATH + `/sliders/${_id}`
        await axios({
            method: 'DELETE',
            url: _url,
            headers: {
                'authorization': props.token
            },
        }).then(res => {
            Alert.alert('Success', 'Slider Deleted Successfully')
            let obj1 = copyArray[index];
            obj1['loading'] = false;
            copyArray[index] = obj1;
            setSliders(copyArray)
            props.reloadSliders()
        }).catch(err => {
            console.log('error:', err)
            let obj2 = copyArray[index];
            obj2['loading'] = false;
            copyArray[index] = obj2;
            setSliders(copyArray)
            Alert.alert('Error', 'Slider Delete Failed')
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={[styles.div_container, { zIndex: 2 }]}>
                    <Text style={{ fontSize: 18, marginBottom: 10, textAlign: 'center', color: 'gray' }}>{'Add Slider'}</Text>
                    <Searchbar style={{ margin: Padding.page_horizontal }}
                        placeholder={'Enter Appartment ID or Name'}
                        onChangeText={onChangeSearch}
                        placeholderTextColor={Colors.secondary_color}
                        onSubmitEditing={onChangeSearch}
                        inputStyle={{ fontSize: 14, color: Colors.secondary_color }}
                        iconColor={Colors.secondary_color}
                        value={searchQuery}
                        onFocus={() => setShowResults(true)}
                    // onBlur={() => setShowResults(false)}
                    />
                    {searchQuery != '' && showResults && <View style={styles.showSearchContainer}>
                        {searchResults && searchResults.map((item, index) => {
                            if (item._id.includes(searchQuery) || item.building_name.includes(searchQuery)) {
                                return <TouchableOpacity key={index} onPress={() => { set_id(item._id), setBuilding_name(item.building_name), setShowResults(false) }} style={styles.searchDiv}>
                                    <Text style={styles.searchItem}>{'ID: '}{item._id}</Text>
                                    <Text style={styles.searchItem}>{'Name: '}{item.building_name}</Text>
                                </TouchableOpacity>
                            }
                        })}
                    </View>
                    }
                    {building_name != '' && _id != '' &&
                        <View style={{ marginHorizontal: 5 }}>
                            <CustomTextField
                                label={'ID'}
                                value={_id}
                                disabled={true}
                            />
                            <CustomTextField
                                label={'Building Name'}
                                value={building_name}
                                disabled={true}
                            />
                        </View>
                    }

                    {imgPreview && <Image
                        style={styles.img}
                        source={{
                            uri: imgPreview,
                        }}
                    />}
                    <View style={{ marginHorizontal: 3 }}>
                        <FullWidthCustomButton onPress={() => _pickImage()} icon='image'>
                            {'Choose Image'}
                        </FullWidthCustomButton>
                        <FullWidthCustomButton loading={isLoading} disabled={_id == null || building_name == '' || img == null || isLoading} onPress={() => uploadSlider()} icon='upload'>
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </FullWidthCustomButton>
                    </View>
                </View>

                <View style={[styles.div_container, { zIndex: 1 }]}>
                    <Text style={{ fontSize: 18, marginBottom: 10, textAlign: 'center', color: 'gray' }}>{'All Slider'}</Text>
                    {sliders && sliders.map((item, index) => (
                        <View style={{ marginBottom: 20 }} key={index}>
                            <Image
                                style={styles.img}
                                source={{
                                    uri: item.image_link1,
                                }}
                            />
                            <View style={{ marginTop: 5 }} />
                            <Button loading={item.loading} mode='contained' icon='delete' uppercase={false} disabled={item.loading} onPress={() => deleteSliderImage(item._id, index)} color={Colors.error_color}>Delete</Button>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: Padding.page_horizontal,
    },
    div_container: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 5,
        paddingBottom: 10,
        borderRadius: 5,
    },
    showSearchContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        padding: 10,
        position: 'absolute',
        zIndex: 3,
        width: '100%',
        alignSelf: 'center',
        minHeight: 100,
        maxHeight: 400,
        marginTop: 100,
        overflow: 'scroll',
    },
    searchDiv: {
        borderWidth: 0.5,
        borderColor: 'lightgreen',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    searchItem: {
        fontSize: 12,
        color: 'gray'
    },
    img: {
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: 150,
        maxHeight: 150,
        borderRadius: 5,
        overflow: 'hidden'
    },
})
