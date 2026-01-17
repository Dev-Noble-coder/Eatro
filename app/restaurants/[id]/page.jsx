import React from 'react'
import AppLayout from '@/components/AppLayout';
import Hero from '@/components/Hero';
import SearchInput from '@/components/SearchInput';
import Specials from '@/components/Specials';
import Filter from '@/components/Filter';
import Meal from '@/components/Meal';


const page = async ({ params }) => {
  const restaurants = [
    {
      id: 1,
      name: "Lacuisine",
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
      bgImage:
        "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 2,
      name: "Sir K",
      image:
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
      bgImage:
        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&q=80",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 3,
      name: "Joked",
      image:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
      bgImage:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 4,
      name: "Bite and Smile",
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
        bgImage:
        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&q=80",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 5,
      name: "Green Garden",
      image:
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
        bgImage:
        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&q=80",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
  ];
  
  const { id } = await params;

  const restaurant = restaurants.find(
    (r) => r.id === parseInt(id)
  );

  if (!restaurant) return <p className="text-white">Restaurant not found</p>;


  return (
    <>
      <AppLayout>
        <Hero bgImage={restaurant.bgImage} route="/user">
        
          <div className="py-14 px-5 text-white">
            <h2 className="text-3xl font-semibold mb-3 ">{restaurant.name}</h2>
            <p className="pb-3">
              {" "}
              Join our growing network of customers! We offer different ranges
              of food, we’d love to serve you...
            </p>
            <p className="text-white/50 ">Place an order to Get Started !</p>
          </div>
        </Hero>
        
        <div className="ml-5 mt-5 mb-3">
          <h2 className="text-xl font-semibold text-gray-900">Food</h2>
        </div>
        <SearchInput />
        <Specials />
        <Filter />
        <Meal restaurantName={restaurant.name} />
      </AppLayout>
    </>
  );
}

export default page