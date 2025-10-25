import React from 'react';

export const VerifyBadge = ({ status, data_id ,onClick }) => {
  const getBadgeInfo = () => {
    console.log("status", status)
    switch (status) {
      case true:
        return {
          label: 'Verified',
          gradient: 'bg-green-600'
        };
      case false:
        return {
          label: 'Un-Verified',
          gradient: 'bg-red-600'
        };
      default:
        return {
          label: 'Unknown',
          gradient: 'bg-gray-400'
        };
    }
  };

  const { label, gradient } = getBadgeInfo();
  return (
    <span
      className={`cursor-pointer bg-gradient-to-tl ${gradient} px-2.5 text-xs rounded-md py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white`}
      onClick={() => onClick(data_id,!status )}
    >
      {label}
    </span>
  );
};
