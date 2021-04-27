import React, { Component, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { classList } from '../../../../jsonDump/classList.json';
import { AppText } from '../../../components/AppText';
import Modal from 'react-native-modal';
import { Colors } from '../../../config/colors';
import { IconGen } from '../../../components/IconGen';
import { AppButton } from '../../../components/AppButton';
import { store } from '../../../redux/store';
import { ActionType } from '../../../redux/action-type';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducer';

const marketTypes: { val: string, name: string }[] = [{ val: 'CHAR', name: 'Characters' }, { val: 'WEAP', name: 'Weapons' }]


export function MarketFilters() {
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false)
    const pickedFilters = useSelector((state: RootState) => { return { ...state.marketPlaceFilters } });
    const marketType = useSelector((state: RootState) => { return state.marketPlaceType });

    const pickClassFilter = (item: string) => {
        if (pickedFilters.classFilters.includes(item)) {
            const newFilters = [...store.getState().marketPlaceFilters.classFilters];
            let index = pickedFilters.classFilters.indexOf(item);
            newFilters.splice(index, 1);
            store.dispatch({ type: ActionType.ReplaceMarketClassFilterItem, payload: newFilters })
            return;
        } else {
            store.dispatch({ type: ActionType.ReplaceMarketClassFilterItem, payload: [...pickedFilters.classFilters, item] })
        }
    }

    const pickMarketType = (type: string) => {
        store.dispatch({ type: ActionType.ReplaceMarketClassFilterItem, payload: [] })
        store.dispatch({ type: ActionType.ChangeMarketPlaceType, payload: type })
    }

    const applyFilters = () => {
        store.dispatch({ type: ActionType.ChangeMarketFilterAppliedState, payload: true });
        setFilterModalOpen(false)
    }

    const changeDownloadOrder = (payload: number) => {
        store.dispatch({ type: ActionType.ReplaceMarketMostDownloadedFilter, payload: payload });
    }


    return (
        <>
            <TouchableOpacity onPress={() => setFilterModalOpen(true)}>
                <IconGen name={'filter-variant'} size={70} iconColor={Colors.whiteInDarkMode} />
            </TouchableOpacity>
            <Modal isVisible={filterModalOpen}
                animationIn="slideInLeft"
                swipeDirection={["left"]}
                swipeThreshold={20}
                onSwipeComplete={(e) => { setFilterModalOpen(false) }}
                style={{
                    backgroundColor: Colors.pageBackground,
                    margin: 0,
                    marginRight: 150,
                    alignItems: undefined,
                    justifyContent: undefined,
                }}>
                <TouchableOpacity activeOpacity={.9} style={{ flex: 1 }}>
                    <ScrollView>

                        <View style={{ paddingBottom: 25 }}>
                            <AppText paddingBottom={15} padding={5}>Market Type</AppText>
                            {marketTypes.map((item, index) => <TouchableOpacity onPress={() => pickMarketType(item.val)}
                                style={[styles.item]} key={index}>
                                <AppText color={marketType === item.val ? Colors.bitterSweetRed : Colors.lightGray}>{item.name}</AppText>
                            </TouchableOpacity>)}
                        </View>
                        {marketType === 'CHAR' &&
                            <View style={{}}>
                                <AppText paddingBottom={15} padding={5}>Filter By Class</AppText>
                                {classList.map((item, index) => <TouchableOpacity onPress={() => pickClassFilter(item)}
                                    style={[styles.item]} key={index}>
                                    <AppText color={pickedFilters.classFilters.includes(item) ? Colors.bitterSweetRed : Colors.lightGray}>{item}</AppText>
                                </TouchableOpacity>)}
                            </View>}
                        <View style={{}}>
                            <AppText>Order By</AppText>
                            {pickedFilters.topDownLoaded === -1 ?
                                <TouchableOpacity onPress={() => changeDownloadOrder(1)} style={styles.orderFilter}>
                                    <AppText>Most Downloaded</AppText>
                                    <IconGen name={'chevron-up'} size={50} iconColor={Colors.whiteInDarkMode} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => changeDownloadOrder(-1)} style={styles.orderFilter}>
                                    <AppText>Least Downloaded</AppText>
                                    <IconGen name={'chevron-down'} size={50} iconColor={Colors.whiteInDarkMode} />
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{}}>
                            <AppButton onPress={() => applyFilters()} title={'Apply Filters'} width={80} backgroundColor={Colors.bitterSweetRed} borderRadius={15} />
                        </View>
                        <View style={{}}>
                            <AppText fontSize={20} >Slide left to close.</AppText>
                        </View>
                    </ScrollView>
                </TouchableOpacity>
            </Modal>
        </>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: 150,
        height: 30,
        marginLeft: 20
    },
    orderFilter: {
        flexDirection: 'row',
        alignItems: "center",
        padding: 5
    }
});