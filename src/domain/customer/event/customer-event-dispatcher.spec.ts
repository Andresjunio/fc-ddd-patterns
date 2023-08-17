import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerChangedAdressEvent from "./customer-changed-adress.event";
import CustomerCreatedEvent from "./customer-created.event";
import SendConsoleLogWhenAdressIsChanged from "./handler/changed-adresss.handler";
import SendConsoleLog1Handler from "./handler/send-consolelog-1.handler";
import SendConsoleLog2Handler from "./handler/send-consolelog-2.handler";

describe("Customer events tests", () => {
    it("should register an customer console log 1 event handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendConsoleLog1Handler();
  
      eventDispatcher.register("CustomerCreatedEvent", eventHandler);
  
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
      ).toBeDefined();
      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
        1
      );
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandler);
    });

    it("should register an customer console log 2 event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLog2Handler();
    
        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    
        expect(
          eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
          1
        );
        expect(
          eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler);
      });
    
  
    it("should unregister an customer console log 1 event handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendConsoleLog1Handler();
  
      eventDispatcher.register("CustomerCreatedEvent", eventHandler);
  
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandler);
  
      eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);
  
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
      ).toBeDefined();
      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
        0
      );
    });

    it("should unregister an customer console log 2 event handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendConsoleLog2Handler();
  
      eventDispatcher.register("CustomerCreatedEvent", eventHandler);
  
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandler);
  
      eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);
  
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
      ).toBeDefined();
      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
        0
      );
    });
  
    it("should unregister all customer created event handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler1 = new SendConsoleLog1Handler();
      const eventHandler2 = new SendConsoleLog2Handler();

      eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
      eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
  
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandler1);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
      ).toMatchObject(eventHandler2);
  
      eventDispatcher.unregisterAll();
  
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
      ).toBeUndefined();
    });

  
    it("should notify all event handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler1 = new SendConsoleLog1Handler();
      const eventHandler2 = new SendConsoleLog2Handler();
      const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
      const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
  
      eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
      eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
  
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandler1);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
      ).toMatchObject(eventHandler2);

      const adress1 = new Address("Street 1",1,"12345", "City 1");
      const adress2 = new Address("Street 2",2,"98765", "City 2");

      const customer1 = new Customer("123", "Customer 1");
      customer1.changeAddress(adress1);
      const customer2 = new Customer("456", "Customer 2");
      customer2.changeAddress(adress2);

      const customer1CreatedEvent = new CustomerCreatedEvent(customer1);
      const customer2CreatedEvent = new CustomerCreatedEvent(customer2);  

      eventDispatcher.notify(customer1CreatedEvent);
      eventDispatcher.notify(customer2CreatedEvent);
    
      expect(spyEventHandler1).toHaveBeenCalled();
      expect(spyEventHandler2).toHaveBeenCalled();
    });

    it("should notify if customer address is changed", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler1 = new SendConsoleLog1Handler();
      const eventHandler2 = new SendConsoleLogWhenAdressIsChanged();
      const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
      const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

      eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
      eventDispatcher.register("CustomerChangedAdressEvent", eventHandler2);
      
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandler1);

      expect(
        eventDispatcher.getEventHandlers["CustomerChangedAdressEvent"][0]
      ).toMatchObject(eventHandler2);

      const customer = new Customer("123", "Customer 1");
      const address1 = new Address("Street 1",1,"12345", "City 1");
      customer.changeAddress(address1);
      
      const customerCreatedEvent = new CustomerCreatedEvent(customer);
      eventDispatcher.notify(customerCreatedEvent);
      expect(spyEventHandler1).toHaveBeenCalled();
      
      const address2 = new Address("Street 2", 2, "98765", "City 2");
      customer.changeAddress(address2);

      const customerChangedAddressEvent = new CustomerChangedAdressEvent(customer);
      eventDispatcher.notify(customerChangedAddressEvent);
      expect(spyEventHandler2).toHaveBeenCalled();
    });
  });
  