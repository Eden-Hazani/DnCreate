import React, { Component } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { Colors } from '../config/colors';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

interface UniqueRollListsState {
    openModal: boolean
}

export class UniqueRollLists extends Component<{ modalContacts: any, title: any }, UniqueRollListsState>{
    constructor(props: any) {
        super(props)
        this.state = {
            openModal: false
        }
    }
    render() {
        return (
            <View>
                <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={`${this.props.title}`}
                    onPress={() => { this.setState({ openModal: true }) }} />
                <Modal visible={this.state.openModal} animationType='slide'>
                    {this.state.openModal &&
                        <ScrollView style={{ padding: 20, backgroundColor: Colors.pageBackground }}>
                            <AppText color={Colors.berries} textAlign={'center'} fontSize={18}>List of {this.props.title}, roll result and effect</AppText>
                            {this.props.modalContacts.map((item: any, index: number) =>
                                <View key={index}>
                                    <AppText fontSize={20} textAlign={'center'} color={Colors.berries}>{item.roll}</AppText>
                                    <View style={{ padding: 10, backgroundColor: Colors.pinkishSilver, borderWidth: 1, borderColor: Colors.berries, borderRadius: 25 }}>
                                        <AppText fontSize={16} textAlign={'center'}>{item.effect}</AppText>
                                    </View>
                                </View>)}
                            <View style={{ padding: 25 }}>
                                <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={'Close'}
                                    onPress={() => { this.setState({ openModal: false }) }} />
                            </View>
                        </ScrollView>
                    }
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});