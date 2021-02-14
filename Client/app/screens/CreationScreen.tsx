import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import { Colors } from '../config/colors';

interface CreationScreenState {

}
export class CreationScreen extends Component<{ navigation: any }, CreationScreenState>{
    constructor(props: any) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: .5 }}>
                    <AppText padding={10} textAlign={'center'} fontSize={30}>Create your own custom race!</AppText>
                    <AppText padding={10} textAlign={'center'} fontSize={18}>You can now create and share your very own race!</AppText>
                    <AppText padding={10} textAlign={'center'} fontSize={18}>Just follow the steps and start using your very own race</AppText>
                    <AppButton title={'Custom Race'}
                        backgroundColor={Colors.bitterSweetRed}
                        width={150}
                        height={60}
                        borderRadius={15}
                        fontSize={20}
                        onPress={() => {
                            this.props.navigation.navigate("CustomRaceStartScreen")
                        }} />
                </View>
                <View style={{ flex: .5 }}>
                    <AppText padding={10} textAlign={'center'} fontSize={30}>Create your own custom Subclass!</AppText>
                    <AppText padding={10} textAlign={'center'} fontSize={18}>New in DnCreate!</AppText>
                    <AppText padding={10} textAlign={'center'} fontSize={18}>Just follow the steps and start using your very own Subclass</AppText>
                    <AppButton title={'Custom SubClass'}
                        backgroundColor={Colors.bitterSweetRed}
                        width={150}
                        height={60}
                        borderRadius={15}
                        fontSize={20}
                        onPress={() => {
                            this.props.navigation.navigate("CustomSubClassStart")
                        }} />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center"
    }
});