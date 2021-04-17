import React, { Component, useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import validateOwnership from '../../../utility/marketFunctions/validateOwnership';
import AuthContext from '../../auth/context';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import getColorStatus from '../../screens/MarketPlace/functions/getColorStatus';
import { AppButton } from '../AppButton';
import { AppText } from '../AppText';
import { IconGen } from '../IconGen';
import { AddCharToMarket } from './AddCharToMarket';
import { RemoveCharFromMarket } from './RemoveCharFromMarket';
import { UpperCharacterMarketInfo } from './UpperCharacterMarketInfo';

interface Props {
    character: CharacterModel
    index: number
}

export function CharacterMarketInfo({ character, index }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const userContext = useContext(AuthContext);

    const handleClick = () => {
        setIsOpen(prevState => !prevState)
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => handleClick()}>
                <IconGen name={'shopping-outline'} size={70}
                    borderWidth={2}
                    borderColor={Colors.whiteInDarkMode}
                    iconColor={Colors.bitterSweetRed}
                    backgroundColor={getColorStatus(character.marketStatus, userContext.user?._id || '')} />
            </TouchableOpacity>
            <Modal visible={isOpen} animationType="slide">
                <View style={{ backgroundColor: Colors.pageBackground, flex: 1 }}>
                    {validateOwnership(userContext.user?._id || '', character.marketStatus) ?
                        <ScrollView>
                            <UpperCharacterMarketInfo
                                image={character.image || ''}
                                isInMarket={character.marketStatus?.isInMarket}
                                name={character.name || ''} />
                            <View style={{ paddingTop: 15, paddingBottom: 15 }}>
                                {character.marketStatus?.isInMarket ? <RemoveCharFromMarket index={index} character={character} marketplace_id={character.marketStatus.market_id} /> : <AddCharToMarket index={index} character={character} />}
                            </View>

                            <AppButton title={'Close'} width={150} height={60} borderRadius={15} backgroundColor={Colors.bitterSweetRed}
                                onPress={() => handleClick()} />
                        </ScrollView>
                        :
                        <View>
                            <AppText fontSize={25} textAlign={'center'} padding={20}>You have no ownership over this character.</AppText>
                            <AppText fontSize={25} textAlign={'center'} padding={20}>This character was created by another user, you cannot re-upload other user's creations.</AppText>
                            <AppButton title={'Close'} width={150} height={60} borderRadius={15} backgroundColor={Colors.bitterSweetRed}
                                onPress={() => handleClick()} />
                        </View>
                    }
                </View>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});