import React, { Component } from 'react';
import { ImageInput } from '../ImageInput';
import { ErrorMessage } from './ErrorMessage';
import { useFormikContext } from 'formik'

export function FormImagePicker({ name }: any) {
    const { setFieldValue, errors, values, touched } = useFormikContext<any>();
    const handleChangeImage = (uri: string) => {
        setFieldValue(name, uri)
    }
    return (
        <>
            <ImageInput
                imageUri={values[name]}
                onChangeImage={(uri: any) => handleChangeImage(uri)} />
            <ErrorMessage visible={touched[name]} error={errors[name]} />
        </>
    )
}


