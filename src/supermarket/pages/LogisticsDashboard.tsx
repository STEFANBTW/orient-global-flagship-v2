import React, { useEffect, useState } from 'react';
import { cmsApi } from '@/services/cmsApi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LogisticsDashboard: React.FC = () => {
 const [orders, setOrders] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetchShippedOrders();
 }, []);

 const fetchShippedOrders = async () => {
 try {
 const data = await cmsApi.getOrders();
 // Filter orders that are 'shipped'
 const shippedOrders = data.orders.filter((o: any) => o.status === 'shipped');
 setOrders(shippedOrders || []);
 } catch (error) {
 console.error('Failed to fetch shipped orders:', error);
 } finally {
 setLoading(false);
 }
 };

 const generateLabel = (orderId: string) => {
 alert(`Generating shipping label for order: ${orderId}`);
 };

 return (
 <Card className="w-full">
 <CardHeader>
 <CardTitle>Logistics Dashboard (Shipped Orders)</CardTitle>
 </CardHeader>
 <CardContent>
 {loading ? (
 <div>Loading...</div>
 ) : (
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Order ID</TableHead>
 <TableHead>Shipping Address</TableHead>
 <TableHead>Status</TableHead>
 <TableHead>Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {orders.map((order) => (
 <TableRow key={order.id}>
 <TableCell>{order.id}</TableCell>
 <TableCell>{order.shippingAddress}</TableCell>
 <TableCell><Badge>{order.status}</Badge></TableCell>
 <TableCell>
 <Button variant="outline" size="sm" onClick={() => generateLabel(order.id)}>
 Print Label
 </Button>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 )}
 </CardContent>
 </Card>
 );
};

export default LogisticsDashboard;
