/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import React, {useMemo, useState} from 'react';
import {FlatList, View, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {globalTheme} from '../../../config/theme/global-theme';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import {PokemonCard} from '../../components/pokemons/PokemonCard';
import {useQuery} from '@tanstack/react-query';
import {
  getPokemonNamesWithId,
  getPokemonsByIds,
} from '../../../actions/pokemons';
import {FullScreenLoader} from '../../components/ui/FullScreenLoader';
import {useDebaunceValue} from '../../hooks/useDebaunceValue';

export const SearchScreen = () => {
  const {top} = useSafeAreaInsets();
  const [term, setTerm] = useState('');

  const devouncedValue = useDebaunceValue(term);

  const {isLoading, data: pokemonNameList = []} = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: () => getPokemonNamesWithId(),
  });

  //TODO Aplicar luego debounce
  const pokemonNameIdList = useMemo(() => {
    //Es un numero
    if (!isNaN(Number(devouncedValue))) {
      const pokemon = pokemonNameList.find(
        pokemon => pokemon.id === Number(devouncedValue),
      );
      return pokemon ? [pokemon] : [];
    }
    if (devouncedValue.length === 0) {
      return [];
    }
    if (devouncedValue.length < 3) {
      return [];
    }
    return pokemonNameList.filter(pokemon =>
      pokemon.name.includes(devouncedValue.toLocaleLowerCase()),
    );
  }, [devouncedValue]);

  const {isLoading: isLoadingPokemons, data: pokemons = []} = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameIdList],
    queryFn: () =>
      getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }
  return (
    <View style={[globalTheme.globalMargin, {paddingTop: top + 10}]}>
      <TextInput
        placeholder="Buscar Pokemon"
        mode="flat"
        autoFocus
        autoCorrect={false}
        onChangeText={setTerm}
        value={term}
      />

      {isLoadingPokemons && <ActivityIndicator style={{paddingTop: 20}} />}


      <FlatList
        data={pokemons}
        keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
        numColumns={2}
        style={{paddingTop: top + 20}}
        renderItem={({item}) => <PokemonCard pokemon={item} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{height: 120}}></View>}
      />
    </View>
  );
};
