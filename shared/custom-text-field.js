import React from 'react';
import { View } from 'react-native';
import { FormattedMessage } from 'react-intl'
import { TextInput } from 'react-native-paper';
import Colors from '../constants/Colors';
import FieldErrorText from './field-error-text';

const CustomTextField = (props) =>
    <View style={props.width == 'half' ? { width: '50%' } : { width: '100%' }}>
        <TextInput
            mode='outlined'
            style={{ marginVertical: 5, backgroundColor: 'white', borderRadius: 15 }}
            label={props.label}
            underlineColor={Colors.primary_color}
            theme={{ colors: { primary: Colors.primary_color } }}
            type={props.type}
            value={props.value}
            placeholder={props.placeholder}
            onChangeText={props.onChangeText}
            onBlur={props.onBlur}
            secureTextEntry={props.secureTextEntry}
            onKeyPress={props.onKeyPress}
            disabled={props.disabled}
            autoCompleteType={props.autoCompleteType}
            keyboardType={props.keyboardType}
            textContentType={props.textContentType}
            left={props.left}
            right={props.right}
            error={props.error}
            multiline={props.multiline}
            numberOfLines={props.numberOfLines}
        />
        {<FieldErrorText>
            {props.error}
        </FieldErrorText>}
    </View>

export default CustomTextField
