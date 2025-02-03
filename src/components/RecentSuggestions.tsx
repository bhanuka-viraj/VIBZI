import { View, Text, ScrollView, FlatList } from 'react-native'
import React from 'react'
import DestinationCard from './cards/DestinationCard'
import { cards } from '../constants/data'

const RecentSuggestions = () => {
    return (
        <View>
            <FlatList
                data={cards}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <DestinationCard
                        title={item.title}
                        rating={item.rating}
                        reviewCount={item.reviewCount}
                        fromPricePerPerson={item.fromPricePerPerson}
                        imageUri={{ uri: item.image }}
                    />
                )}
            />
        </View>
    )
}

export default RecentSuggestions