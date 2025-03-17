import React from 'react';
import { Card, Icon, Text } from 'react-native-paper';
import { Dimensions, Image, ImageSourcePropType, Platform, StyleSheet, View } from 'react-native';
import { theme } from '../../constants/theme';

interface DestinationCardProps {
  title: string;
  rating: number;
  reviewCount: number;
  fromPricePerPerson: string;
  imageUri: ImageSourcePropType;
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

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
        <Text style={[theme.fonts.bodySmall, { fontWeight: 'bold', color: 'black' }]}>
          <Icon
            source="star"
            theme={theme}
            size={deviceWidth * 0.035}
            color={'#16a34a'}
          />
          {rating}
          <Text style={[theme.fonts.bodySmall]}> ({reviewCount}) </Text>
        </Text>

        <Text style={[theme.fonts.titleSmall, { color: 'black' }]}>{title}</Text>
        <Text style={[theme.fonts.bodySmall]}>
          From {fromPricePerPerson}/Person
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: deviceWidth * 0.03,
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: 'transparent',
    width: deviceWidth * 0.45,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: deviceWidth * 0.025,
  },
  cardContent: {
    marginTop: deviceHeight * 0.015,
    paddingHorizontal: deviceWidth * 0.01,
  },
});

export default DestinationCard;