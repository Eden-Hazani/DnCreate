import React, { Component } from 'react';
import { Text, StyleSheet, PixelRatio } from 'react-native';
import * as Font from 'expo-font';
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


export class AppText extends Component<any, any> {
    constructor(props: any) {
        super(props)
    }


    render() {
        return (
            <Text numberOfLines={this.props.numberOfLines} style={{
                paddingBottom: this.props.paddingBottom,
                fontWeight: this.props.fontWeight,
                width: this.props.width,
                flex: this.props.flex,
                fontSize: this.props.fontSize && PixelRatio.get() <= 2.7 ? this.props.fontSize * .95 : this.props.fontSize,
                padding: this.props.padding,
                textAlign: this.props.textAlign,
                paddingLeft: this.props.paddingLeft,
                fontFamily: "KumbhSans-Light",
                color: this.props.color ? this.props.color : Colors.whiteInDarkMode
            }}>{this.props.children}</Text>
        )
    }
}




