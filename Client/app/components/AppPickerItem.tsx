import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
                    {this.props.iconName ?
                        <IconGen size={70} backgroundColor={this.props.iconBackgroundColor} name={this.props.iconName} iconColor={colors.white} />
                        :
                        <Image style={{ height: this.props.height, width: this.props.width, resizeMode: "cover", borderRadius: 50 }} source={{ uri: this.props.imageUrl }} />
                    }
                    <View style={{ marginTop: 10 }}>
                        <AppText fontSize={18} textAlign={"center"}>{this.props.text}</AppText>
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