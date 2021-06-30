import { BookingService } from "../../business-layer/services/booking.service";
import { Booking } from "../../data-layer/models/booking.model";

export class BookingController {

    private bookingService: BookingService;

    constructor(){
        this.bookingService = new BookingService();
    }

    public async getUserBooking(userId: string): Promise<Booking[]> {
        return this.bookingService.getBooking(userId);
    }

    public async book(booking: Booking): Promise<Booking> {
        return this.bookingService.reserve(booking);
    }


    public async updateBooking(id: string, booking: Booking): Promise<Booking> {
        return await this.bookingService.update(id, booking);
    }

    public async removeBooking(id: string): Promise<string> {
       return this.bookingService.remove(id);
    }
}
