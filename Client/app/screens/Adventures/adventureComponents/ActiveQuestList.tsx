import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedCenterHorizontalList from '../../../components/AnimatedCenterHorizontalList';

export class ActiveQuestList extends Component<{ navigation: any, route: any }>{

    render() {
        return (
            <AnimatedCenterHorizontalList data={this.props.route.params.adventure} isDmLevel={this.props.route.params.isDmLevel} isActive={true} />
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});