import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import { AppText } from './AppText';
import { IconGen } from './IconGen';

/**
 * 
 * @param  iconBackgroundColor: string 
 * @param  iconName: string 
 * @param  text: string 
 *   
 */



export class AppPickerItem extends Component<any>{
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={{ width: "35%" }}>
                <View style={styles.container}>
                    <IconGen size={70} backgroundColor={this.props.iconBackgroundColor} name={this.props.iconName} iconColor={colors.white} />
                    <View style={{ marginTop: 10 }}>
                        <AppText textAlign={"center"}>{this.props.text}</AppText>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        paddingHorizontal: 15,
        paddingVertical: 30,
        justifyContent: "space-around"
    }
});