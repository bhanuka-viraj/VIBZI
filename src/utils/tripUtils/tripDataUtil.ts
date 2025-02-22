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