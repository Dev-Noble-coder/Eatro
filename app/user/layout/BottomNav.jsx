"use client"

import { Home, ShoppingBag, Truck, Settings } from 'lucide-react';
import { useState } from 'react';
import GlassBG from './GlassBG';

export default function BottomNav() {
    const [activeTab, setActiveTab] = useState('home');

    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'orders', icon: ShoppingBag, label: 'Orders' },
        { id: 'delivery', icon: Truck, label: 'Delivery' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <nav className="fixed bottom-5 left-1/2 transform -translate-x-1/2  z-50 ">
            <div className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20" >

                <div className="flex items-center  px-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex flex-col items-center  transition-all duration-300 px-6.5 cursor-pointer py-2  ${isActive ? 'text-white/60 bg-[#A31621]/40  rounded-4xl my-1' : 'text-white/90'
                                    }`}
                            >
                                <Icon
                                    size={20}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className="transition-all duration-300"
                                />
                                <span className={`text-xs font-medium transition-all duration-300 ${isActive ? 'opacity-100 text-white/40' : 'opacity-70'
                                    }`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
