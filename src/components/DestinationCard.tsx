import React from 'react';
import { Card, Icon, Text } from 'react-native-paper';
import { Dimensions, Image, ImageSourcePropType, Platform, StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';

interface DestinationCardProps {
  title: string;
  rating: number;
  reviewCount: number;
  fromPricePerPerson: string;
  imageUri: ImageSourcePropType;
}

const deviceWidth = Dimensions.get('window').width;

const DestinationCard: React.FC<DestinationCardProps> = ({
  title,
  rating,
  reviewCount,
  fromPricePerPerson,
  imageUri,
}) => {
  return (
    <Card style={styles.card} elevation={0}>
      <Image
        source={imageUri}
        style={styles.image}
      />
      <Card.Content style={styles.cardContent}>
        <Text style={[theme.fonts.bodyMedium,{fontWeight: 'bold'}]}>
          <Icon source="star" theme={theme} size={17} />
          {rating} 
          <Text style={[theme.fonts.bodyMedium]}> ({reviewCount}) </Text>
          </Text>

        <Text style={[theme.fonts.titleMedium]}>{title}</Text>
        <Text style={[theme.fonts.bodyMedium]}>
          From {fromPricePerPerson}/Person
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: 'transparent',
    width: deviceWidth * 0.55, 
  },
  image: {
    width: '100%',
    height: Platform.OS === 'ios' ? 270 : 300, 
    borderRadius: 10,
  },
  cardContent: {
    marginTop: 13,
    paddingHorizontal: 3,
  },
});

export default DestinationCard;