import React, { Component } from 'react';
import { View, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { bool, boolean } from 'yup';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';

interface StandardStatArrayState {
    pointBank: number
    modalVisible: boolean
    pickedScore: number
    pickedCost: number
    pickedScoreArray: boolean[]
    disabledPicks: boolean[]
    scoreCostArray: any[]
}



export class StandardStatArray extends Component<{
    placedResult: any, onPress: any, onCancel: any, returnScore: any, resetReturnValues: any
    , resetPickedResult: any
}, StandardStatArrayState>{
    constructor(props: any) {
        super(props)
        this.state = {
            scoreCostArray: [],
            disabledPicks: [],
            pickedScore: -1,
            pickedCost: -1,
            pickedScoreArray: [],
            pointBank: 27,
            modalVisible: true,
        }
    }
    componentDidMount() {
        this.createPointList()
    }
    createPointList = () => {
        let scoreCostArray = this.state.scoreCostArray;
        let jsxArray: any = [];
        let costIndex: number = 0;
        let scoreIndex: number = 8;
        for (let item = 0; item < 8; item++) {
            if (costIndex === 8) {
                costIndex = 9
            }
            if (costIndex === 6) {
                costIndex = 7
            }
            scoreCostArray.push({ cost: costIndex, score: scoreIndex })
            costIndex++
            scoreIndex++
        }
        this.setState({ scoreCostArray })
    }

    componentDidUpdate(previousProps: any, previousState: any) {
        if (this.props.placedResult !== -1) {
            let pointBank = this.state.pointBank - this.state.pickedCost;
            this.setState({ pickedScore: -1, pickedCost: -1, pickedScoreArray: [], pointBank })
            this.props.resetPickedResult(-1)
        }

        if (this.props.returnScore !== -1) {
            for (let item of this.state.scoreCostArray) {
                if (item.score === this.props.returnScore) {
                    this.setState({ pointBank: this.state.pointBank + item.cost })
                }
            }
            this.props.resetReturnValues(-1)
            return
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ backgroundColor: Colors.pageBackground }}>
                    <AppText textAlign={'center'} fontSize={22}>Point Bank - {this.state.pointBank}</AppText>

                    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        {this.state.scoreCostArray.map((item: any, index: number) => {
                            return <TouchableOpacity
                                onPress={() => {
                                    let pickedScoreArray: any = [];
                                    if (this.state.pickedScoreArray[index]) {
                                        this.setState({ pickedScore: -1, pickedCost: -1, pickedScoreArray })
                                        this.props.onCancel(item.score)
                                        return
                                    }
                                    if (this.state.scoreCostArray[index].cost > this.state.pointBank) {
                                        alert('You have reach the limit of your point bank, you can retract spend points by clicking on them.');
                                        return;
                                    }
                                    pickedScoreArray[index] = true;
                                    this.setState({ pickedScore: item.score, pickedCost: this.state.scoreCostArray[index].cost, pickedScoreArray }, () => {
                                        this.props.onPress(item.score)
                                    })
                                }}
                                style={[{ backgroundColor: this.state.pickedScoreArray[index] ? Colors.bitterSweetRed : Colors.lightGray }, {
                                    margin: 10, borderWidth: 1, borderColor: Colors.whiteInDarkMode,
                                    padding: 5, borderRadius: 15
                                }]} key={index}>
                                <AppText textAlign={'center'}>Score - {item.score}</AppText>
                                <AppText textAlign={'center'}>Cost - {item.cost}</AppText>
                            </TouchableOpacity>
                        })}
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});