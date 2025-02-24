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

export function parseTrips(response : any) {
    if (!response || !response.items) {
      return [];
    }
    return response.items.map((item : any) => ({
      id: item.id,
      tripId:item.tripId,
      title: item.title,
      description: item.description,
      image: 'https://picsum.photos/700',
    }));
  }

export function parseTripDate(dateString: string): string {
  return dayjs(dateString).format('MMM DD');
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