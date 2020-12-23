import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, Alert } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from "../../sdk/firebaseConfigration";

import axios from 'axios'
import AlMakanConfig from '../../sdk/almakan.config'

import CustomTextField from '../../shared/custom-text-field'
import Colors from '../../constants/Colors'

import { Formik } from "formik";
import * as yup from "yup";
import { Checkbox, TextInput } from "react-native-paper";
import FullWidthCustomButton from "../../shared/full-width-custom-button";
import FieldErrorText from '../../shared/field-error-text'
import ToastModal from '../../components/ToastModal'
import { useEffect } from "react";
import ImageBackgroundContainer from "../../components/ImageBackgroundContainer";
import MobileNumber from "../../components/MobileNumber";
import PhoneRegExp from '../../constants/PhoneRegix'

const schema = yup.object({
    mobile: yup.string().required('Required *'),

    full_name: yup.string().required('Required *')
        .min(5, 'Must have at least 5 characters')
        .max(25, 'Can\'t be longer than 25 characters'),

    email: yup.string().email('Must be a valid email address')
        .max(100, 'Can\'t be longer than 100 characters'),

    password: yup.string().required('Required *')
        .min(8, 'Password must have at least 8 characters')
        .max(20, 'Can\'t be longer than 20 characters'),

    confirm_password: yup.string().required('Required *').when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            'Passwords must match'
        )
    }),

    address: yup.string().required('Enter Address')
        .min(3, 'Must have at least 3 characters')
        .max(100, 'Can\'t be longer than 100 characters'),

    role: yup.string(),
});

export default function SellerSignupScreen(props) {
    const recaptchaVerifier = useRef(null);
    const [verificationId, setVerificationId] = useState();
    const [verificationCode, setVerificationCode] = useState();
    const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
    const [showPassword, setShowPassword] = useState(false)
    const [mobileError, setMobileError] = useState('')
    const [verificationCodeError, setVerificationCodeError] = useState('')
    const [feedback, setFeedback] = useState('')
    const [isCodeSended, setIsCodeSended] = useState(false)
    const [isCodeVerified, setIsCodeVerified] = useState(false)
    const [sendCodeLoading, setSendCodeLoading] = useState(false)
    const [verifyCodeLoading, setVerifyCodeLoading] = useState(false)
    const [intervalTime, setIntervalTime] = useState(60)
    const [isResendCode, setIsResendCode] = useState(false)
    const [countryCode, setCountryCode] = useState('+92')
    const [isNext, setIsNext] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [showToastModal, setShowToastModal] = useState(false)
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (props.user.full_name != '') {
            props.navigation.navigate('Root', { screen: 'Home' })
        }
        return () => {
        }
    }, [])

    async function handleSenVerificationCode(mobileNumber) {
        const phoneNumber = countryCode + mobileNumber
        if (PhoneRegExp.pakPhoneRegExp.test(phoneNumber)) {
            setMobileError('')
            setSendCodeLoading(true)
            const url = AlMakanConfig.PATH + `/users/check-mobile/${phoneNumber}`;
            await axios.get(url).then((response) => {
                setMobileError('This number already exists')
                setFeedback('')
                setIsCodeSended(false)
                setSendCodeLoading(false)
            }).catch((error) => {
                rechaptaVerifier(phoneNumber)
            })
        } else {
            setIsCodeSended(false)
            setMobileError('Enter valid number')
            setFeedback('')
            setIsCodeVerified(false)
        }
    }

    async function rechaptaVerifier(mobileNumber) {
        try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                mobileNumber,
                recaptchaVerifier.current
            );
            setVerificationId(verificationId)
            setIsCodeSended(true)
            setMobileError('')
            setFeedback('Code Sended, Check your number')
            setSendCodeLoading(false)
            let time = 60
            let interval = setInterval(() => {
                time = time - 1
                setIntervalTime(time)
                if (time == 0) {
                    setIsResendCode(true)
                    clearInterval(interval)
                }
            }, 1000);
        } catch (err) {
            console.log('error:', err)
            setIsCodeSended(true)
            setIsCodeVerified(true)
            setMobileError('')
            setSendCodeLoading(false)
            setFeedback('Number Verified')
            setVerificationCodeError('')
            setIsResendCode(false)
        }
    }

    async function handleVerifyVarificationCode() {
        setVerifyCodeLoading(true)
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
            );
            await firebase.auth().signInWithCredential(credential);
            setVerifyCodeLoading(false)
            setIsCodeVerified(true)
            setFeedback('Number Verified')
            setVerificationCodeError('')
            setIsResendCode(false)
        } catch (err) {
            console.log('code varification error: ', err)
            setVerifyCodeLoading(false)
            setFeedback('')
            setVerificationCodeError('Invalid Code, Try again')
        }
    }

    async function userRegister(values, actions) {
        let data = values
        data.mobile = countryCode + values.mobile

        setIsLoading(true)
        const url = AlMakanConfig.PATH + '/users/register';
        if (isCodeVerified && isCodeSended) {
            await axios.post(url, data).then((res) => {
                setIsLoading(false)
                Alert.alert('Success', 'Your Account Created Successfully')
                props.navigation.navigate('Login')
            }).catch((error) => {
                setIsLoading(false)
                try {
                    actions.setFieldError('general', error.response.data.message)
                } catch (er) {
                    alert('Error')
                    actions.setFieldError('general', 'Error')
                }
                Alert.alert('Error', 'Account Creation Failed')
            })
        } else {
            Alert.alert('Error', 'Please verify your number first')
        }
    }


    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Formik
                    initialValues={{
                        mobile: '', full_name: '', email: '', password: '', confirm_password: '',
                        role: 'customer', address: '',
                    }}
                    validationSchema={schema}
                    onSubmit={(values, actions) => userRegister(values, actions)}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        touched,
                        errors,
                        setFieldValue,
                        handleBlur,
                    }) => {
                        return (
                            <ImageBackgroundContainer title='Signup'>
                                {showToastModal &&
                                    <ToastModal
                                        show={showToastModal}
                                        onHide={() => setShowToastModal(false)}
                                        message={'Your account created successfully'}
                                    />
                                }
                                {!isNext ?
                                    <>
                                        <FirebaseRecaptchaVerifierModal
                                            ref={recaptchaVerifier}
                                            firebaseConfig={firebaseConfig}
                                        />
                                        <MobileNumber
                                            value={values.mobile}
                                            onChangeText={handleChange("mobile")}
                                            onBlur={handleBlur("mobile")}
                                            countryCode={countryCode}
                                            disabled={isCodeSended}
                                            setCountryCode={(value) => setCountryCode(value)}
                                            error={mobileError}
                                        />
                                        {mobileError !== '' && <FieldErrorText>{mobileError}</FieldErrorText>}
                                        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 5 }}>
                                            {isCodeSended && <>
                                                <Text style={{ color: 'green', marginRight: 'auto' }}>
                                                    {feedback}
                                                </Text>
                                                <Text style={{ color: 'blue', marginLeft: 'auto', marginBottom: 7 }}
                                                    onPress={() => {
                                                        setIsCodeSended(false)
                                                        setIsCodeVerified(false)
                                                        setFeedback('')
                                                        setMobileError('')
                                                        setVerificationCodeError('')
                                                    }}
                                                >
                                                    {'Change Number'}
                                                </Text>
                                            </>
                                            }
                                        </View>

                                        {!isCodeVerified && <FullWidthCustomButton icon='send' onPress={() => handleSenVerificationCode(values.mobile)} loading={sendCodeLoading}
                                            disabled={isCodeVerified ? true : isCodeSended ? isResendCode ? false : true : false || sendCodeLoading}>
                                            {isCodeSended ? 'Resend' : 'Send Code'}
                                            {!isCodeVerified && isCodeSended && !isResendCode ? '  00 : ' + intervalTime : null}
                                        </FullWidthCustomButton>}

                                        {isCodeSended && <>
                                            <CustomTextField
                                                label={'Verification code'}
                                                value={verificationCode}
                                                onChangeText={setVerificationCode}
                                                keyboardType="phone-pad"
                                                error={verificationCodeError}
                                                disabled={!isCodeSended || isCodeVerified}
                                                left={<TextInput.Icon name='key' color={Colors.primary_color} color={Colors.primary_color} onPress={() => setShowPassword(!showPassword)} />}
                                            />
                                            <FullWidthCustomButton icon={isCodeVerified && 'check'} onPress={handleVerifyVarificationCode} loading={verifyCodeLoading} disabled={!verificationCode || isCodeVerified}>
                                                {isCodeVerified ? 'Verified' : 'Verify'}
                                            </FullWidthCustomButton>
                                        </>
                                        }
                                        {isCodeVerified && <>
                                            <FullWidthCustomButton icon='page-next-outline' onPress={() => setIsNext(true)}>
                                                {'Next'}
                                            </FullWidthCustomButton>
                                        </>
                                        }
                                    </>
                                    :
                                    <>
                                        <CustomTextField
                                            label={'Full name'}
                                            value={values.full_name}
                                            onChangeText={handleChange("full_name")}
                                            onBlur={handleBlur("full_name")}
                                            error={touched.full_name && errors.full_name}
                                        />

                                        <CustomTextField
                                            label={'Address'}
                                            value={values.address}
                                            onChangeText={handleChange("address")}
                                            onBlur={handleBlur("address")}
                                            error={touched.address && errors.address}
                                        />

                                        <CustomTextField
                                            label={'Email address'}
                                            value={values.email}
                                            onChangeText={handleChange("email")}
                                            onBlur={handleBlur("email")}
                                            keyboardType='email-address'
                                            textContentType='emailAddress'
                                            error={touched.email && errors.email}
                                        />
                                        <CustomTextField
                                            label={'Password'}
                                            secureTextEntry={showPassword ? false : true}
                                            value={values.password}
                                            onChangeText={handleChange("password")}
                                            onBlur={handleBlur("password")}
                                            textContentType='password'
                                            error={touched.password && errors.password}
                                            right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} color={Colors.primary_color} color={Colors.primary_color} onPress={() => setShowPassword(!showPassword)} />}
                                        />

                                        <CustomTextField
                                            label={'Conform password'}
                                            secureTextEntry={showPassword ? false : true}
                                            value={values.confirm_password}
                                            onChangeText={handleChange("confirm_password")}
                                            onBlur={handleBlur("confirm_password")}
                                            textContentType='password'
                                            error={touched.confirm_password && errors.confirm_password}
                                            right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} color={Colors.primary_color} onPress={() => setShowPassword(!showPassword)} />}
                                        />

                                        <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
                                            <Text>Signup as Seller</Text>
                                            <Checkbox
                                                status={checked ? 'checked' : 'unchecked'}
                                                onPress={() => checked ? setFieldValue('role', 'customer') : setFieldValue('role', 'vendor'), () => setChecked(!checked)}
                                            />
                                        </View>
                                        <View style={{ alignItems: "center", flexDirection: 'column', marginVertical: 5 }}>
                                            <Text >
                                                {'By creating account, you agree to AlMakan\'s'}
                                            </Text>
                                            <View style={{ alignItems: "center", flexDirection: 'row' }}>
                                                <Text style={{ color: 'blue' }} onPress={() => props.navigation.navigate('Terms & Conditions')} > {'Terms & Conditions'} </Text>
                                                <Text> {'and'} </Text>
                                                <Text style={{ color: 'blue' }} onPress={() => props.navigation.navigate('Privacy Statement')} > {'Privacy Statement'} </Text>
                                            </View>
                                        </View>
                                        <View style={{ justifyContent: "center", flexDirection: 'row', margin: 5 }}>
                                            <Text >
                                                {'Already have an account...'}
                                            </Text>
                                            <Text style={{ color: 'blue' }} onPress={() => props.navigation.navigate('Login')} > {'Login'} </Text>
                                        </View>
                                        <View>
                                            <FieldErrorText>
                                                {errors.general}
                                            </FieldErrorText>
                                        </View>
                                        <FullWidthCustomButton icon='keyboard-return' onPress={() => setIsNext(false)}>
                                            {'Back'}
                                        </FullWidthCustomButton>
                                        <FullWidthCustomButton icon='account-plus-outline' onPress={handleSubmit} disabled={isLoading || !isCodeVerified} loading={isLoading}>
                                            {isLoading ? 'Signup..' : 'Signup'}
                                        </FullWidthCustomButton>
                                    </>
                                }
                            </ImageBackgroundContainer>
                        )
                    }}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
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
    picker_view: {
        width: '100%',
        alignItems: "center",
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    picker: {
        width: '100%',
        marginTop: 2.5,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary_color,
        height: 50,
        borderColor: Colors.primary_text_color,
        backgroundColor: Colors.primary_text_color,
    },
})