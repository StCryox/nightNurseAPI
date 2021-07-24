import { BookingRepository } from "../../data-layer/repository/booking.repository";
import { Booking } from "../../data-layer/models/booking.model";

export class BookingService {

    private bookingRepository: BookingRepository;

    public async getBooking(userId: string): Promise<Booking[]> {
        this.bookingRepository = await BookingRepository.getInstance();
        return this.bookingRepository.getOne(userId);
    }

    public async reserve(booking: Booking): Promise<Booking> {
        this.bookingRepository = await BookingRepository.getInstance();
        return this.bookingRepository.insert(booking);
    }

    public async update(id: string, booking: Booking): Promise<Booking> {
        this.bookingRepository = await BookingRepository.getInstance();
        return this.bookingRepository.update(id, booking);
    }

    public async remove(id: string): Promise<string> {
        this.bookingRepository = await BookingRepository.getInstance();
        return this.bookingRepository.delete(id);
    }
}
