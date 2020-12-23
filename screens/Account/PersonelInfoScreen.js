import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Alert, ScrollView } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import axios from 'axios'
import MuhalikConfig from '../../sdk/almakan.config'
import FullWidthCustomButton from "../../shared/full-width-custom-button";
import Colors from "../../constants/Colors";
import ImageBackgroundContainer from "../../components/ImageBackgroundContainer";
import toastAndroid from '../../components/toastAndroid'
import CustomTextField from "../../shared/custom-text-field";
import Padding from "../../constants/Padding";

const FormValidationSchema = yup.object().shape({
    mobile: yup.string(),
    full_name: yup.string().required('Required *')
        .min(5, 'Must have at least 5 characters')
        .max(25, 'Can\'t be longer than 25 characters'),
    email: yup.string().email(),
});

export default function PersonelInfoScreen(props) {
    const [isEdit, setIsEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function updatePersonelInfo(data, actions) {
        setIsLoading(true)
        const url = MuhalikConfig.PATH + `/users/user-profile/${props.user._id}`
        axios.put(url, data, {
            headers: {
                'authorization': props.token,
            }
        }).then((res) => {
            props.reloadUser()
            setIsEdit(false)
            setIsLoading(false)
            toastAndroid(true, 'Personel Info Updated Successfully')
        }).catch((err) => {
            console.log('eeeee', err)
            actions.setFieldError('general', "Error")
        });
    }

    console.log('uusseerr:', props.user)

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Formik
                    initialValues={{ mobile: props.user.mobile, full_name: props.user.full_name, email: props.user.email }}
                    validationSchema={FormValidationSchema}
                    onSubmit={(values, actions) => updatePersonelInfo(values, actions)
                        .then(() => {
                        })
                        .catch(err => {
                            actions.setFieldError('general', err.message);
                        })
                        .finally(() => {
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
                                <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 20, color: Colors.primary_color }}>{"Personel Informations"}</Text>
                                <CustomTextField
                                    label={'Mobile number'}
                                    value={props.user.mobile}
                                    onChangeText={handleChange("mobile")}
                                    onBlur={handleBlur("mobile")}
                                    disabled={true}
                                />
                                <CustomTextField
                                    label={'Full name'}
                                    value={isEdit ? values.full_name : props.user.full_name}
                                    onChangeText={handleChange("full_name")}
                                    onBlur={handleBlur("full_name")}
                                    disabled={!isEdit}
                                    error={touched.full_name && errors.full_name}
                                />
                                <CustomTextField
                                    label={'Email'}
                                    value={isEdit ? values.email : props.user.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    error={touched.email && errors.email}
                                    disabled={!isEdit}
                                />
                                {isEdit ?
                                    <Text style={{ color: Colors.error_color }}>
                                        {errors.general}
                                    </Text>
                                    :
                                    <View style={{ height: 10 }} />
                                }
                                <FullWidthCustomButton icon={isEdit ? 'marker-cancel' : 'account-edit'} disabled={isLoading} onPress={() => isEdit ? setIsEdit(false) : setIsEdit(true)}>
                                    {isEdit ? 'Cancel' : 'Edit'}
                                </FullWidthCustomButton>
                                {isEdit &&
                                    <>
                                        <View style={{ height: 10 }} />
                                        <FullWidthCustomButton icon='update' onPress={handleSubmit} loading={isLoading}
                                            disabled={values.full_name == props.user.full_name && values.email == props.user.email}>
                                            {isLoading ? 'Updating' : 'Update'}
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
        backgroundColor: Colors.primary_text_color,
        borderRadius: 5,
    },
});