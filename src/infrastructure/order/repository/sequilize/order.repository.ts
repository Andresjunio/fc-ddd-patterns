import Order from "../../../../domain/order/entity/order";
import OrderItem from "../../../../domain/order/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/order/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface{
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize;
    await sequelize.transaction(async (t) => {
      await OrderItemModel.destroy({
        where: {
          order_id: entity.id
        },
        transaction: t,
      });
      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name, 
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));
      await OrderItemModel.bulkCreate(items, {
        transaction: t});
      await OrderModel.update(
        {total: entity.total()},
        { where: {id: entity.id}, transaction: t}
      );
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ where: {id}, include: [OrderItemModel] }); 
    const orderItems: OrderItem[] = [];
    orderModel.items.forEach(item => {
      orderItems.push(new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
    });
    
    return new Order(orderModel.id, orderModel.customer_id, orderItems); 
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({include: [OrderItemModel]});
    return orders.map(orderModel => {
      const items: OrderItem[] = [];
      orderModel.items.forEach(item => {
        items.push(new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
      });
      return new Order(orderModel.id, orderModel.customer_id, items);
    });
  }
  

}
