import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

export class AppError extends Component<any>{
    render() {
        return (
            <View style={styles.container}>
                <AppText textAlign={"center"} fontSize={30}>Oops... seems like our servers are having issues</AppText>
                <AppText fontSize={20}>Sorry about that :(</AppText>
                <View style={{ marginTop: 30 }}>
                    <AppButton height={70} width={150} fontSize={30} borderRadius={50} title={"Retry"} onPress={this.props.onPress} />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        justifyContent: "center",
        alignItems: "center",
    }
});