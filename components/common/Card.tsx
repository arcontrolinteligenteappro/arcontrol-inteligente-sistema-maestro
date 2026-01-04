
import React from 'react';

interface CardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
    trendColor: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, trend, trendColor }) => {
    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-green-500/20 shadow-lg shadow-green-900/10 rounded-lg p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400 uppercase">{title}</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">{value}</p>
                </div>
                <div className="p-3 bg-green-900/50 text-green-400 rounded-full">
                    {icon}
                </div>
            </div>
            <div className="mt-4">
                <p className={`text-sm font-semibold ${trendColor}`}>
                    {trend}
                </p>
            </div>
        </div>
    );
};

export default Card;
