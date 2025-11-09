import React from 'react'
import AppLayout from '@/app/restaurant/layout/AppLayout'

const page = async({params}) => {

  const completedOrders = [
    {
      id: 1,
      name: "Pounded Yam & Egusi",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvJm3oF0NEj2-3iQUvoStknLqRXZL3AclnzgOFGPLzO4pFnLKsOqjTFQe7Iw8ZmxRb7EI&usqp=CAU",
      quantity: "1 plate",
      price: "₦2,800",
    },
    {
      id: 2,
      name: "Fried Rice & Turkey",
      image:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
      quantity: "2 plates",
      price: "₦4,000",
    },
    {
      id: 3,
      name: "Beans & Plantain",
      image:
        "https://media.istockphoto.com/id/1198712283/photo/chile.webp?a=1&b=1&s=612x612&w=0&k=20&c=YunbqqErACUq3_jlV0xDsfTz2IrAZ5S3AUTFUfPvRFA=",
      quantity: "3 plates",
      price: "₦4,500",
    },
    {
      id: 4,
      name: "Jollof Rice & Chicken",
      image:
        "https://plus.unsplash.com/premium_photo-1694141252774-c937d97641da?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600",
      quantity: "2 plates",
      price: "₦3,200",
    },
    {
      id: 5,
      name: "Spaghetti Bolognese",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_d7U7azBd3LeDGooqwgaiZwK_NT20IrciB21AXbwCwORu641xipHgOaIUebwQJTlX_kw&usqp=CAU",
      quantity: "1 plate",
      price: "₦2,500",
    },
    {
      id: 6,
      name: "Yam & Egg Sauce",
      image:
        "https://media.istockphoto.com/id/1198712283/photo/chile.webp?a=1&b=1&s=612x612&w=0&k=20&c=YunbqqErACUq3_jlV0xDsfTz2IrAZ5S3AUTFUfPvRFA=",
      quantity: "1 plate",
      price: "₦1,800",
    },
  ]

  const { id } = await params;

  const completedOrder = completedOrders.find(
      (order) => order.id === parseInt(id)
  );

  if (!completedOrder) return <p className="text-white">Order not found</p>;

  return (
    <>
    <AppLayout>
        <p>{completedOrder.name}</p>
    </AppLayout>
</>
  )
}

export default page