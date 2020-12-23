import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Alert, ScrollView } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import axios from 'axios'
import AlMakanConfig from '../../sdk/almakan.config'
import FullWidthCustomButton from "../../shared/full-width-custom-button";
import ImageBackgroundContainer from "../../components/ImageBackgroundContainer";
import toastAndroid from '../../components/toastAndroid'
import CustomTextField from '../../shared/custom-text-field'
import Padding from "../../constants/Padding";
import Colors from "../../constants/Colors";

const FormValidationSchema = yup.object().shape({
    // city: yup.string().required(translate('enter_city'))
    //     .min(3, translate('city_min'))
    //     .max(30, translate('city_max')),
    address: yup.string().required('Required *')
        .min(3, 'Must have at least 3 characters')
        .max(100, 'Can\'t be longer than 100 characters'),
});

export default function AddressScreen(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    async function updateAddress(values, actions) {
        setIsLoading(true)
        let data = {}
        data = {
            // city: values.city,
            address: values.address
        }
        const url = AlMakanConfig.PATH + `/users/user-profile/${props.user._id}`
        axios.put(url, data, {
            headers: {
                'authorization': props.token,
            }
        }).then((res) => {
            props.reloadUser()
            setIsLoading(false)
            toastAndroid(true, 'Address Updated Successfully')
            setIsEdit(false)
        }).catch((err) => {
            setIsLoading(false)
            console.log('eeeee', err)
            actions.setFieldError('general', 'Error')
        });
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Formik
                    initialValues={{
                        // city: props.user.city,
                        address: props.user.address,
                    }}
                    validationSchema={FormValidationSchema}
                    onSubmit={(values, actions) => updateAddress(values, actions)
                        .then(() => {
                        })
                        .catch(err => {
                            actions.setFieldError('general', err.message);
                        })
                        .finally(() => {
                            setIsLoading(false)
                            actions.setSubmitting(false);
                        })}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        touched,
                        errors,
                        handleBlur,
                    }) => {
                        return (
                            <View style={styles.container}>
                                <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 20, color: Colors.primary_color }}>{"Shipping Address"}</Text>
                                <CustomTextField
                                    label={'Address'}
                                    value={isEdit ? values.address : props.user.address}
                                    onChangeText={handleChange("address")}
                                    onBlur={handleBlur("address")}
                                    disabled={!isEdit}
                                    error={touched.address && errors.address}
                                />

                                <FullWidthCustomButton icon={isEdit ? 'marker-cancel' : 'account-edit'} disabled={isLoading} onPress={() => isEdit ? setIsEdit(false) : setIsEdit(true)}>
                                    {isEdit ? 'Cancel' : 'Edit'}
                                </FullWidthCustomButton>
                                {isEdit &&
                                    <>
                                        <View style={{ height: 10 }} />
                                        <FullWidthCustomButton icon='update' onPress={handleSubmit} loading={isLoading}
                                            disabled={values.address == props.user.address}
                                        >
                                            {isLoading ? 'Updating...' : 'Update'}
                                        </FullWidthCustomButton>
                                    </>
                                }
                            </View>
                        );
                    }}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Padding.page_horizontal * 3,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 5,
    },
});