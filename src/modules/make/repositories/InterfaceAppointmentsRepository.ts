import InterfaceCreateAppointmentDTO from '@modules/maker/dtos/InterfaceCreateAppointmentDTO';
import InterfaceFindAllInMonthFromPoviderDTO from '@modules/maker/dtos/InterfaceFindAllInMonthFromPoviderDTO';
import InterfaceFindAllInDayFromPoviderDTO from '@modules/maker/dtos/InterfaceFindAllInDayFromPoviderDTO';

import Appointment from '@modules/make/infra/typeorm/entities/Appointment';

export default interface InterfaceAppointmentsRepository {
    createAndSave(data: InterfaceCreateAppointmentDTO): Promise<Appointment>;
    findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined>;
    findAllInMonthFromProvider(
        data: InterfaceFindAllInMonthFromPoviderDTO,
    ): Promise<Appointment[]>;
    findAllInDayFromProvider(
        data: InterfaceFindAllInDayFromPoviderDTO,
    ): Promise<Appointment[]>;
}
