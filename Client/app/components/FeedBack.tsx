import React, { Component } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import userCharApi from '../api/userCharApi';
import AuthContext from '../auth/context';
import { Colors } from '../config/colors';
import { store } from '../redux/store';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { AppTextInput } from './forms/AppTextInput';

interface FeedBackState {
    text: string
}

export class FeedBack extends Component<{ close: any }, FeedBackState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            text: ''
        }
    }
    sendFeedBack = async () => {
        const info = { username: store.getState().user.username, text: this.state.text }
        userCharApi.feedBack(info);

        await userCharApi.feedBack(info).then(result => {
            Alert.alert("Feedback was sent", "Thanks :) \n we will get right on that!", [{
                text: 'Ok', onPress: () =>
                    this.props.close(false)
            }])
        }).catch(err => {
            Alert.alert("Oops, problem", "Sorry :( \n we could not send your feedback this time, try again later or hit us up at \n dncreateteam@gmail.com", [{
                text: 'Ok', onPress: () =>
                    this.props.close(false)
            }])
        });
    }
    render() {
        return (
            <ScrollView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={25}>FeedBack!</AppText>
                <AppText textAlign={'center'} fontSize={17}>DnCreate would be nothing without its user base.</AppText>
                <AppText textAlign={'center'} fontSize={17}>So it's only fair that we listen to what you have to say.</AppText>
                <AppText textAlign={'center'} fontSize={17}>You have any ideas?</AppText>
                <AppText textAlign={'center'} fontSize={17}>Things you want to see in DnCreate?</AppText>
                <AppText textAlign={'center'} fontSize={17}>Features that would give you a better experience?</AppText>
                <AppText textAlign={'center'} fontSize={17}>Annoying bugs or crashes?</AppText>
                {this.context.user._id === "Offline" ?
                    <View>
                        <AppText fontSize={20} color={Colors.danger} textAlign={'center'}>As an offline user you cannot use the feedback option directly </AppText>
                        <AppText fontSize={20} color={Colors.danger} textAlign={'center'}>But! we still want to hear your opinion, please feel free reach us on</AppText>
                        <AppText fontSize={25} color={Colors.deepGold} textAlign={'center'}>dncreateteam@gmail.com</AppText>
                    </View> :
                    <View>
                        <AppText textAlign={'center'} fontSize={17}>{`\n\n Write whatever you think here and hit send.`}</AppText>
                        <AppText textAlign={'center'} fontSize={17}>We will look at your ideas and get back to you!</AppText>

                        <AppTextInput onChangeText={(text: string) => {
                            this.setState({ text })
                        }} numberOfLines={7} multiline={true} textAlignVertical={"top"} />
                        <AppButton fontSize={18} title={'Send'} onPress={() => {
                            this.sendFeedBack();
                        }}
                            backgroundColor={Colors.berries} width={120} height={50} borderRadius={25} />

                        <AppButton padding={20} fontSize={18} title={'No Thanks'} onPress={() => {
                            this.props.close(false);
                        }}
                            backgroundColor={Colors.earthYellow} width={120} height={50} borderRadius={25} />
                    </View>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});