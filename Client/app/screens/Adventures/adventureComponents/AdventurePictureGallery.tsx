import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AppForm } from '../../../components/forms/AppForm';
import { AdventurePhotoArrayModal } from '../../../models/AdventurePhotoArrayModal'
import * as Yup from 'yup';
import { AppText } from '../../../components/AppText';
import { FormImagePicker } from '../../../components/forms/FormImagePicker';
import { SubmitButton } from '../../../components/forms/SubmitButton';
import { io } from 'socket.io-client';
import { Config } from '../../../../config';
import { AdventureModel } from '../../../models/AdventureModel';
import adventureApi from '../../../api/adventureApi';
import { Image as CashImage, CacheManager } from 'react-native-expo-image-cache';
import { AppFormField } from '../../../components/forms/AppFormField';
import { IconGen } from '../../../components/IconGen';
import { Colors } from '../../../config/colors';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import logger from '../../../../utility/logger';
import Modal from 'react-native-modal';
import { store } from '../../../redux/store';
import { ActionType } from '../../../redux/action-type';

const socket = io(Config.serverUrl);



const ValidationSchema = Yup.object().shape({
    photoUri: Yup.string().label("Image").typeError("Must insert an image to upload"),
    description: Yup.string().label("description")
})


interface AdventurePictureGalleryState {
    adventure: AdventureModel
    animatedStatus: Animated.ValueXY
    openOrClosed: boolean
    pickedImage: AdventurePhotoArrayModal
    modalStatus: boolean
    loading: boolean
}
export class AdventurePictureGallery extends Component<{ navigation: any, route: any }, AdventurePictureGalleryState>{
    constructor(props: any) {
        super(props)
        this.state = {
            loading: false,
            modalStatus: false,
            pickedImage: new AdventurePhotoArrayModal(),
            openOrClosed: false,
            animatedStatus: new Animated.ValueXY({ x: 0, y: -150 }),
            adventure: this.props.route.params.adventure
        }
    }

    addImage = async (values: any) => {
        try {
            this.setState({ loading: true })
            if (this.state.adventure.uploadedPhotoArray && this.state.adventure.uploadedPhotoArray.length >= 10) {
                alert("For now DnCreate supports up to 10 images per adventure :(");
                return;
            }
            const result = await adventureApi.addImageToAdventure(this.state.adventure, values);
            if (result.ok) {
                const adventure: any = result.data;
                this.setState({ openOrClosed: false, adventure }, () => {
                    this.moveAnimation()
                    this.setState({ loading: false })
                    store.dispatch({ type: ActionType.UpdateSingleAdventure, payload: this.state.adventure })
                })
            }

        } catch (err) {
            logger.log(err)
        }
    }

    moveAnimation = () => {
        Animated.timing(this.state.animatedStatus, {
            toValue: { x: 0, y: this.state.openOrClosed ? 0 : -150 },
            duration: 100,
            useNativeDriver: false
        }).start()
    }

    componentDidMount() {
        socket.on(`adventure-${this.state.adventure._id}-change`, (adventure: AdventureModel) => {
            this.setState({ adventure }, () => store.dispatch({ type: ActionType.ReplaceParticipateAdventure, payload: this.state.adventure }))
            console.log(store.getState().participatingAdv)
        });
    }

    enlargeImage = (imageObj: AdventurePhotoArrayModal) => {
        this.setState({ pickedImage: imageObj, modalStatus: true })
    }

    removeImg = (photoUri: string) => {
        try {
            const adventure = { ...this.state.adventure };
            if (adventure.uploadedPhotoArray) {
                const newGallery = adventure.uploadedPhotoArray.filter((item, index) => item.photoUri !== photoUri);
                adventure.uploadedPhotoArray = newGallery;
                this.setState({ adventure }, () => {
                    adventureApi.removeImageFromGallery(this.state.adventure, photoUri)
                    this.setState({ modalStatus: false, pickedImage: new AdventurePhotoArrayModal() })
                })
            }
        } catch (err) {
            logger.log(err)
        }
    }

    render() {
        return (
            <ScrollView style={[styles.container, { paddingTop: this.state.openOrClosed ? 50 : 0 }]}>
                <Animated.View style={[this.state.animatedStatus.getLayout(), { height: this.state.openOrClosed ? 300 : 80 }]}>
                    {this.state.loading ?
                        <View style={{ alignSelf: "center", width: 150, height: 150 }}>
                            <AppActivityIndicator visible={this.state.loading} />
                        </View> :
                        <AppForm
                            initialValues={{
                                photoUri: null,
                                description: ""
                            }}
                            onSubmit={(values: any) => this.addImage(values)}
                            validationSchema={ValidationSchema}>
                            <View style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                    <View style={{ paddingBottom: 15, flex: .3 }}>
                                        {this.state.openOrClosed ?
                                            <FormImagePicker name="photoUri" removeCurrentPicture={this.state.openOrClosed} /> :
                                            <AppActivityIndicator visible={this.state.openOrClosed} />}
                                    </View>
                                    <View style={{ flex: .2 }}>
                                        <AppFormField
                                            width={Dimensions.get('screen').width / 1.5}
                                            fieldName={"description"}
                                            iconName={"lock-outline"}
                                            placeholder={"Image desc (optional)"} />
                                    </View>
                                </View>
                            </View>
                            <SubmitButton marginBottom={0} width={50} height={50} fontSize={16} title={"Add"} />
                        </AppForm>
                    }
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.openOrClosed) {
                                this.setState({ openOrClosed: false }, () => this.moveAnimation())
                            } else {
                                this.setState({ openOrClosed: true }, () => this.moveAnimation())
                            }
                        }} style={{ justifyContent: "center", alignItems: "center" }}>
                        <AppText>{this.state.openOrClosed ? 'Close' : "Add Image"}</AppText>
                        <IconGen
                            name={this.state.openOrClosed ? 'chevron-double-up' : 'chevron-double-down'} size={70} iconColor={Colors.whiteInDarkMode} />
                    </TouchableOpacity>
                </Animated.View>
                <View style={{ flex: 1, flexDirection: 'row', flexWrap: "wrap", marginTop: 20 }}>
                    {this.state.adventure.uploadedPhotoArray?.map((imageObj, index) => {
                        return <TouchableOpacity key={index} style={{ margin: 5 }} onPress={() => this.enlargeImage(imageObj)}>
                            <CashImage uri={`${Config.serverUrl}/uploads/adventure-galleries/${this.state.adventure._id}/${imageObj.photoUri}` || ''}
                                style={{ height: Dimensions.get('window').width / 2.2, width: Dimensions.get('window').width / 2.2 }} />
                        </TouchableOpacity>
                    })}
                </View>

                <Modal isVisible={this.state.modalStatus}
                    animationIn="bounceIn"
                    swipeDirection={["left", "right", "up", "down"]}
                    swipeThreshold={5}
                    onSwipeComplete={(e) => { this.setState({ modalStatus: false, pickedImage: new AdventurePhotoArrayModal() }) }}
                    style={{
                        backgroundColor: Colors.pageBackground,
                        marginTop: 100,
                        marginBottom: 100,
                        alignItems: undefined,
                        justifyContent: undefined,
                    }}>
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 50, justifyContent: "flex-start", alignItems: 'center', zIndex: 20 }}>
                        <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.6)', padding: 20, borderRadius: 25 }}>
                            <AppText color={Colors.totalWhite} fontSize={15}>Swipe in any direction to exit</AppText>
                        </View>
                    </View>
                    <View style={{ alignSelf: "center", flex: 1, }}>
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 50, justifyContent: 'flex-end', alignItems: 'center', zIndex: 20 }}>
                            {this.state.pickedImage.description ?
                                <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.6)', padding: 20, borderRadius: 25 }}>
                                    <AppText color={Colors.totalWhite} fontSize={17}>{this.state.pickedImage.description}</AppText>
                                </View> : null}
                        </View>
                        <TouchableOpacity onPress={() => this.removeImg(this.state.pickedImage.photoUri || '')}
                            style={{
                                position: "absolute",
                                width: 60, height: 60,
                                top: 0, left: 0, right: 0, bottom: 50, justifyContent: "flex-start",
                                alignItems: "flex-start", zIndex: 20
                            }}>
                            <IconGen name={"trash-can-outline"} size={70} iconColor={Colors.danger} />
                        </TouchableOpacity>
                        <CashImage uri={`${Config.serverUrl}/uploads/adventure-galleries/${this.state.adventure._id}/${this.state.pickedImage.photoUri}` || ''}
                            style={{ flex: 1, height: Dimensions.get('window').width, width: Dimensions.get('window').width }} />
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
    }
});