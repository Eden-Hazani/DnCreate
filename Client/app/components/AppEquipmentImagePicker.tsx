import React, { Component } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Config } from '../../config';
import { Colors } from '../config/colors';
import { AppButton } from './AppButton';
import { AppPickerItem } from './AppPickerItem';
import { AppText } from './AppText';
import { IconGen } from './IconGen';
import { Image } from 'react-native-expo-image-cache'
import { ScrollView } from 'react-native-gesture-handler';
interface AppEquipmentImagePickerState {
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


export class AppEquipmentImagePicker extends Component<{
    itemColor?: string, itemList: any, placeholder: any, iconName: any, selectItem: any,
    numColumns: number, selectedItem: any, selectedItemIcon: any, resetImgPick: any
}, AppEquipmentImagePickerState>{
    constructor(props: any) {
        super(props)
        this.state = {
            visible: false
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={[styles.innerContainer, { backgroundColor: Colors.lightGray }]} onPress={() => { this.setState({ visible: true }) }}>
                    <View style={[styles.textContainer, { backgroundColor: Colors.lightGray }]}>
                        {this.props.selectedItemIcon ?
                            <Image style={{ width: 50, height: 50 }} uri={`${Config.serverUrl}/assets/charEquipment/${this.props.selectedItemIcon}`} />
                            :
                            <IconGen size={25} backgroundColor={'none'} name={this.props.iconName} iconColor={Colors.whiteInDarkMode} />
                        }
                        <AppText flex={1}>{this.props.selectedItem ? null : this.props.placeholder}</AppText>
                        <IconGen size={25} backgroundColor={'none'} name={"chevron-down"} iconColor={Colors.whiteInDarkMode} />
                    </View>
                </TouchableOpacity>
                <Modal visible={this.state.visible} animationType="slide">
                    <View style={{ flex: .9, backgroundColor: Colors.pageBackground }}>
                        <FlatList
                            data={this.props.itemList}
                            numColumns={3}
                            contentContainerStyle={{
                                alignSelf: 'flex-start',
                            }}
                            keyExtractor={img => img.toString()}
                            renderItem={({ item }) => <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => {
                                this.props.selectItem(item)
                                this.setState({ visible: false })
                            }}>
                                <Image style={{ width: 100, height: 100, borderRadius: 25, borderWidth: 1, borderColor: Colors.whiteInDarkMode, margin: 5 }} uri={`${Config.serverUrl}/assets/charEquipment/${item}`} />
                            </TouchableOpacity>} />
                    </View>
                    <View style={{ flex: .1, backgroundColor: Colors.pageBackground }}>
                        <AppButton backgroundColor={Colors.bitterSweetRed} width={100} fontSize={20} height={50} borderRadius={25} title={"close"}
                            onPress={() => {
                                this.props.resetImgPick("");
                                this.setState({ visible: false })
                            }} />
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
        flexDirection: "row",
        textAlignVertical: "center"
    },
    textContainer: {
        flex: 1,
        padding: 10,
        borderRadius: 25,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});