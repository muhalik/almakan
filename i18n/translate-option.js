import React from 'react';
import { FormattedMessage } from 'react-intl'
import { TextInput } from 'react-native-paper';
import Colors from '../constants/Colors';
// import { Picker } from '@react-native-picker/picker'
import { Picker } from 'react-native'


const TranslateOption = (props) => (
    <FormattedMessage id={props.id}>
        {msg =>
            <Picker.Item key={msg} label={msg} value={msg} />
        }
    </FormattedMessage>
)

export default TranslateOption
