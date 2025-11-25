import React from "react";

const StatsCard = ({ title, value, percent, positive, icon, iconBg, subtitle }) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-5 flex justify-between items-start border border-slate-100">
            <div>
                <h3 className="text-sm text-slate-500">{title}</h3>
                <div className="flex items-end gap-2 mt-1">
                    <span className="text-3xl font-semibold">{value}</span>
                    <span className={`text-sm font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
                        {percent}
                    </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
            </div>

            <div className={`p-3 rounded-lg ${iconBg}`}>
                {icon}
            </div>
        </div>
    );
};

export default StatsCard;
