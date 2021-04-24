import React, { Component, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import authApi from '../../../api/authApi';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { AppTextInput } from '../../../components/forms/AppTextInput';
import { Colors } from '../../../config/colors';
import useAuthContext from '../../../hooks/useAuthContext';

export function CreateMarketPlaceAlias() {
    const userContext = useAuthContext()

    const [currentAlias, setCurrentAlias] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const createAlias = async () => {
        try {
            if (currentAlias === '') {
                setError('Alias cannot be empty')
                return;
            }
            setLoading(true)
            const response = await authApi.inputAlias(currentAlias, userContext.user?._id || '');
            setCurrentAlias('')
            userContext.updateUser(response.data);
            setLoading(false)
        } catch (err) {
            setLoading(false)
            setError('This Alias already exists')
        }
    }
    return (
        <View style={styles.container}>
            <AppText textAlign={'center'} fontSize={17}>If you wish to start uploading things to the market you first need to pick an alias for yourself, this alias will be shown in the marketplace under the things you create</AppText>
            <View>
                {loading ? <AppActivityIndicator visible={loading} /> :
                    <View>
                        <AppTextInput placeholder={'Enter Alias...'}
                            value={currentAlias}
                            onChangeText={(txt: string) => {
                                setError('')
                                setCurrentAlias(txt)
                            }}
                        />
                        {error !== '' && <AppText paddingBottom={10} textAlign={'center'} color={Colors.danger}>{error}</AppText>}
                        <AppButton width={100} borderRadius={15} height={60} backgroundColor={Colors.bitterSweetRed} title={'Confirm'} onPress={() => createAlias()} />
                    </View>
                }
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});