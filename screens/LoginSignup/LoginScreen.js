import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, StatusBar } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { TextInput } from "react-native-paper";
import axios from 'axios'
import MuhalikConfig from '../../sdk/almakan.config'
import { saveTokenToStorage } from "../../sdk/authentication-service";
import FullWidthCustomButton from "../../shared/full-width-custom-button";
import Colors from '../../constants/Colors'
import ImageBackgroundContainer from "../../components/ImageBackgroundContainer";
import MobileNumber from "../../components/MobileNumber";
import PhoneRegExp from '../../constants/PhoneRegix';

import CustomTextField from "../../shared/custom-text-field";
import FieldErrorText from "../../shared/field-error-text";

const FormValidationSchema = yup.object().shape({
    mobile: yup.string().required('Required *'),
    password: yup.string().required('Required *')
        .min(8, 'Must have at least 8 characters')
        .max(20, 'Can\'t be longer than 20 characters'),
});

export default function LoginScreen(props) {
    const [showPassword, setShowPassword] = useState(false)
    const [countryCode, setCountryCode] = useState('+92')
    const [mobileError, setMobileError] = useState('')
    const [generalError, setGeneralError] = useState('')

    async function login(values) {
        const phoneNumber = countryCode + values.mobile
        if (PhoneRegExp.pakPhoneRegExp.test(phoneNumber)) {
            setMobileError('')
            setGeneralError('')
            const url = MuhalikConfig.PATH + '/users/login';
            let data = {}
            data = {
                mobile: phoneNumber,
                password: values.password
            }
            await axios.post(url, data).then((res) => {
                if (res.status == '200') {
                    saveTokenToStorage(res.data.token);
                    props.reloadUser()
                    props.navigation.navigate('Root', { screen: 'Home' });
                }
            }).catch((err) => {
                try {
                    setGeneralError(err.response.data.message)
                } catch (er) {
                    setGeneralError('Login failed, check your number or password')
                }
            })
        } else {
            setMobileError('Enter valid number')
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Formik
                initialValues={{ mobile: "", password: "" }}
                validationSchema={FormValidationSchema}
                onSubmit={(values, actions) => login(values, actions)
                    .then(() => {
                    })
                    .catch(error => {
                        actions.setFieldError('general', error.message);
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
                    isSubmitting
                }) => {
                    return (
                        <ImageBackgroundContainer title='Signup'>
                            <MobileNumber
                                value={values.mobile}
                                onChangeText={handleChange("mobile")}
                                onBlur={handleBlur("mobile")}
                                error={mobileError}
                                countryCode={countryCode}
                                setCountryCode={(value) => setCountryCode(value)}
                            />
                            {mobileError !== '' && <FieldErrorText>{mobileError}</FieldErrorText>}
                            <CustomTextField
                                label={'Password'}
                                secureTextEntry={showPassword ? false : true}
                                value={values.password}
                                onChangeText={handleChange("password")}
                                textContentType='password'
                                error={touched.password && errors.password}
                                onBlur={handleBlur("password")}
                                left={<TextInput.Icon name='lock' color={Colors.primary_color} color={Colors.primary_color} />}
                                right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} color={Colors.primary_color} color={Colors.primary_color} onPress={() => setShowPassword(!showPassword)} />}
                            />
                            <View style={styles.forgot_password}>
                                <Text style={{ color: 'blue' }} onPress={() => props.navigation.navigate('Reset Password')} > {'Forgot Password?'} </Text>
                            </View>
                            {generalError !== '' && <FieldErrorText>{generalError}</FieldErrorText>}
                            <FullWidthCustomButton icon='login' onPress={handleSubmit} loading={isSubmitting}>
                                {'Login'}
                            </FullWidthCustomButton>
                            <View style={styles.forgot_password}>
                                <Text>{'Don\'t have an account? '}</Text>
                                <Text style={{ color: 'blue' }} onPress={() => props.navigation.navigate('Signup')} > {'Signup'} </Text>
                            </View>
                        </ImageBackgroundContainer>
                    );
                }}
            </Formik>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    welcome: {
        fontSize: 30,
        color: Colors.dark,
        marginBottom: 10,
        marginTop: -50,
        fontWeight: "700",
    },
    forgot_password: {
        marginVertical: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    signup: {
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});