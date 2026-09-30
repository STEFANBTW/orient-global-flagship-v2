import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cmsApi } from '@/services/cmsApi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const OrderDetails: React.FC = () => {
 const { orderId } = useParams<{ orderId: string }>();
 const navigate = useNavigate();
 const [order, setOrder] = useState<any>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (orderId) {
 fetchOrder();
 }
 }, [orderId]);

 const fetchOrder = async () => {
 try {
 const data = await cmsApi.getOrderById(orderId!);
 setOrder(data);
 } catch (error) {
 console.error('Failed to fetch order:', error);
 } finally {
 setLoading(false);
 }
 };

 if (loading) return <div>Loading order details...</div>;
 if (!order) return <div>Order not found.</div>;

 return (
 <div className="p-8 space-y-6">
 <Button onClick={() => navigate(-1)}>Back to Orders</Button>
 <Card>
 <CardHeader>
 <CardTitle>Order Details: {order.id}</CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
 <div><strong>Status:</strong> <Badge>{order.status}</Badge></div>
 <div><strong>Total:</strong> ₦{order.totalAmount?.toLocaleString()}</div>
 <div><strong>Shipping Address:</strong> {order.shippingAddress}</div>
 </div>
 <div>
 <strong>Items:</strong>
 <ul className="list-disc pl-5 mt-2">
 {order.items.map((item: any, index: number) => (
 <li key={index}>
 {item.name} - {item.quantity} x ₦{item.price.toLocaleString()}
 </li>
 ))}
 </ul>
 </div>
 </CardContent>
 </Card>
 </div>
 );
};

export default OrderDetails;
