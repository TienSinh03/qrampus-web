import React from "react";

export default function ReportPage() {
    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    Báo cáo Power BI
                </h1>

                <div className="w-full h-[80vh] bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                    <iframe
                        title="PowerBI Report"
                        className="w-full h-full"
                        src="https://app.powerbi.com/reportEmbed?reportId=55e88409-c38f-475a-9711-63ae03a6f6fb&autoAuth=true&ctid=948ae523-08bd-414e-a287-22da3e46c1eb"
                        allowFullScreen={true}
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
