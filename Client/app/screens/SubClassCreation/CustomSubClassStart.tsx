import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { ScrollView } from 'react-native-gesture-handler';
import { Config } from '../../../config';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';

interface CustomSubClassStartState {

}
export class CustomSubClassStart extends Component<{ navigation: any }, CustomSubClassStartState>{
    constructor(props: any) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <AppText fontSize={30} textAlign={'center'}>Welcome To The Subclass Creator!</AppText>
                    <Image uri={`${Config.serverUrl}/assets/backgroundDragons/underConstructionDragon.png`} style={{ height: 250, width: 250 }} />
                    <AppText padding={5} fontSize={17} textAlign={'center'}>Through this creator you will be able to build and share your very own subclasses with the rest of DnCreate</AppText>
                    <AppText padding={5} fontSize={17} textAlign={'center'}>This creator is more complex then the race creator and is recommended to veteran players only.</AppText>
                    <AppText padding={5} fontSize={17} textAlign={'center'}>Thank you for using DnCreate!</AppText>
                    <AppButton title={'Start Creating!'}
                        backgroundColor={Colors.bitterSweetRed}
                        width={150}
                        height={60}
                        borderRadius={15}
                        fontSize={20}
                        onPress={() => {
                            this.props.navigation.navigate("CreateSubClass")
                        }} />
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    }
});