import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedAdressEvent from "../customer-changed-adress.event";

export default class SendConsoleLogWhenAdressIsChanged implements
EventHandlerInterface<CustomerChangedAdressEvent> {
    handle(event: CustomerChangedAdressEvent): void {
        console.log(`Endereço do cliente: {id}, {nome} alterado para: {endereco}`);
    }
}