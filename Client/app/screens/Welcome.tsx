import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { AppTextHeadline } from '../components/AppTextHeadline';
import { AppText } from '../components/AppText';
import colors from '../config/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AnimateContactUpwards } from '../animations/AnimateContactUpwards';
import { AppButton } from '../components/AppButton';




export class Welcome extends Component<any> {


    render() {
        return (
            <View style={{ flex: 1 }}>
                <AnimatedLogo></AnimatedLogo>
                <AnimateContactUpwards>
                    <View>
                        <View style={styles.textContainer}>
                            <AppTextHeadline>Welcome to DnCreate</AppTextHeadline>
                            <AppText fontSize={20} textAlign={"center"} color={colors.text} padding={20}>Creating D&amp;D characters has never been easier, register to begin!</AppText>
                            <AppText fontSize={20} textAlign={"center"} color={colors.text} padding={20}>Already a user? Login Now</AppText>
                        </View>
                        <View style={styles.buttonsView}>
                            <AppButton fontSize={20} color={colors.totalWhite} backgroundColor={colors.bitterSweetRed} onPress={() => this.props.navigation.navigate("Login")} borderRadius={100} width={100} height={100} title={"Login"} />
                            <AppButton fontSize={20} color={colors.totalWhite} backgroundColor={colors.bitterSweetRed} onPress={() => this.props.navigation.navigate("Register")} borderRadius={100} width={100} height={100} title={"Register"} />
                        </View>
                    </View>
                </AnimateContactUpwards>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textContainer: {
        marginTop: 10
    },
    buttonsView: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: 20

    }, button: {
        elevation: 10,
        justifyContent: "center",
        height: 112,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 200,
        backgroundColor: colors.bitterSweetRed
    },
})