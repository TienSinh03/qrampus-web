import React from "react";
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{t('dashboardPage.title')}</h1>
        <p className="text-gray-600 mt-2">{t('dashboardPage.welcomeMessage')}</p>
      </div>
     
    </div>
  );
};

export default DashboardPage;
