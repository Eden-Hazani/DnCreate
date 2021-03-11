import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CharacterModel } from '../../models/characterModel';
import skillsJson from '../../../jsonDump/skillList.json';
import { Colors } from '../../config/colors';
import { AppText } from '../../components/AppText';
import { AppButton } from '../../components/AppButton';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import userCharApi from '../../api/userCharApi';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../config';
import * as toolList from '../../../jsonDump/toolList.json'


interface ReplaceProficienciesState {
    character: CharacterModel
    pickedItems: any[],
    expertiseItems: boolean[],
    clickedItems: boolean[],
    baseItemList: any[]
}
export class ReplaceProficiencies extends Component<{ navigation: any, route: any }, ReplaceProficienciesState>{
    constructor(props: any) {
        super(props)
        this.state = {
            character: this.props.route.params.char,
            pickedItems: [],
            clickedItems: [],
            expertiseItems: [],
            baseItemList: this.props.route.params.profType === 'skills' ? [...skillsJson.skillList] : [...toolList.tools]
        }
    }
    componentDidMount() {
        const pickedItems = [...this.state.pickedItems];
        const clickedItems = [...this.state.clickedItems];
        const expertiseItems = [...this.state.expertiseItems];
        const baseList = [...this.state.baseItemList]
        for (let item of this.state.character[this.props.route.params.profType]) {
            if (baseList.includes(item[0])) {
                let index = baseList.indexOf(item[0]);
                if (item[1] === 2) {
                    pickedItems.push(item)
                    expertiseItems[index] = true;
                } else {
                    pickedItems.push(item)
                    clickedItems[index] = true;
                }
            }
        }
        this.setState({ pickedItems, clickedItems, expertiseItems })
    }


    clickItem = (item: string, index: number) => {
        if (this.state.expertiseItems[index]) {
            alert('This skill is on expertise level, to remove it press and hold on the skill');
            return
        }
        if (this.state.clickedItems[index]) {
            const oldPickedItems = [...this.state.pickedItems];
            const clickedItems = [...this.state.clickedItems];
            clickedItems[index] = false;
            const pickedItems = oldPickedItems.filter(currentItem => currentItem[0] !== item);
            this.setState({ clickedItems, pickedItems });
        }
        else if (!this.state.clickedItems[index]) {
            const pickedItems = [...this.state.pickedItems];
            const clickedItems = [...this.state.clickedItems];
            clickedItems[index] = true;
            pickedItems.push([item, 0])
            this.setState({ clickedItems, pickedItems });
        }
    }

    longClickItem = (item: string, index: number) => {
        if (this.state.clickedItems[index]) {
            alert('This skill is a regular proficiency, to remove it shortly tap on the skill');
            return
        }
        if (this.state.expertiseItems[index]) {
            const oldPickedItems = [...this.state.pickedItems];
            const expertiseItems = [...this.state.expertiseItems];
            expertiseItems[index] = false;
            const pickedItems = oldPickedItems.filter(currentItem => currentItem[0] !== item);
            this.setState({ expertiseItems, pickedItems });
        }
        else if (!this.state.expertiseItems[index]) {
            const pickedItems = [...this.state.pickedItems];
            const expertiseItems = [...this.state.expertiseItems];
            expertiseItems[index] = true;
            pickedItems.push([item, 2])
            this.setState({ expertiseItems, pickedItems });
        }
    }

    confirm = () => {
        const character = { ...this.state.character };
        character[this.props.route.params.profType] = this.state.pickedItems;
        this.setState({ character }, async () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
            await userCharApi.updateChar(this.state.character);
            this.props.navigation.goBack()
        })
    }

    cancel = () => {

    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Image uri={`${Config.serverUrl}/assets/specificDragons/changeDragon.png`} style={{ height: 150, width: 150 }} />
                    <AppText textAlign={'center'} fontSize={18} padding={10}>Press on skills to acquire or remove them from your character.</AppText>
                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly", width: '100%' }}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <AppText>Proficient Skills</AppText>
                            <View style={{ width: 25, height: 25, borderRadius: 25, backgroundColor: Colors.bitterSweetRed }}></View>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <AppText>Expertise Skills</AppText>
                            <View style={{ width: 25, height: 25, borderRadius: 25, backgroundColor: Colors.earthYellow }}></View>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {this.state.baseItemList.map((item: any, index: number) => {
                        return <TouchableOpacity onLongPress={() => this.longClickItem(item, index)}
                            onPress={() => this.clickItem(item, index)} key={index} style={[{
                                backgroundColor: this.state.expertiseItems[index] ?
                                    Colors.earthYellow : this.state.clickedItems[index] ? Colors.bitterSweetRed : Colors.lightGray
                            }, styles.item]}>
                            <AppText>{item}</AppText>
                        </TouchableOpacity>
                    })}
                </View>
                <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => this.confirm()}
                    fontSize={15} borderRadius={100} width={120} height={120} title={"Confirm"} />
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    }
});