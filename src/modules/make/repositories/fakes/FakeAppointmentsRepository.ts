import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import InterfaceAppointmentsRepository from '@modules/make/repositories/InterfaceAppointmentsRepository';
import InterfaceCreateAppointmentDTO from '@modules/maker/dtos/InterfaceCreateAppointmentDTO';
import InterfaceFindAllInMonthFromPoviderDTO from '@modules/maker/dtos/InterfaceFindAllInMonthFromPoviderDTO';
import InterfaceFindAllInDayFromPoviderDTO from '@modules/maker/dtos/InterfaceFindAllInDayFromPoviderDTO';

import Appointment from '@modules/make/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements InterfaceAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(
            appointment =>
                isEqual(appointment.date, date) &&
                appointment.providerId == providerId,
        );

        return findAppointment;
    }

    public async findAllInMonthFromProvider({
        providerId,
        month,
        year,
    }: InterfaceFindAllInMonthFromPoviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(
            appointment =>
                appointment.providerId === providerId &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year,
        );

        return appointments;
    }

    public async findAllInDayFromProvider({
        providerId,
        day,
        month,
        year,
    }: InterfaceFindAllInDayFromPoviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(
            appointment =>
                appointment.providerId === providerId &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year &&
                getDate(appointment.date) === day,
        );

        return appointments;
    }

    public async createAndSave({
        providerId,
        date,
        userId,
    }: InterfaceCreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), date, providerId, userId });

        this.appointments.push(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
