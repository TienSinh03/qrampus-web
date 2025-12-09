import { useState } from 'react';

const Notification = () => {
    const [showSuccess, setShowSuccess] = useState(true);
    const [showWarning, setShowWarning] = useState(true);
    const [showError, setShowError] = useState(true);
    const [showInfo, setShowInfo] = useState(true);

    const handleClose = (type) => {
        if (type === 'success') setShowSuccess(false);
        if (type === 'warning') setShowWarning(false);
        if (type === 'error') setShowError(false);
        if (type === 'info') setShowInfo(false);
    };

    return (
        <div className="space-y-4">
            {showSuccess && (
                <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg">
                    <div className="flex items-center">
                        <div className="bg-green-500 p-2 rounded-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 text-gray-800">
                            <h3 className="text-xl font-semibold">Thành công!</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                    <button onClick={() => handleClose('success')} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {showWarning && (
                <div className="flex items-center justify-between p-4 bg-yellow-100 rounded-lg">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-2 rounded-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                <path d="M8 2v12l10-6-10-6z" />
                            </svg>
                        </div>
                        <div className="ml-3 text-gray-800">
                            <h3 className="text-xl font-semibold">Cho phép</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                    <button onClick={() => handleClose('warning')} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {showError && (
                <div className="flex items-center justify-between p-4 bg-red-100 rounded-lg">
                    <div className="flex items-center">
                        <div className="bg-red-500 p-2 rounded-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                <path d="M10 2a8 8 0 110 16A8 8 0 0110 2zm1 11h-2v-2h2v2zm0-4h-2V7h2v2z" />
                            </svg>
                        </div>
                        <div className="ml-3 text-gray-800">
                            <h3 className="text-xl font-semibold">Vượt mức</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                    <button onClick={() => handleClose('error')} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {showInfo && (
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center">
                        <div className="bg-gray-500 p-2 rounded-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                <path d="M10 2a8 8 0 110 16A8 8 0 0110 2zm1 11h-2v-2h2v2zm0-4h-2V7h2v2z" />
                            </svg>
                        </div>
                        <div className="ml-3 text-gray-800">
                            <h3 className="text-xl font-semibold">Vượt mức</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                    <button onClick={() => handleClose('info')} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Notification;
