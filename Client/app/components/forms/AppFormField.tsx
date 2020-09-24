import React, { Component } from 'react';
import { View } from 'react-native';
import { AppTextInput } from './AppTextInput';
import { ErrorMessage } from './ErrorMessage';
import { useFormikContext } from 'formik';

/**
 * 
 * @param  iconName: string 
 * @param  fieldName: string 
 * @param  InputParams 
 *   
 */

export function AppFormField({ ...props }: any) {
    const { setFieldTouched, handleChange, errors, touched } = useFormikContext();
    return (
        <View style={{ position: "relative" }}>
            <AppTextInput
                {...props}
                onBlur={() => setFieldTouched(props.fieldName)}
                onChangeText={handleChange(props.fieldName)} />
            <ErrorMessage visible={touched[props.fieldName]} error={errors[props.fieldName]} />
        </View>
    )
}
