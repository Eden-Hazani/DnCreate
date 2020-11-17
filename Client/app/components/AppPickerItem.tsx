import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors } from '../config/colors';
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
                        <IconGen size={Dimensions.get('screen').width / 5.5} backgroundColor={this.props.iconBackgroundColor} name={this.props.iconName} iconColor={Colors.whiteInDarkMode} />
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
        paddingHorizontal: Dimensions.get('screen').width / 20,
        paddingVertical: Dimensions.get('screen').height / 30,
        justifyContent: "space-around"
    }
});