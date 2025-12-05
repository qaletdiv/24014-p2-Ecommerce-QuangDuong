// giả DB 
export let orders = [];
// thêm đơn mới
export function addOrder(order) {
    orders.push(order);
}
export function getOrdersByUser(userId) {
    return orders.filter(o => String(o.userId) === String(userId));
}
