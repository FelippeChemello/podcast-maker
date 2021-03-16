import { getRepository, Repository, Raw } from 'typeorm';

import InterfaceAppointmentsRepository from '@modules/make/repositories/InterfaceAppointmentsRepository';
import InterfaceCreateAppointmentDTO from '@modules/maker/dtos/InterfaceCreateAppointmentDTO';
import InterfaceFindAllInMonthFromPoviderDTO from '@modules/maker/dtos/InterfaceFindAllInMonthFromPoviderDTO';
import InterfaceFindAllInDayFromPoviderDTO from '@modules/maker/dtos/InterfaceFindAllInDayFromPoviderDTO';

import Appointment from '@modules/make/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements InterfaceAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: {
                date,
                providerId,
            },
        });

        return findAppointment;
    }

    public async findAllInMonthFromProvider({
        providerId,
        month,
        year,
    }: InterfaceFindAllInMonthFromPoviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');
        const parsedYear = String(year).padStart(4, '0');

        const appointments = await this.ormRepository.find({
            where: {
                providerId,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${parsedYear}'`,
                ),
            },
        });

        return appointments;
    }

    public async findAllInDayFromProvider({
        providerId,
        day,
        month,
        year,
    }: InterfaceFindAllInDayFromPoviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');
        const parsedYear = String(year).padStart(4, '0');

        const appointments = await this.ormRepository.find({
            where: {
                providerId,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${parsedYear}'`,
                ),
            },
            relations: ['user'],
        });

        return appointments;
    }

    public async createAndSave({
        providerId,
        userId,
        date,
    }: InterfaceCreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            providerId,
            userId,
            date,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
