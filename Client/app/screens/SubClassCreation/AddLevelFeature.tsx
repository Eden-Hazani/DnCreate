import React, { Component } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { SubClassModal } from '../../models/SubClassModal';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface AddLevelFeatureState {
    customSubclass: SubClassModal
    loading: boolean
}
export class AddLevelFeature extends Component<{ navigation: any, route: any }, AddLevelFeatureState>{
    public navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            loading: false,
            customSubclass: store.getState().customSubClass,
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    onFocus = () => {
        this.setState({ customSubclass: store.getState().customSubClass })
    }


    addFeature = () => {
        const customSubclass = { ...store.getState().customSubClass };
        if (customSubclass.levelUpChart) {
            let length = Object.keys(customSubclass.levelUpChart[this.props.route.params.currentLevel]).length
            customSubclass.levelUpChart[this.props.route.params.currentLevel][length + 1] = {}
        }
        this.setState({ customSubclass }, () => store.dispatch({ type: ActionType.UpdateSubclass, payload: this.state.customSubclass }))
    }
    removeFeature = (index: number) => {
        const customSubclass = { ...store.getState().customSubClass };
        if (customSubclass.levelUpChart) {
            delete customSubclass.levelUpChart[this.props.route.params.currentLevel][index]
        }
        this.setState({ customSubclass }, () => store.dispatch({ type: ActionType.UpdateSubclass, payload: this.state.customSubclass }))
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <AppText>Here you add a feature the character will receive on reaching the level you picked</AppText>

                <AppButton fontSize={20} title={'Add Feature'} onPress={() => this.addFeature()}
                    borderRadius={10}
                    backgroundColor={Colors.bitterSweetRed} width={120} height={45} />
                <View style={{ alignItems: "center" }}>
                    {this.state.customSubclass.levelUpChart &&
                        Object.entries(this.state.customSubclass.levelUpChart[this.props.route.params.currentLevel]).map((item, index) => {
                            return <View key={index} style={[styles.item, { borderColor: Colors.whiteInDarkMode }]}>
                                <AppText fontSize={25}>Feature {item[0]}</AppText>
                                <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                                    <AppButton fontSize={20} title={'Remove Feature'} onPress={() => this.removeFeature(index + 1)}
                                        borderRadius={10}
                                        backgroundColor={Colors.bitterSweetRed} width={120} height={45} />
                                    <AppButton fontSize={20} title={'Edit Feature'} onPress={() =>
                                        this.props.navigation.navigate("EditSubClassFeature", { isFirstLevel: index === 0 ? true : false, featureLevel: this.props.route.params.currentLevel, featureNumber: index + 1, featureInfo: this.state.customSubclass.levelUpChart && this.state.customSubclass.levelUpChart[this.props.route.params.currentLevel][index + 1] })}
                                        borderRadius={10}
                                        backgroundColor={Colors.metallicBlue} width={120} height={45} />
                                </View>
                            </View>
                        })}
                </View>
                <AppButton padding={10} fontSize={20} title={'Ok'} onPress={() => {
                    this.props.navigation.goBack()
                }}
                    borderRadius={10}
                    backgroundColor={Colors.bitterSweetRed} width={120} height={45} />

            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {

        borderWidth: 1,
        borderRadius: 25,
        padding: 25,
        width: '90%'

    }
});