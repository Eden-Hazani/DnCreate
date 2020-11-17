import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { AppText } from './AppText';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors } from '../config/colors';


/**
 * 
 * @param  renderRightActions: any 
 * @param  onPress: any 
 * @param  justifyContent: string 
 * @param  direction: string 
 * @param  padding: number or string% 
 * @param  height: number or string%  
 * @param  width: number or string%  
 * @param  image: image url-string || URI
 * @param  textDistanceFromImg: number or string% 
 * @param  title: string
 * @param  subTitle: string
 * @param  alignListItem: string
 *   
 */


export class SpellListItem extends Component<any>{
    render() {
        return (
            <Swipeable renderLeftActions={this.props.renderLeftActions}
                renderRightActions={this.props.renderRightActions}>
                <TouchableOpacity onPress={this.props.onPress} >
                    <View style={{
                        justifyContent: this.props.justifyContent, alignItems: this.props.alignListItem ? this.props.alignListItem : 'center',
                        flexDirection: this.props.direction, padding: this.props.totalPadding ? this.props.totalPadding : 30, paddingBottom: this.props.padding
                    }}>
                        <View>
                            {this.props.imageUrl ?
                                <Image style={{ height: this.props.height, width: this.props.width, resizeMode: "cover", borderRadius: 50 }} source={{ uri: this.props.imageUrl }} />
                                : null}
                        </View>
                        <View style={{ paddingLeft: this.props.textDistanceFromImg }}>
                            <AppText textAlign={this.props.headTextAlign} fontSize={this.props.headerFontSize} color={this.props.headColor ? this.props.headColor : Colors.black}>{this.props.title}</AppText>
                            <AppText textAlign={this.props.subTextAlign} fontSize={this.props.subFontSize} color={this.props.subColor ? this.props.subColor : Colors.black}>{this.props.subTitle}</AppText>
                            <AppText textAlign={this.props.subTextAlign} fontSize={this.props.subFontSize} color={this.props.subColor ? this.props.subColor : Colors.black}>{this.props.classes}</AppText>
                            <AppText textAlign={this.props.subTextAlign} fontSize={this.props.subFontSize} color={this.props.subColor ? this.props.subColor : Colors.black}>{this.props.duration}</AppText>
                            <AppText textAlign={this.props.subTextAlign} fontSize={this.props.subFontSize} color={this.props.subColor ? this.props.subColor : Colors.black}>{this.props.range}</AppText>
                            <AppText textAlign={this.props.subTextAlign} fontSize={this.props.subFontSize} color={this.props.subColor ? this.props.subColor : Colors.black}>{this.props.type}</AppText>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>

        )
    }
}


