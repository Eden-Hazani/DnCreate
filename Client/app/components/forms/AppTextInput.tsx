import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { IconGen } from '../IconGen';
import colors from '../../config/colors';
import * as Font from 'expo-font';


/**
 * 
 * @param  iconName: string 
 * @param  placeholder: string
 * @param  onChange: function
 *   
 */

export class AppTextInput extends Component<any>{

    render() {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", marginBottom: this.props.marginBottom ? this.props.marginBottom : 15 }}>
                <View style={[styles.container, { width: this.props.width ? this.props.width : "65%", backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : colors.lightGray }]}>
                    {this.props.iconName && <IconGen size={40} backgroundColor={'none'} name={this.props.iconName} iconColor={colors.black} />}
                    <TextInput keyboardType={this.props.keyboardType}
                        style={[styles.textInput, { textAlignVertical: this.props.textAlignVertical ? this.props.textAlignVertical : null }]} placeholderTextColor={colors.borderLight} {...this.props} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        flexDirection: "row",
        padding: 8,
        marginVertical: 10,
    },
    textInput: {
        fontSize: 18,
        flex: 1
    }
})