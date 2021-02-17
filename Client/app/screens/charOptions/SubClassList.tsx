import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import logger from '../../../utility/logger';
import subClassesApi from '../../api/subClassesApi';
import AuthContext from '../../auth/context';
import { AppText } from '../../components/AppText';
import { IconGen } from '../../components/IconGen';
import { Colors } from '../../config/colors';
import { SubClassModal } from '../../models/SubClassModal';

interface SubClassListState {
    data: SubClassModal[]
    currentLoaded: number
    pathChosen: any
    pickedIndex: number
    search: string
}
export class SubClassList extends Component<{ baseClass: string, baseSubClassList: any[], pickPath: any, pathClicked: boolean[] }, SubClassListState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            search: '',
            data: this.props.baseSubClassList,
            currentLoaded: 10,
            pathChosen: null,
            pickedIndex: -1
        }
    }
    componentDidMount() {
        this.loadNextRaceBatch(0, 10)
    }
    loadNextRaceBatch = async (start: number, end: number) => {
        try {
            const data = [...this.state.data]
            const subclassType = await AsyncStorage.getItem('showPublicSubClasses');
            const searchObj = {
                start,
                end,
                _id: this.context.user._id,
                baseClass: this.props.baseClass,
                subclassType
            }
            const subClasses: any = await subClassesApi.getSubclassList(searchObj)
            const newSubClasses = data.concat(subClasses.data)
            this.setState({ currentLoaded: this.state.currentLoaded + 10, data: newSubClasses })
        } catch (err) {
            logger.log(err)
        }
    }

    updateSearch = async (search: string) => {
        this.setState({ search })
        const subclassType = await AsyncStorage.getItem('showPublicSubClasses');
        if (search.trim() === "") {
            this.setState({ currentLoaded: 10, data: this.props.baseSubClassList }, () => this.loadNextRaceBatch(0, 10))
            return;
        }
        const searchObj = {
            text: search,
            _id: this.context.user._id,
            baseClass: this.props.baseClass,
            subclassType
        }
        const searchedRaces: any = await subClassesApi.searchSubClasses(searchObj);
        const baseSubClasses = this.props.baseSubClassList.filter((item, index) => item.name.includes(search));
        this.setState({ data: baseSubClasses.concat(searchedRaces.data) })
    }
    componentDidCatch(error: any, info: any) {
        const errorObject = { error, info }
        logger.log(new Error('Component Catch Error'))
        logger.log(new Error(JSON.stringify(errorObject)))
    }

    render() {
        return (
            <View style={styles.container}>
                <SearchBar
                    searchIcon={false}
                    containerStyle={{ backgroundColor: Colors.pageBackground, borderRadius: 150 }}
                    inputContainerStyle={{ backgroundColor: Colors.pageBackground }}
                    lightTheme={Colors.pageBackground === "#121212" ? false : true}
                    placeholder="Search For Subclass"
                    onChangeText={this.updateSearch}
                    value={this.state.search}
                />
                {(this.state.pathChosen && this.state.pathChosen.name && this.props.pathClicked.includes(true)) &&
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <TouchableOpacity
                            style={{ borderRadius: 15, backgroundColor: Colors.danger, width: 250 }}
                            onPress={() => {
                                this.setState({ pathChosen: null })
                                this.props.pickPath(this.state.pathChosen, this.state.pickedIndex)
                            }}>
                            <AppText textAlign={'center'}>{this.state.pathChosen.name}</AppText>
                            <AppText textAlign={'center'}>press to reset</AppText>
                        </TouchableOpacity>
                    </View>
                }
                <View style={{ position: "relative", justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ position: 'absolute', flexDirection: 'row', top: 15 }}>
                        <IconGen name={'chevron-left'} size={50} iconColor={Colors.whiteInDarkMode} />
                        <IconGen name={'chevron-right'} size={50} iconColor={Colors.whiteInDarkMode} />
                    </View>
                </View>
                {this.state.data.length !== 0 &&
                    <Animated.FlatList
                        style={{ flex: 1 }}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
                        onEndReachedThreshold={2}
                        onEndReached={() => {
                            this.loadNextRaceBatch(this.state.currentLoaded, 10)
                        }}
                        keyExtractor={(item: any, index: any) => index.toString()}
                        data={this.state.data}
                        renderItem={({ item, index }: any) =>
                            <View style={{ justifyContent: "center", alignItems: "center", width: Dimensions.get('window').width }}>
                                <TouchableOpacity
                                    onLayout={(event) => {
                                        const { x, y, width, height } = event.nativeEvent.layout;
                                    }}
                                    onPress={() => {
                                        this.setState({ pathChosen: item, pickedIndex: index })
                                        this.props.pickPath(item, index)
                                    }}
                                    style={[styles.item, { width: Dimensions.get('window').width - 50, backgroundColor: this.props.pathClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                    <AppText color={this.props.pathClicked[index] ? Colors.black : Colors.bitterSweetRed} textAlign={'center'} fontSize={22}>{item.name}</AppText>
                                    <AppText fontSize={18}>{item.description.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}</AppText>
                                    {item.restriction && <View>
                                        <AppText textAlign={'center'} color={this.props.pathClicked[index] ? Colors.black : Colors.danger} fontSize={24}>Restrictions</AppText>
                                        <AppText textAlign={'center'} color={this.props.pathClicked[index] ? Colors.black : Colors.danger} fontSize={18}>{item.restriction.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}</AppText>

                                    </View>}
                                </TouchableOpacity>
                            </View>
                        }
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        horizontal
                    />
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    item: {
        minHeight: 450,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    },
});