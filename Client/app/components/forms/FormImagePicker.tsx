import React, { Component, useEffect } from 'react';
import { ImageInput } from '../ImageInput';
import { ErrorMessage } from './ErrorMessage';
import { useFormikContext } from 'formik'
import { View } from 'react-native';

export function FormImagePicker({ name, idDisabled, removeCurrentPicture }: any) {
    useEffect(() => {
        handleChangeImage(null)
    }, [removeCurrentPicture])
    const { setFieldValue, errors, values, touched } = useFormikContext<any>();
    const handleChangeImage = (uri: any) => {
        setFieldValue(name, uri)
    }
    return (
        <>
            <ImageInput
                idDisabled={idDisabled}
                imageUri={values[name]}
                onChangeImage={(uri: any) => handleChangeImage(uri)} />
            <View style={{ width: 400, top: -70 }}>
                <ErrorMessage returnInfo={() => { }} visible={touched[name]} error={errors[name]} errorPosition={''} />
            </View>
        </>
    )
}


