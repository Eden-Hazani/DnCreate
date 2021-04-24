import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Alert, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { Config } from '../../../../config';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { ListItem } from '../../../components/ListItem';
import ListItemDelete from '../../../components/ListItemDelete';
import { ListItemSeparator } from '../../../components/ListItemSeparator';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import * as Yup from 'yup';
import { AppForm } from '../../../components/forms/AppForm';
import { AppFormField } from '../../../components/forms/AppFormField';
import { SubmitButton } from '../../../components/forms/SubmitButton';
import { IconGen } from '../../../components/IconGen';
import { Image } from 'react-native-expo-image-cache';
import { ScrollView } from 'react-native-gesture-handler';


const ValidationSchema = Yup.object().shape({
    name: Yup.string().required().label("Name"),
    description: Yup.string().required().label("Description"),

})

interface PeopleNotesState {
    character: CharacterModel
    loading: boolean
    notes: any[]
    pickedNote: any
    addNoteModal: boolean
    noteViewModal: boolean
    editMode: boolean
    timedNoteName: string
    timedNoteDesc: string
    pickedImg: string
    pickedImgShown: boolean[]

}

export class PeopleNotes extends Component<{ navigation: any, route: any }, PeopleNotesState>{
    constructor(props: any) {
        super(props)
        this.state = {
            pickedImgShown: [],
            timedNoteName: '',
            timedNoteDesc: '',
            addNoteModal: false,
            pickedNote: null,
            notes: [],
            character: this.props.route.params.char,
            loading: true,
            noteViewModal: false,
            editMode: false,
            pickedImg: ''
        }
    }
    async componentDidMount() {
        const storedNotes = await AsyncStorage.getItem(`personNotes${this.state.character._id}`)
        if (storedNotes) {
            this.setState({ notes: JSON.parse(storedNotes) }, () => {
            });
        }
        this.setState({ loading: false })
    }
    deleteNote = async (noteToDel: string) => {
        const storedNotes = await AsyncStorage.getItem(`personNotes${this.state.character._id}`);
        if (storedNotes) {
            const newNotes = JSON.parse(storedNotes).filter((note: any) => note._id !== noteToDel);
            await AsyncStorage.setItem(`personNotes${this.state.character._id}`, JSON.stringify(newNotes));
            this.setState({ notes: newNotes })
        }
    }

    addNote = async (values: any) => {
        const storedNotes = await AsyncStorage.getItem(`personNotes${this.state.character._id}`)
        const note = {
            _id: `${Math.floor((Math.random() * 1000000) + 1)}`,
            name: values.name,
            description: values.description,
            img: this.state.pickedImg !== '' ? this.state.pickedImg : undefined
        }
        if (!storedNotes) {
            const newNotes = [note]
            await AsyncStorage.setItem(`personNotes${this.state.character._id}`, JSON.stringify(newNotes));
            this.setState({ notes: newNotes, addNoteModal: false })
            return;
        }
        const newNotes = JSON.parse(storedNotes);
        newNotes.push(note);
        await AsyncStorage.setItem(`personNotes${this.state.character._id}`, JSON.stringify(newNotes));
        this.setState({ notes: newNotes, addNoteModal: false, pickedImg: '', pickedImgShown: [] })
    }

    updateNote = async (values: any) => {
        const storedNotes = await AsyncStorage.getItem(`personNotes${this.state.character._id}`)
        if (storedNotes) {
            let oldNotes = JSON.parse(storedNotes);
            const index = oldNotes.map((item: any) => { return item._id }).indexOf(values._id)
            oldNotes[index] = values
            oldNotes[index].img = this.state.pickedImg
            await AsyncStorage.setItem(`personNotes${this.state.character._id}`, JSON.stringify(oldNotes));
            this.setState({ timedNoteDesc: '', timedNoteName: '', notes: oldNotes, pickedNote: null, noteViewModal: false, editMode: false, pickedImg: '', pickedImgShown: [] })
        }
    }


    render() {
        const imgArray = ['dwarf.png', 'troll.png', 'daemon.png', 'cultist.png', 'elf-helmet.png', 'woman-elf-face.png', 'wizard-face.png', 'orc-head.png', 'monk-face.png', 'goblin-head.png', 'fish-monster.png', 'barbarian.png']
        return (
            <View>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View style={styles.container}>
                        <AppText textAlign={'center'} fontSize={25} color={Colors.bitterSweetRed}>People</AppText>
                        <AppText textAlign={'center'} fontSize={17}>These are your personal notes regarding the various people you will meet on your adventure.</AppText>
                        <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                            borderRadius={25} title={'Add Note'} onPress={() => { this.setState({ addNoteModal: true }) }} />
                        <Modal visible={this.state.addNoteModal} animationType={'slide'}>
                            <ScrollView style={{ backgroundColor: Colors.pageBackground, flex: 1 }}>
                                <View style={{ flex: 0.8, alignItems: "center", padding: 25 }}>
                                    <AppText textAlign={'center'} fontSize={25} color={Colors.bitterSweetRed}>Add Note</AppText>
                                    <AppForm
                                        initialValues={{
                                            name: '', description: ''
                                        }}
                                        onSubmit={(values: any) => this.addNote(values)}
                                        validationSchema={ValidationSchema}>
                                        <View >
                                            <AppFormField
                                                width={Dimensions.get('screen').width / 1.4}
                                                internalWidth={Dimensions.get('screen').width / 0.9}
                                                fieldName={"name"}
                                                name="name"
                                                iconName={"fountain-pen"}
                                                placeholder={"Name of the Person..."} />

                                            <AppFormField
                                                width={Dimensions.get('screen').width / 1.4}
                                                internalWidth={Dimensions.get('screen').width / 0.9}
                                                fieldName={"description"}
                                                name="description"
                                                iconName={"card-text-outline"}
                                                textAlignVertical={"top"}
                                                multiline={true} numberOfLines={10}
                                                placeholder={"Description of the person..."} />
                                        </View>
                                        <View style={{ justifyContent: "center", alignItems: "center", padding: 20, height: 160 }}>
                                            <AppText fontSize={18} textAlign={'center'}>If you wish you can pick an Icon to better visualize this person.</AppText>
                                            <ScrollView horizontal style={{ flexDirection: 'row', width: Dimensions.get('screen').width / 1.1 }}>
                                                {imgArray.map((item, index) => <TouchableOpacity key={index} onPress={() => {
                                                    let pickedImgShown: boolean[] = [];
                                                    pickedImgShown[index] = true;
                                                    this.setState({ pickedImgShown, pickedImg: item })
                                                }}>
                                                    <View style={{ margin: 2, justifyContent: "center", alignItems: "center", backgroundColor: this.state.pickedImgShown[index] ? Colors.bitterSweetRed : Colors.berries, height: 70, width: 70, borderRadius: 110, borderWidth: 1, borderColor: Colors.whiteInDarkMode }}>
                                                        <Image style={{ height: 55, width: 55 }} uri={`${Config.serverUrl}/assets/logos/${item}`} />
                                                    </View>
                                                </TouchableOpacity>)}
                                            </ScrollView>
                                        </View>
                                        <SubmitButton title={"Add note"} />
                                        <View>
                                            <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                                borderRadius={25} title={'Close'} onPress={() => { this.setState({ addNoteModal: false }) }} />
                                        </View>
                                    </AppForm>
                                </View>
                            </ScrollView>
                        </Modal>
                        <View style={{ width: Dimensions.get('screen').width / 1.1 }}>
                            <FlatList
                                data={this.state.notes}
                                keyExtractor={notes => notes._id.toString()}
                                renderItem={({ item }) => <ListItem
                                    title={item.name}
                                    imageUrl={`${Config.serverUrl}/assets/logos/${item.img}`}
                                    height={55}
                                    width={55}
                                    subTitle={`${item.description.substr(0, 15)}...`}
                                    direction={'row'}
                                    padding={20}
                                    headTextAlign={"left"}
                                    subTextAlign={"left"}
                                    addBackground={true}
                                    headerFontSize={20}
                                    subFontSize={18}
                                    justifyContent={"flex-start"} textDistanceFromImg={10}
                                    renderRightActions={() =>
                                        <ListItemDelete onPress={() =>
                                            Alert.alert("Delete", "Are you sure you want to delete this note?",
                                                [{ text: 'Yes', onPress: () => this.deleteNote(item._id) }, { text: 'No' }])} />}
                                    onPress={() => { this.setState({ pickedNote: item, noteViewModal: true }) }} />}
                                ItemSeparatorComponent={ListItemSeparator} />
                        </View>
                        <Modal visible={this.state.noteViewModal}>
                            <View style={[styles.container, { backgroundColor: Colors.pageBackground, flex: 1 }]}>
                                <View>
                                    {this.state.editMode && this.state.pickedNote ?
                                        <View>
                                            <TouchableOpacity style={{ position: 'absolute', right: -10, top: -15, zIndex: 10 }} onPress={() => {
                                                this.setState({ editMode: false })
                                            }}>
                                                <IconGen size={80} name={"close"} iconColor={Colors.whiteInDarkMode} />
                                            </TouchableOpacity>
                                            <AppForm
                                                initialValues={{
                                                    name: this.state.pickedNote.name, description: this.state.pickedNote.description, _id: this.state.pickedNote._id
                                                }}
                                                onSubmit={(values: any) => this.updateNote(values)}
                                                validationSchema={ValidationSchema}>
                                                <View>
                                                    <AppFormField
                                                        value={this.state.timedNoteName}
                                                        onChange={(e: any = {}) => { this.setState({ timedNoteName: e.nativeEvent.text }) }}
                                                        style={{ width: Dimensions.get('screen').width / 1.2 }}
                                                        fieldName={"name"}
                                                        name="name"
                                                        iconName={"fountain-pen"}
                                                        placeholder={"Name..."} />

                                                    <AppFormField
                                                        value={this.state.timedNoteDesc}
                                                        onChange={(e: any = {}) => { this.setState({ timedNoteDesc: e.nativeEvent.text }) }}
                                                        style={{ width: Dimensions.get('screen').width / 1.2 }}
                                                        fieldName={"description"}
                                                        name="description"
                                                        iconName={"card-text-outline"}
                                                        textAlignVertical={"top"}
                                                        multiline={true} numberOfLines={10}
                                                        placeholder={"Description..."} />
                                                </View>
                                                <View style={{ justifyContent: "center", alignItems: "center", padding: 20, height: 160 }}>
                                                    <AppText fontSize={18} textAlign={'center'}>If you wish you can pick an Icon to better visualize this person.</AppText>
                                                    <ScrollView horizontal style={{ flexDirection: 'row', width: Dimensions.get('screen').width / 1.1 }}>
                                                        {imgArray.map((item, index) => <TouchableOpacity key={index} onPress={() => {
                                                            let pickedImgShown: boolean[] = [];
                                                            pickedImgShown[index] = true;
                                                            this.setState({ pickedImgShown, pickedImg: item })
                                                        }}>
                                                            <View style={{ margin: 2, justifyContent: "center", alignItems: "center", backgroundColor: this.state.pickedImgShown[index] ? Colors.bitterSweetRed : Colors.berries, height: 70, width: 70, borderRadius: 110, borderWidth: 1, borderColor: Colors.whiteInDarkMode }}>
                                                                <Image style={{ height: 55, width: 55 }} uri={`${Config.serverUrl}/assets/logos/${item}`} />
                                                            </View>
                                                        </TouchableOpacity>)}
                                                    </ScrollView>
                                                </View>
                                                <SubmitButton title={"update note"} textAlign={'center'} />
                                                <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                                    borderRadius={25} title={'Close'} onPress={() => { this.setState({ pickedNote: null, noteViewModal: false, editMode: false }) }} />
                                            </AppForm>
                                        </View>
                                        :
                                        <View>
                                            <View style={{ flex: 0.8 }}>
                                                <TouchableOpacity style={{ position: 'absolute', right: -40, top: -15, zIndex: 10 }} onPress={() => { this.setState({ editMode: true, timedNoteDesc: this.state.pickedNote.description, timedNoteName: this.state.pickedNote.name }) }}>
                                                    <IconGen size={70} name={"playlist-edit"} iconColor={Colors.whiteInDarkMode} />
                                                </TouchableOpacity>
                                                <View style={{ paddingTop: 25, justifyContent: "center", alignItems: "center" }}>
                                                    {this.state.pickedNote?.img &&
                                                        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colors.bitterSweetRed, height: 60, width: 60, borderRadius: 60, borderWidth: 1, borderColor: Colors.whiteInDarkMode }}>
                                                            <Image uri={`${Config.serverUrl}/assets/logos/${this.state.pickedNote.img}`} style={{ height: 50, width: 50 }} />
                                                        </View>}
                                                    <AppText padding={15} textAlign={'center'} fontSize={25} color={Colors.bitterSweetRed}>{this.state.pickedNote?.name}</AppText>
                                                    <ScrollView>
                                                        <AppText textAlign={'center'} fontSize={18}>{this.state.pickedNote?.description}</AppText>
                                                    </ScrollView>
                                                </View>
                                            </View>
                                            <View style={{ flex: 0.2 }}>
                                                <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                                    borderRadius={25} title={'Close'} onPress={() => { this.setState({ pickedNote: null, noteViewModal: false, editMode: false }) }} />
                                            </View>
                                        </View>
                                    }
                                </View>
                            </View>
                        </Modal>
                    </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 25
    }
});