import React, { Component } from 'react';
import { Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { Colors } from '../config/colors';
/**
 * 
 * @param  color: #string 
 * @param  padding: number or string% 
 * @param  textAlign: string
 * @param  fontSize: number
 * @param  numberOfLines: string
 *   
 */



export class AppButtonInnerText extends Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    normalizeFontScale = (buttonHeightSize: number, buttonWidthSize: number, fontSize: number) => {
        const value = ((buttonHeightSize * buttonWidthSize) * (fontSize / 100)) / 100;
        if (!isNaN(value)) {
            return ((buttonHeightSize * buttonWidthSize) * (fontSize / 100)) / 100;
        }
        return 15
    }

    render() {
        return (
            <Text style={{
                paddingBottom: this.props.paddingBottom,
                fontWeight: this.props.fontWeight,
                width: this.props.width,
                flex: this.props.flex,
                fontSize: this.normalizeFontScale(this.props.buttonHeightSize, this.props.buttonWidthSize, this.props.fontSize),
                padding: this.props.padding,
                textAlign: this.props.textAlign,
                fontFamily: "KumbhSans-Light",
                color: this.props.color ? this.props.color : Colors.whiteInDarkMode
            }}> { this.props.children}</Text >
        )
    }
}




