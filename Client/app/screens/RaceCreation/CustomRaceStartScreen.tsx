import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../config';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';



export class CustomRaceStartScreen extends Component<{ navigation: any }>{
    render() {
        return (
            <View style={styles.container}>
                <AppText textAlign={'center'} padding={10} fontSize={25}>Welcome to DnCreate's Race editor</AppText>
                <Image uri={`${Config.serverUrl}/assets/backgroundDragons/underConstructionDragon.png`} style={{ width: 200, height: 200 }} />
                <View style={{ padding: 20 }}>
                    <AppText textAlign={'center'} fontSize={18}>Using this tool you will be able to create you own races and share them with everyone on DnCreate!</AppText>
                    <AppText textAlign={'center'} fontSize={18}>It is recommended to get some understanding of how races work and how to make balanced races.</AppText>
                    <AppText textAlign={'center'} fontSize={18}>This feature is suggested for more veteran users.</AppText>
                </View>
                <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                    borderRadius={25} title={'Create!'} onPress={() => { this.props.navigation.navigate("BasicRaceInfo") }} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    }
});