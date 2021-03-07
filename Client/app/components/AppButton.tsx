import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Colors } from '../config/colors';
import { AppButtonInnerText } from './AppButtonInnerText';


/**
 * 
 * @param  title: string 
 * @param  onPress: function 
 *   
 */

export class AppButton extends Component<any>{
    render() {
        return (
            <TouchableOpacity disabled={this.props.disabled} activeOpacity={.8} style={[styles.container, { padding: this.props.padding ? this.props.padding : 0 }]} onPress={this.props.onPress}>
                <View style=
                    {[styles.button,
                    {
                        marginBottom: this.props.marginBottom,
                        backgroundColor: this.props.disabled ? Colors.lightGray : this.props.backgroundColor,
                        width: this.props.width,
                        height: this.props.height,
                        borderRadius: this.props.borderRadius, display: this.props.display
                    }]}>
                    {this.props.highlightText ?
                        <View style={{ backgroundColor: this.props.highLightColor ? this.props.highLightColor : Colors.totalWhite, borderRadius: this.props.width / 2, padding: 5 }}>
                            <AppButtonInnerText buttonHeightSize={this.props.height} buttonWidthSize={this.props.width} color={this.props.color} fontSize={this.props.fontSize}
                                textAlign={"center"} padding={5}>{this.props.title ? this.props.title.replace(" ", '\n') : " "}</AppButtonInnerText>
                        </View>
                        :
                        <AppButtonInnerText buttonHeightSize={this.props.height} buttonWidthSize={this.props.width} color={this.props.color} fontSize={this.props.fontSize}
                            textAlign={"center"} padding={5}>{this.props.title ? this.props.title.replace(" ", '\n') : " "}</AppButtonInnerText>
                    }
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        elevation: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        width: 100,
        borderRadius: 25,
    },
    disabled: {
    }
})