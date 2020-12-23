import React, { Component, useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import axios from 'axios';
import FullWidthCustomButton from '../../shared/full-width-custom-button';
import Padding from '../../constants/Padding';
import { Avatar } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import translate from '../../i18n/translate';
import AlMakanConfig from '../../sdk/almakan.config';
import CustomButton from '../../shared/custom-button';

export default function ChangePictureScreen(props) {

    const [isLoading, setIsLoading] = React.useState(false)
    const [file, setFile] = useState(null)
    const [image, setImage] = useState(null)

    React.useEffect(() => {
        getPermissionAsync();
    }, [])

    const getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                Alert.alert('Sorry', 'we need camera roll permissions to make this work!');
            }
        }
    };

    const _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true
            });
            if (!result.cancelled) {
                setFile(`data:image/jpg;base64,${result.base64}`);
                setImage(result.uri);
            }
        } catch (E) {
            console.log(E);
        }
    };
    const _takePhoto = async () => {
        const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);
        const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        // only if user allows permission to camera AND camera roll
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                mediaTypes: 'Images',
                quality: 1,
                base64: true
            });
            if (!result.cancelled) {
                setFile(`data:image/jpg;base64,${result.base64}`);
                setImage(result.uri);
            }
        }
    };

    const handleImgUpload = async () => {
        setIsLoading(true)
        let secure_url = '';
        let uploaded = false;

        let data = {
            "file": file,
            "upload_preset": "almakan",
        }
        await fetch('https://api.cloudinary.com/v1_1/dfavoxppv/image/upload', {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        }).then(async res => {
            let data = await res.json()
            secure_url = data.url;
            console.log('secsgsgs:', secure_url)
            uploaded = true
        }).catch(err => {
            console.log('ejdjd:', err)
        })

        if (uploaded) {
            const url = AlMakanConfig.PATH + `/users/user-profile/${props.user._id}`
            await axios.put(url, { avatar: secure_url }, {
                headers: {
                    'authorization': props.token,
                }
            }).then((res) => {
                setIsLoading(false);
                setImage(null);
                setFile(null);
                Alert.alert('Success', 'Profile Image Updated Successfully')
                props.reloadUser()
            }).catch((err) => {
                setIsLoading(false);
                console.log('error:', err)
                Alert.alert('Errorn', 'Img upload failed')
            });
        } else {
            setIsLoading(false);
            Alert.alert('Error', 'Img upload failed')
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ marginTop: -150 }}>
                {image ?
                    <Avatar.Image size={100} source={{ uri: image }} />
                    :
                    props.user.avatar ?
                        <Avatar.Image size={100} source={{ uri: props.user.avatar }} />
                        :
                        <Entypo name="user" size={100} color={Colors.primary_color} />
                }
            </View>
            <View style={{ height: 20 }}>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <CustomButton onPress={_takePhoto} icon='camera'>
                    {'Camera'}
                </CustomButton>
                <View style={{ width: 5 }}></View>
                <CustomButton onPress={_pickImage} icon='image'>
                    {'Choose'}
                </CustomButton>
            </View>

            <FullWidthCustomButton icon="upload" onPress={() => handleImgUpload()} loading={isLoading} disabled={!image || isLoading}>
                {isLoading ? 'Uploading' : 'Upload'}
            </FullWidthCustomButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Padding.page_horizontal * 3,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 5,
    },
})