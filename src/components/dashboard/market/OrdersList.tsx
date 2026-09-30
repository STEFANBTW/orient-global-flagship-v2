import React, { useEffect, useState } from 'react';
import { cmsApi } from '@/services/cmsApi';
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useRoles } from '@/context/role-context';
import { useNotifications } from '@/context/NotificationContext';

const OrdersList: React.FC = () => {
 const [orders, setOrders] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const { toast } = useToast();
 const { currentUser } = useRoles();
 const { addNotification } = useNotifications();

 const isHOD = currentUser?.role === 'boss' || currentUser?.role === 'hod';

 useEffect(() => {
 fetchOrders();
 }, [currentUser]);

 const fetchOrders = async () => {
 try {
 const data = await cmsApi.getOrders();
 // If not HOD, filter orders to only show their own
 const filteredOrders = isHOD 
 ? data.orders 
 : data.orders.filter((o: any) => o.customerId === currentUser?.id);
 setOrders(filteredOrders || []);
 } catch (error) {
 console.error('Failed to fetch orders:', error);
 } finally {
 setLoading(false);
 }
 };

 const handleStatusChange = async (orderId: string, newStatus: string) => {
 if (!isHOD) return;
 try {
 await cmsApi.updateOrder(orderId, { status: newStatus });
 setOrders(orders.map(order => 
 order.id === orderId ? { ...order, status: newStatus } : order
 ));
 toast({
 title: "Status Updated",
 description: `Order ${orderId} status changed to ${newStatus}.`,
 });
 addNotification({
 title: "Order Status Updated",
 message: `Order ${orderId} is now ${newStatus}.`,
 type: 'success'
 });
 } catch (error) {
 toast({
 title: "Update Failed",
 description: "Could not update order status.",
 variant: "destructive"
 });
 }
 };

 return (
 <Card className="w-full">
 <CardHeader>
 <CardTitle>Recent Orders</CardTitle>
 </CardHeader>
 <CardContent>
 {loading ? (
 <div className="flex justify-center p-8">Loading orders...</div>
 ) : (
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Order ID</TableHead>
 <TableHead>Date</TableHead>
 {isHOD && <TableHead>Customer</TableHead>}
 <TableHead>Total</TableHead>
 <TableHead>Status</TableHead>
 <TableHead>Items</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {orders.length === 0 ? (
 <TableRow>
 <TableCell colSpan={isHOD ? 6 : 5} className="text-center py-8 text-muted-foreground">
 No orders found.
 </TableCell>
 </TableRow>
 ) : (
 orders.map((order) => (
 <TableRow key={order.id}>
 <TableCell className="font-mono text-xs">{order.id}</TableCell>
 <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
 {isHOD && <TableCell>{order.customerId}</TableCell>}
 <TableCell className="font-bold">₦{order.totalAmount?.toLocaleString() || 0}</TableCell>
 <TableCell>
 {isHOD ? (
 <Select
 value={order.status}
 onValueChange={(value) => handleStatusChange(order.id, value)}
 >
 <SelectTrigger className="w-[130px] h-8 text-xs">
 <SelectValue placeholder="Status" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="pending">Pending</SelectItem>
 <SelectItem value="processing">Processing</SelectItem>
 <SelectItem value="shipped">Shipped</SelectItem>
 <SelectItem value="delivered">Delivered</SelectItem>
 <SelectItem value="cancelled">Cancelled</SelectItem>
 </SelectContent>
 </Select>
 ) : (
 <Badge variant={order.status === 'pending' ? 'outline' : 'default'}>
 {order.status}
 </Badge>
 )}
 </TableCell>
 <TableCell>
 <span className="text-xs text-muted-foreground">
 {order.items.length} items
 </span>
 </TableCell>
 </TableRow>
 ))
 )}
 </TableBody>
 </Table>
 )}
 </CardContent>
 </Card>
 );
};

export default OrdersList;
