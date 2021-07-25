import { Booking } from "./data-layer/booking.model";
import { BookingRepository } from "./data-layer/booking.repository";

export class BookingService {

    private bookingRepository!: BookingRepository;


    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    public async getAllBookings(): Promise<Booking[] | null> {
        this.bookingRepository = await BookingRepository.getInstance();
        return this.bookingRepository.getAll();
    }

    public async getAllUserBookingsById(userId: string): Promise<Booking[] | null> {
        this.bookingRepository = await BookingRepository.getInstance();
        return this.bookingRepository.getAllById(userId);
    }

    public async getOneBooking(id: string): Promise<Booking | null> {
        this.bookingRepository = await BookingRepository.getInstance();
        return this.bookingRepository.getOne(id);
    }

    public async reserve(booking: Booking): Promise<Booking | null> {
        this.bookingRepository = await BookingRepository.getInstance();
        return this.bookingRepository.insert(booking);
    }

    public async update(id: string, booking: Booking): Promise<Booking | null> {
        this.bookingRepository = await BookingRepository.getInstance();
        return this.bookingRepository.update(id, booking);
    }

    public async remove(id: string): Promise<string | null> {
        this.bookingRepository = await BookingRepository.getInstance();
        return this.bookingRepository.delete(id);
    }    
}
