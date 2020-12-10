import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedCenterHorizontalList from '../../../components/AnimatedCenterHorizontalList';

export class CompletedQuestList extends Component<{ navigation: any, route: any }>{

    render() {
        return (
            <AnimatedCenterHorizontalList data={this.props.route.params.adventure} isDmLevel={false} isActive={false} />
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});