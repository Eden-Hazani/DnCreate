import React, { Component } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import colors from '../config/colors';
import { AppButton } from './AppButton';
import { AppPickerItem } from './AppPickerItem';
import { AppText } from './AppText';
import { IconGen } from './IconGen';

interface AppPickerState {
    visible: boolean
}


/**
 * 
 * @param  placeholder: string 
 * @param  itemList: string 
 * @param  iconName: string 
 * @param  selectItem: function 
 * @param  numColumns: number 
 * @param  selectedItem: string 
 *   
 */


export class AppPicker extends Component<{ itemList: any, placeholder: any, iconName: any, selectItem: any, numColumns: number, selectedItem: any, selectedItemIcon: any }, AppPickerState>{
    constructor(props: any) {
        super(props)
        this.state = {
            visible: false
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.innerContainer} onPress={() => { this.setState({ visible: true }) }}>
                    <View style={styles.textContainer}>
                        <IconGen size={25} backgroundColor={'none'} name={this.props.selectedItemIcon ? this.props.selectedItemIcon : this.props.iconName} iconColor={colors.black} />
                        <AppText flex={1}>{this.props.selectedItem ? this.props.selectedItem : this.props.placeholder}</AppText>
                        <IconGen size={25} backgroundColor={'none'} name={"chevron-down"} iconColor={colors.black} />
                    </View>
                </TouchableOpacity>
                <Modal visible={this.state.visible} animationType="slide">
                    <View style={{ flex: .9 }}>
                        <FlatList
                            data={this.props.itemList}
                            keyExtractor={races => races._id.toString()}
                            numColumns={this.props.numColumns}
                            renderItem={({ item }) => <AppPickerItem
                                iconBackgroundColor={item.backgroundColor}
                                text={item.name}
                                iconName={item.icon}
                                padding={80} width={100} height={100}
                                direction={'column'} onPress={() => {
                                    this.setState({ visible: false });
                                    this.props.selectItem(item);
                                }} />} />
                    </View>
                    <View style={{ flex: .1 }}>
                        <AppButton backgroundColor={colors.bitterSweetRed} width={100} fontSize={20} height={40} title={"close"} onPress={() => { this.setState({ visible: false }) }} />
                    </View>
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 25,
        justifyContent: "center",
        flexDirection: "row",
    },
    innerContainer: {
        flex: .7,
        padding: 10,
        borderRadius: 25,
        backgroundColor: colors.lightGray,
        flexDirection: "row",
        textAlignVertical: "center"
    },
    textContainer: {
        flex: 1,
        padding: 10,
        borderRadius: 25,
        backgroundColor: colors.lightGray,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});