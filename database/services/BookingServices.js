import Booking from "../mongodb/models/Service";


class BookingService {
  constructor() {
    this.$match = {};
    this.$limit = 50;
    this.$skip = 0;
  }

  async bookAservices(data) {
    const booking = new Booking(data);
    await booking.save();
    return booking;
  }

  /**
     * This gets all terminals for given filter
     * @param {Number} page
     * @param {Number} limit
     * @returns {Array} bookings
     */
  async getAll(page = 1, limit = 30) {
    const offset = (page - 1) * limit;
    const filter = { ...this.match };

    let bookings = await Booking.aggregate([
      { $match: filter },
      { $skip: offset },
      { $limit: limit },
    ]);
  
    return bookings;
  }

}

export default BookingService;
