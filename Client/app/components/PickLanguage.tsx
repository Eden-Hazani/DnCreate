import React, { Component } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTextInput } from './forms/AppTextInput';

import { SearchableTextDropDown } from './SearchableTextDropDown'

interface Props {
    passLanguage: Function;
    width: any;
    resetLanguage: boolean | undefined;
    defaultValue?: string
}

const languages = ['Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 'Abyssal', 'Draconic', 'Kraul', 'Loxodon', 'Minotaur', 'Sylvian', 'Sphinx', 'Merfolk'
    , 'Vedalken', 'Deep Speech', 'Infernal', 'Primordial', 'Undercommon', 'Arakocra', 'Druidic', 'Leonin', 'Gith', 'Halfling']

export function PickLanguage({ passLanguage, width, resetLanguage, defaultValue }: Props) {
    const [autoFocused, setAutoFocused] = useState<boolean>(false)
    const [language, setLanguage] = useState<string>(defaultValue ? defaultValue : '');


    useEffect(() => {
        if (resetLanguage) setLanguage('')
    }, [resetLanguage])

    useEffect(() => {
        passLanguage(language)
    }, [language])

    return (
        <View style={[styles.container, { width }]}>
            <AppTextInput
                value={language}
                onBlur={() => setAutoFocused(false)}
                onFocus={() => setAutoFocused(true)}
                placeholder={"Language..."}
                onChangeText={(txt: string) => {
                    setLanguage(txt)
                    if (!autoFocused) setAutoFocused(true)
                }} />
            <SearchableTextDropDown
                pickText={(text: string) => {
                    setLanguage(text)
                    setAutoFocused(false)
                }}

                infoList={languages}
                inputtedText={language} isOpen={autoFocused} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
    }
});