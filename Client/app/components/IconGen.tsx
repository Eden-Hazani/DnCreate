import React, { Component } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'

/**
 * 
 * @param  size: number
 * @param  backgroundColor: #string
 * @param  name: string 
 * @param  iconColor: #string 
 */

export class IconGen extends Component<any>{
    render() {
        return (
            <View style={{
                width: this.props.size,
                height: this.props.size,
                borderRadius: this.props.size / 2,
                backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : null,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <MaterialCommunityIcons name={this.props.name} color={this.props.iconColor} size={this.props.size * 0.5} />
            </View>
        )
    }
}