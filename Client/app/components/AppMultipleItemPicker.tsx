import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../config/colors';
import { AppText } from './AppText';

interface AppMultipleItemPickerState {
    clickedItems: boolean[],
    pickedItems: any[]
}
export class AppMultipleItemPicker extends Component<{ addAsProficiency: boolean, resetList: boolean, listChange: any, list: any[], alreadyPickedItems: any[] }, AppMultipleItemPickerState>{
    constructor(props: any) {
        super(props)
        this.state = {
            clickedItems: [],
            pickedItems: [],
        }
    }

    pickItems = (item: string, index: number) => {
        if (!this.state.clickedItems[index]) {
            const pickedItems = this.state.pickedItems;
            const clickedItems = this.state.clickedItems;
            clickedItems[index] = true;
            this.props.addAsProficiency ? pickedItems.push([item, 0]) : pickedItems.push(item)
            this.setState({ clickedItems, pickedItems }, () => this.props.listChange(pickedItems));
        }
        else if (this.state.clickedItems[index]) {
            const oldPickedItems = this.state.pickedItems;
            const clickedItems = this.state.clickedItems;
            clickedItems[index] = false;
            const pickedItems = this.props.addAsProficiency ? oldPickedItems.filter(filteredItem => filteredItem[0] !== item) : oldPickedItems.filter(filteredItem => filteredItem !== item);
            this.setState({ clickedItems, pickedItems }, () => this.props.listChange(pickedItems));
        }
    }
    componentDidUpdate() {
        if (this.props.resetList === true && this.state.clickedItems.length !== 0) {
            this.setState({ clickedItems: [], pickedItems: [] })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {this.props.list.map((item, index) => <TouchableOpacity disabled={this.props.alreadyPickedItems[index]}
                        onPress={() => this.pickItems(item, index)}
                        style={[styles.item, { backgroundColor: this.props.alreadyPickedItems[index] ? Colors.earthYellow : this.state.clickedItems[index] ? Colors.bitterSweetRed : Colors.lightGray }]} key={index}>
                        <AppText>{item}</AppText>
                    </TouchableOpacity>)}
                </View>
            </View>
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