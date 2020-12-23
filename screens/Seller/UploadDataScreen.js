
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, Image, Alert } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
// import { Picker } from '@react-native-picker/picker';
import { Picker } from 'react-native'

import axios from 'axios'
import FullWidthCustomButton from "../../shared/full-width-custom-button";
import CustomTextField from '../../shared/custom-text-field'
import Padding from "../../constants/Padding";
import FieldErrorText from "../../shared/field-error-text";
import AlMakanConfig from "../../sdk/almakan.config";
import { Button } from "react-native-paper";
import Colors from "../../constants/Colors";

const FormValidationSchema = yup.object().shape({
    building_name: yup.string().required('Required *').min(1, 'Must be grater than 0 characters').max(50, 'Can\'t be grater than 50 characters'),
    city: yup.string().required('Required *').min(1, 'Must be grater than 1 characters').max(200, 'Can\'t be grater than 200 characters'),
    location: yup.string().required('Required *').min(5, 'Must be grater than 5 characters').max(200, 'Can\'t be grater than 200 characters'),
    description: yup.string(),

    two_bed_price: yup.number().min(1, 'Must be grater than 0').max(50000000, 'Can\'t be grater than 500,00000'),
    two_bed_width: yup.number().min(1, 'Must be grater than 0').max(50000000, 'Can\'t be grater than 500,00000'),
    two_bed_length: yup.number().min(1, 'Must be grater than 0').max(50000000, 'Can\'t be grater than 500,00000'),

    three_bed_price: yup.number().min(1, 'Must be grater than 0').max(50000000, 'Can\'t be grater than 500,00000'),
    three_bed_width: yup.number().min(1, 'Must be grater than 0').max(50000000, 'Can\'t be grater than 500,00000'),
    three_bed_length: yup.number().min(1, 'Must be grater than 0').max(50000000, 'Can\'t be grater than 500,00000'),

    four_bed_price: yup.number().min(1, 'Must be grater than 0').max(50000000, 'Can\'t be grater than 500,00000'),
    four_bed_width: yup.number().min(1, 'Must be grater than 0').max(50000000, 'Can\'t be grater than 500,00000'),
    four_bed_length: yup.number().min(1, 'Must be grater than 0').max(50000000, 'Can\'t be grater than 500,00000'),

    floors: yup.number().required('Required *').min(1, 'Must be grater than 0').max(50, 'Can\'t be grater than 50'),
    flat_per_floor: yup.number().required('Required *').min(1, 'Must be grater than 0').max(50, 'Can\'t be grater than 50'),
    variations: yup.string(),
    image_link1: yup.string(),
    image_link2: yup.string(),
    image_link3: yup.string(),
    user_id: yup.string(),
});

export default function UploadDataScreen(props) {
    const [isVariationsCreated, setIsVariationsCreated] = useState(false)
    const [variations, setVariations] = useState([])

    const [twoBedImg, setTwoBedImg] = useState('')
    const [threeBedImg, setThreeBedImg] = useState('')
    const [fourBedImg, setFourBedImg] = useState('')

    const [twoBedImagesPreview, setTwoBedImagesPreview] = useState('')
    const [threeBedImagesPreview, setThreeBedImagesPreview] = useState('')
    const [fourBedImagesPreview, setFourBedImagesPreview] = useState('')

    const [twoBedError, setTwoBedError] = useState('')
    const [threeBedError, setThreeBedError] = useState('')
    const [fourBedError, setFourBedError] = useState('')


    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getPermissionAsync();
        return () => {
        }
    }, [])

    async function handleUploadAppartment(values, resetForm) {
        console.log('data:', values)
        setIsLoading(true);
        values.user_id = props.user._id
        const config = {
            headers: {
                'authorization': props.token,
            }
        };
        let url = AlMakanConfig.PATH + '/products/add'
        setTimeout(() => {
            axios.post(url, values, config).then((res) => {
                resetForm()
                setIsLoading(false);
                setIsVariationsCreated(false)
                setVariations([])
                setTwoBedImg('')
                setThreeBedImg('')
                setFourBedImg('')
                setTwoBedImagesPreview('')
                setThreeBedImagesPreview('')
                setFourBedImagesPreview('')
                Alert.alert("Success", 'Data Uploaded Successfully')
                resetForm()
            }).catch((error) => {
                console.log('error:', error)
                setIsLoading(false);
                Alert.alert("Error", 'Data Upload failed')
            });
        }, 500);
    }

    function createVariations(values) {
        setIsVariationsCreated(true)

        for (var i = 1; i <= values.floors; i++) {
            let flats = []
            for (var j = 1; j <= values.flat_per_floor; j++) {
                flats.push({ 'flat_no': i + '-' + j, 'bed_type': '2', })
            }
            variations.push({ flats })
        }
    }
    function setBedType(type, index, i) {
        let array = Object.assign([], variations)
        array[index].flats[i].bed_type = type
        setVariations(array)
    }

    async function uploadSlider(values, resetForm) {
        let found = false;

        if (values.two_bed_price == '' && values.two_bed_width == '' && values.two_bed_length == '' && twoBedImagesPreview == '') {
            setTwoBedError('');
        } else {
            if (values.two_bed_price == '' || values.two_bed_width == '' || values.two_bed_length == '' || twoBedImagesPreview == '') {
                setTwoBedError('Enter all fields');
                found = true;
            } else {
                setTwoBedError('');
            }
        }

        if (values.three_bed_price == '' && values.three_bed_width == '' && values.three_bed_length == '' && threeBedImagesPreview == '') {
            setThreeBedError('');
        } else {
            if (values.three_bed_price == '' || values.three_bed_width == '' || values.three_bed_length == '' || threeBedImagesPreview == '') {
                setThreeBedError('Enter all fields')
                found = true;
            } else {
                setThreeBedError('');
            }
        }

        if (values.four_bed_price == '' && values.four_bed_width == '' && values.four_bed_length == '' && fourBedImagesPreview == '') {
            setFourBedError('');
        } else {
            if (values.four_bed_price == '' || values.four_bed_width == '' || values.four_bed_length == '' || fourBedImagesPreview == '') {
                setFourBedError('Enter all fields')
                found = true;
            } else {
                setFourBedError('');
            }
        }

        if (values.two_bed_price == '' && values.two_bed_width == '' && values.two_bed_length == '' && twoBedImagesPreview == '' &&
            values.three_bed_price == '' && values.three_bed_width == '' && values.three_bed_length == '' && threeBedImagesPreview == '' &&
            values.four_bed_price == '' && values.four_bed_width == '' && values.four_bed_length == '' && fourBedImagesPreview == ''
        ) {
            Alert.alert("Error", 'Error', 'All bed type cant\'t be empty')
            found = true
        }

        if (found) {
            Alert.alert("Error", 'Error', 'Please enter the required fields!')
            return
        } else {
            setIsLoading(true)
            values.variations = variations;
            let uploaded = false;
            if (values.two_bed_price != '') {
                let data = {
                    "file": twoBedImg,
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
                    uploaded = true;
                    values.image_link1 = dataa.secure_url;
                }).catch(err => {
                    uploaded = false;
                    setIsLoading(false)
                    Alert.alert("Error", "An Error Occured While Uploading")
                    return;
                })
            }
            if (values.three_bed_price != '') {
                let data = {
                    "file": threeBedImg,
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
                    uploaded = true;
                    values.image_link2 = dataa.secure_url;
                }).catch(err => {
                    uploaded = false;
                    setIsLoading(false)
                    Alert.alert("Error", "An Error Occured While Uploading")
                    return;
                })
            }
            if (values.four_bed_price != '') {
                let data = {
                    "file": fourBedImg,
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
                    uploaded = true;
                    values.image_link3 = dataa.secure_url;
                }).catch(err => {
                    uploaded = false;
                    setIsLoading(false)
                    Alert.alert("Error", "An Error Occured While Uploading")
                    return;
                })
            }
            if (uploaded == true) {
                handleUploadAppartment(values, resetForm)
            } else {
                setIsLoading(false)
                Alert.alert("Error", "An Error Occured While Uploading")
            }
        }
    }

    async function getPermissionAsync() {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                Alert.alert("Error", 'Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    async function _pickImage(bed_type) {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true
            });
            if (!result.cancelled) {
                if (bed_type == '2') {
                    setTwoBedImg(`data:image/jpg;base64,${result.base64}`)
                    setTwoBedImagesPreview(result.uri)
                } else if (bed_type == '3') {
                    setTwoBedImg(`data:image/jpg;base64,${result.base64}`)
                    setThreeBedImagesPreview(result.uri)
                } else {
                    setTwoBedImg(`data:image/jpg;base64,${result.base64}`)
                    setFourBedImagesPreview(result.uri)
                }
            }
        } catch (E) {
            console.log(E);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Formik
                    initialValues={{
                        building_name: '',
                        city: '',
                        location: '',
                        floors: '',
                        flat_per_floor: '',
                        two_bed_price: '',
                        two_bed_length: '',
                        two_bed_width: '',
                        three_bed_price: '',
                        three_bed_length: '',
                        three_bed_width: '',
                        four_bed_price: '',
                        four_bed_width: '',
                        four_bed_length: '',
                        description: '',
                        image_link1: '',
                        image_link2: '',
                        image_link3: ''
                    }}
                    validationSchema={FormValidationSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => uploadSlider(values, resetForm)
                        .then(() => {
                            setSubmitting(false)
                        })
                        .catch(error => {
                            actions.setFieldError('general', error.message);
                        })
                        .finally(() => {
                            actions.setSubmitting(false);
                        })
                    }
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        touched,
                        errors,
                        handleBlur,
                        isSubmitting
                    }) => {
                        return (
                            <View style={styles.container}>
                                <View style={styles.div_container}>
                                    <Text style={styles.heading}>General Info</Text>
                                    <CustomTextField
                                        label={'Building Name'}
                                        value={values.building_name}
                                        onChangeText={handleChange("building_name")}
                                        onBlur={handleBlur("building_name")}
                                        error={touched.building_name && errors.building_name}
                                    />
                                    <CustomTextField
                                        label={'City'}
                                        value={values.city}
                                        onChangeText={handleChange("city")}
                                        onBlur={handleBlur("city")}
                                        error={touched.city && errors.city}
                                    />
                                    <CustomTextField
                                        label={'Location'}
                                        value={values.location}
                                        onChangeText={handleChange("location")}
                                        onBlur={handleBlur("location")}
                                        error={touched.location && errors.location}
                                    />
                                    <CustomTextField
                                        label={'Description'}
                                        value={values.description}
                                        onChangeText={handleChange("description")}
                                        onBlur={handleBlur("description")}
                                        numberOfLines={5}
                                        multiline={true}
                                        error={touched.description && errors.description}
                                    />
                                </View>

                                {/* 2 Bed Info */}
                                <View style={styles.div_container}>
                                    <Text style={styles.heading}>2 Bed Info</Text>
                                    <CustomTextField
                                        label={'Price'}
                                        value={values.two_bed_price}
                                        onChangeText={handleChange("two_bed_price")}
                                        onBlur={handleBlur("two_bed_price")}
                                        keyboardType='phone-pad'
                                        error={touched.two_bed_price && errors.two_bed_price}
                                    />
                                    <Text style={styles.dimentions_text}>Dimentions</Text>
                                    <View style={styles.dimentions_view}>
                                        <CustomTextField
                                            width={'half'}
                                            label={'Width(inches)'}
                                            value={values.two_bed_width}
                                            onChangeText={handleChange("two_bed_width")}
                                            onBlur={handleBlur("two_bed_width")}
                                            keyboardType='phone-pad'
                                            error={touched.two_bed_width && errors.two_bed_width}
                                        />
                                        <CustomTextField
                                            width={'half'}
                                            label={'Length(inches)'}
                                            value={values.two_bed_length}
                                            onChangeText={handleChange("two_bed_length")}
                                            onBlur={handleBlur("two_bed_length")}
                                            keyboardType='phone-pad'
                                            error={touched.two_bed_length && errors.two_bed_length}
                                        />
                                    </View>
                                    {twoBedImagesPreview !== '' && <Image
                                        style={styles.img}
                                        source={{
                                            uri: twoBedImagesPreview,
                                        }}
                                    />}
                                    <View   >
                                        {twoBedImg == '' ?
                                            <Button onPress={() => _pickImage('2')} icon='image' color={'white'} style={{ backgroundColor: Colors.secondary_color, marginRight: 'auto', width: '100%' }} >  {'Choose Image'}</Button>
                                            :
                                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                                <Button onPress={() => _pickImage('2')} icon='image' color={'white'} style={{ backgroundColor: Colors.secondary_color, marginRight: 'auto' }} >  {'Choose Image'}</Button>
                                                <Button onPress={() => { setTwoBedImg(''), setTwoBedImagesPreview('') }} icon='delete' color={'white'} style={{ backgroundColor: Colors.primary_color }}>{'Delete'}</Button>
                                            </View>
                                        }
                                    </View>
                                    {twoBedError != '' && <FieldErrorText>
                                        {twoBedError}
                                    </FieldErrorText>}
                                </View>


                                {/* 3 Bed Info */}
                                <View style={styles.div_container}>
                                    <Text style={styles.heading}>3 Bed Info</Text>
                                    <CustomTextField
                                        label={'Price'}
                                        value={values.three_bed_price}
                                        onChangeText={handleChange("three_bed_price")}
                                        onBlur={handleBlur("three_bed_price")}
                                        keyboardType='phone-pad'
                                        error={touched.three_bed_price && errors.three_bed_price}
                                    />
                                    <Text style={styles.dimentions_text}>Dimentions</Text>
                                    <View style={styles.dimentions_view}>
                                        <CustomTextField
                                            width={'half'}
                                            label={'Width(inches)'}
                                            value={values.three_bed_width}
                                            onChangeText={handleChange("three_bed_width")}
                                            onBlur={handleBlur("three_bed_width")}
                                            keyboardType='phone-pad'
                                            error={touched.three_bed_width && errors.three_bed_width}
                                        />
                                        <CustomTextField
                                            width={'half'}
                                            label={'Length(inches)'}
                                            value={values.three_bed_length}
                                            onChangeText={handleChange("three_bed_length")}
                                            onBlur={handleBlur("three_bed_length")}
                                            keyboardType='phone-pad'
                                            error={touched.three_bed_length && errors.three_bed_length}
                                        />
                                    </View>
                                    {threeBedImagesPreview !== '' && <Image
                                        style={styles.img}
                                        source={{
                                            uri: threeBedImagesPreview,
                                        }}
                                    />}
                                    <View   >
                                        {threeBedImg == '' ?
                                            <Button onPress={() => _pickImage('3')} icon='image' color={'white'} style={{ backgroundColor: Colors.secondary_color, marginRight: 'auto', width: '100%' }} >  {'Choose Image'}</Button>
                                            :
                                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                                <Button onPress={() => _pickImage('3')} icon='image' color={'white'} style={{ backgroundColor: Colors.secondary_color, marginRight: 'auto' }} >  {'Choose Image'}</Button>
                                                <Button onPress={() => { setThreeBedImg(''), setThreeBedImagesPreview('') }} icon='delete' color={'white'} style={{ backgroundColor: Colors.primary_color }}>{'Delete'}</Button>
                                            </View>
                                        }
                                    </View>
                                    {threeBedError != '' && <FieldErrorText>
                                        {threeBedError}
                                    </FieldErrorText>}
                                </View>


                                {/* 4 Bed Info */}
                                <View style={styles.div_container}>
                                    <Text style={styles.heading}>4 Bed Info</Text>
                                    <CustomTextField
                                        label={'Price'}
                                        value={values.four_bed_price}
                                        onChangeText={handleChange("four_bed_price")}
                                        onBlur={handleBlur("four_bed_price")}
                                        keyboardType='phone-pad'
                                        error={touched.four_bed_price && errors.four_bed_price}
                                    />
                                    <Text style={styles.dimentions_text}>Dimentions</Text>
                                    <View style={styles.dimentions_view}>
                                        <CustomTextField
                                            width={'half'}
                                            label={'Width(inches)'}
                                            value={values.four_bed_width}
                                            onChangeText={handleChange("four_bed_width")}
                                            onBlur={handleBlur("four_bed_width")}
                                            keyboardType='phone-pad'
                                            error={touched.four_bed_width && errors.four_bed_width}
                                        />
                                        <CustomTextField
                                            width={'half'}
                                            label={'Length(inches)'}
                                            value={values.four_bed_length}
                                            onChangeText={handleChange("four_bed_length")}
                                            onBlur={handleBlur("four_bed_length")}
                                            keyboardType='phone-pad'
                                            error={touched.four_bed_length && errors.four_bed_length}
                                        />
                                    </View>
                                    {fourBedImagesPreview != '' && <Image
                                        style={styles.img}
                                        source={{
                                            uri: fourBedImagesPreview,
                                        }}
                                    />}
                                    <View  >
                                        {fourBedImg == '' ?
                                            <Button onPress={() => _pickImage('4')} icon='image' color={'white'} style={{ backgroundColor: Colors.secondary_color, marginRight: 'auto', width: '100%' }} >  {'Choose Image'}</Button>
                                            :
                                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                                <Button onPress={() => _pickImage('4')} icon='image' color={'white'} style={{ backgroundColor: Colors.secondary_color, marginRight: 'auto' }} >  {'Choose Image'}</Button>
                                                <Button onPress={() => { setFourBedImg(''), setFourBedImagesPreview('') }} icon='delete' color={'white'} style={{ backgroundColor: Colors.primary_color }}>{'Delete'}</Button>
                                            </View>
                                        }
                                    </View>
                                    {fourBedError != '' && <FieldErrorText>
                                        {fourBedError}
                                    </FieldErrorText>}
                                </View>


                                {/* Variations */}
                                <View style={styles.div_container}>
                                    <Text style={styles.heading}>Flats Variation</Text>
                                    <CustomTextField
                                        label={'Floor(s) '}
                                        value={values.floors}
                                        onChangeText={handleChange("floors")}
                                        onBlur={handleBlur("floors")}
                                        disabled={isVariationsCreated}
                                        keyboardType='phone-pad'
                                        error={touched.floors && errors.floors}
                                    />
                                    <CustomTextField
                                        label={'Flats Per Floor'}
                                        value={values.flat_per_floor}
                                        onChangeText={handleChange("flat_per_floor")}
                                        onBlur={handleBlur("flat_per_floor")}
                                        disabled={isVariationsCreated}
                                        keyboardType='phone-pad'
                                        error={touched.flat_per_floor && errors.flat_per_floor}
                                    />
                                    {!isVariationsCreated ?
                                        <FullWidthCustomButton icon='plus' onPress={() => createVariations(values)} disabled={values.floors == '' || values.flat_per_floor == ''}>
                                            {'Create Variations'}
                                        </FullWidthCustomButton>
                                        :
                                        <>
                                            <FullWidthCustomButton icon='reload' onPress={() => { setIsVariationsCreated(false), setVariations([]) }} disabled={values.floors == '' || values.flat_per_floor == ''}>
                                                {'Reset'}
                                            </FullWidthCustomButton>
                                            <View style={styles.variation_conatiner}>
                                                <Text style={styles.label}>Select Beds Type</Text>
                                                {variations.map((element, index) => <>
                                                    <Text style={styles.floor_no} key={index}>Floor: {index + 1}</Text>
                                                    {element.flats.map((e, i) =>
                                                        <View key={i} style={styles.picker_view}>
                                                            <Text style={{ marginLeft: 10, marginRight: 'auto' }}>Flat: {e.flat_no}</Text>
                                                            <Picker
                                                                selectedValue={e.bed_type}
                                                                style={styles.picker}
                                                                onValueChange={(itemValue, itemIndex) => { setBedType(itemValue, index, i) }}
                                                            >
                                                                <Picker.Item label="2 Bed" value="2" />
                                                                <Picker.Item label="3 Bed" value="3" />
                                                                <Picker.Item label="4 Bed" value="4" />
                                                            </Picker>
                                                        </View>
                                                    )}
                                                </>
                                                )}
                                            </View>
                                        </>
                                    }
                                </View>


                                {/* <View style={styles.padding_view}></View> */}
                                <FullWidthCustomButton icon='upload' onPress={handleSubmit} loading={isLoading} >
                                    {'Upload'}
                                </FullWidthCustomButton>
                                <View style={styles.padding_view}></View>
                                <View style={styles.padding_view}></View>
                            </View>
                        );
                    }}
                </Formik>
            </ScrollView >
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Padding.page_horizontal,
    },
    div_container: {
        padding: Padding.page_horizontal,
        backgroundColor: 'white',
        marginVertical: 10,
        borderRadius: 5
    },
    heading: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
        marginVertical: 5
    },
    list: {
        backgroundColor: 'white',
        paddingBottom: 0,
        paddingTop: 0,
        margin: 0,
        marginVertical: 3,
    },
    padding_view: {
        paddingVertical: 10,
    },
    dimentions_view: {
        flexDirection: 'row',
        maxWidth: '100%',
        minWidth: '100%',
    },
    dimentions_text: {
        maxWidth: '100%',
        minWidth: '100%',
        marginLeft: 2,
        color: 'gray'
    },
    variation_conatiner: {
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'lightblue',
        borderRadius: 5
    },
    label: {
        fontSize: 16,
        textAlign: 'center',
    },
    floor_no: {
        fontSize: 15,
        paddingTop: 10,
    },
    picker_view: {
        flex: 1,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'center'
    },
    picker: {
        height: 40,
        width: '50%',
        marginVertical: '2%',
        paddingHorizontal: '2%',
        borderColor: 'white',
        borderRadius: 5
    },
    img: {
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: 150,
        maxHeight: 150
    },
});