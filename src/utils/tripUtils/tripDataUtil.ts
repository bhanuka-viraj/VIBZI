import dayjs from 'dayjs';

export interface ItineraryItem {
  position: number;
  date: string;
  type: string;
  details: {
    title: string;
    customFields: {
      activityName: string;
      booked: string;
      startTime: string;
      endTime: string;
      link: string;
      reservationNumber: string;
      note: string;
    };
  };
}

export const getImageSource = (url: string) => {
  switch(url) {
    case '/1.jpg':
      return require('../../assets/images/trip/1.jpg');
    case '/2.jpg':
      return require('../../assets/images/trip/2.jpg');
    case '/3.jpg':
      return require('../../assets/images/trip/3.jpg');
    case '/4.jpg':
      return require('../../assets/images/trip/4.jpg');
    case '/5.jpg':
      return require('../../assets/images/trip/5.jpg');
    case '/6.jpg':
      return require('../../assets/images/trip/6.jpg');
    default:
      return require('../../assets/images/trip/1.jpg'); // default image
  }
};

export function parseTrips(response: any) {
  if (!response || !response.items) {
    return [];
  }
  console.log('Parsing trips, first imageUrl:', response.items[0]?.imageUrl);
  const parsed = response.items.map((item: any) => {
    const imageSource = getImageSource(item.imageUrl);
    console.log('Image source for', item.imageUrl, ':', imageSource);
    return {
      id: item.id,
      tripId: item.tripId,
      title: item.title,
      description: item.description,
      image: imageSource,
    };
  });
  return parsed;
}

export function parseTripDate(dateString: string): string {
  return dayjs(dateString).format('MMM DD');
}

export function parseTime(timeString: string): string {
  return dayjs(timeString).format('h:mm A');
}

export function parseItineraryData(data: any) {
  if (!data || !data.itinerary) {
    return {
      dates: [],
      itineraryByDate: {} as Record<string, ItineraryItem[]>
    };
  }

  const itinerary = data.itinerary as Record<string, ItineraryItem[]>;
  return {
    dates: Object.keys(itinerary),
    itineraryByDate: itinerary
  };
}