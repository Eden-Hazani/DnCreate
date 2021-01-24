import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import skillJson from '../../../../jsonDump/skillList.json';
import toolJson from '../../../../jsonDump/toolList.json';

interface PickSingleItemState {
    itemList: any[]
    amountToPick: number,
    itemClicked: boolean[],
    itemPicked: any[],
}

export class PickSingleItem extends Component<{ amountToPick: number, itemList: any[], onPick: any }, PickSingleItemState>{
    constructor(props: any) {
        super(props)
        this.state = {
            itemClicked: [],
            itemPicked: [],
            itemList: this.props.itemList,
            amountToPick: this.props.amountToPick
        }
    }

    componentDidMount() {
        if (this.state.itemList[0] === "allSkillsAvailable") {
            const itemList = skillJson.skillList;
            this.setState({ itemList })
        }
        if (this.state.itemList[0] === "allToolsAvailable") {
            const itemList = toolJson.tools;
            this.setState({ itemList })
        }
    }

    pickItem = (item: any, index: number) => {
        if (!this.state.itemClicked[index]) {
            if (this.state.amountToPick === this.state.itemPicked.length) {
                alert(`You can only pick ${this.state.amountToPick}`)
                return
            }
            const itemPicked = this.state.itemPicked;
            const itemClicked = this.state.itemClicked;
            itemClicked[index] = true;
            itemPicked.push(item)
            this.setState({ itemClicked, itemPicked }, () => {
                this.props.onPick(itemPicked)
            });
        }
        else if (this.state.itemClicked[index]) {
            const oldPickedItems = this.state.itemPicked;
            const itemClicked = this.state.itemClicked;
            itemClicked[index] = false;
            // if (this.state.character.race === "Changeling") {
            //     const itemPicked = oldPickedItems.filter(skill => skill[0] !== item[0]);
            //     this.setState({ itemClicked, itemPicked });
            //     return
            // }
            const itemPicked = oldPickedItems.filter(item => item.name !== item.name);
            this.setState({ itemClicked, itemPicked }, () => {
                this.props.onPick(itemPicked)
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.itemList.map((item, index) =>
                    <TouchableOpacity key={index} style={[styles.item, { backgroundColor: this.state.itemClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                        onPress={() => this.pickItem(item, index)}>
                        <AppText textAlign={'center'} fontSize={18}>{item}</AppText>
                    </TouchableOpacity>)}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    item: {
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 5,
        borderWidth: 1,
        borderRadius: 25
    },
});