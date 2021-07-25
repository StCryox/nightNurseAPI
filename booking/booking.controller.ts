import { BookingService } from "./business-layer/booking.service";
import { Booking } from "./data-layer/booking.model";

export class BookingController {

    private bookingService: BookingService;

    constructor(){
        this.bookingService = new BookingService();
    }

    public async getAllBookings(): Promise<Booking[] | null> {
        return this.bookingService.getAllBookings();
    }

    public async getAllUserBookingsById(userId: string): Promise<Booking[] | null> {
        return this.bookingService.getAllUserBookingsById(userId);
    }

    public async getBooking(id: string): Promise<Booking | null> {
        return this.bookingService.getOneBooking(id);
    }

    public async book(booking: any): Promise<Booking | null> {
        return this.bookingService.reserve(booking);
    }

    public async updateBooking(id: string, booking: Booking): Promise<Booking | null> {
        return this.bookingService.update(id, booking);
    }

    public async removeBooking(id: string): Promise<string | null> {
       return this.bookingService.remove(id);
    }
}
