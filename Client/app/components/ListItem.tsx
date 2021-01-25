import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { AppText } from './AppText';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors } from '../config/colors';
import { Image } from 'react-native-expo-image-cache';


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

interface ListItemState {
    currentImgUri: string
}

export class ListItem extends Component<any, ListItemState>{
    constructor(props: any) {
        super(props)
        this.state = {
            currentImgUri: this.props.imageUrl
        }
    }
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
                                this.props.addBackground ?
                                    <View style={{ backgroundColor: Colors.bitterSweetRed, padding: 5, borderRadius: 50, borderColor: Colors.whiteInDarkMode, borderWidth: 1 }}>
                                        <Image style={{ height: this.props.height, width: this.props.width, resizeMode: "cover", borderRadius: 50 }} uri={this.props.imageUrl} />
                                    </View>
                                    : <Image
                                        onError={() => this.setState({ currentImgUri: this.props.directPicRoute })}
                                        style={{ height: this.props.height, width: this.props.width, resizeMode: "cover", borderRadius: 50 }}
                                        uri={this.state.currentImgUri} />
                                : null}
                        </View>
                        <View style={{ paddingLeft: this.props.textDistanceFromImg }}>
                            <AppText textAlign={this.props.headTextAlign} fontSize={this.props.headerFontSize} color={this.props.headColor ? this.props.headColor : Colors.whiteInDarkMode}>{this.props.title}</AppText>
                            <AppText textAlign={this.props.subTextAlign} fontSize={this.props.subFontSize} color={this.props.subColor ? this.props.subColor : Colors.whiteInDarkMode}>{this.props.subTitle}</AppText>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>

        )
    }
}


