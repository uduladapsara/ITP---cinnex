import React, { useState } from "react";
import { FaBox, FaEdit, FaTrash, FaExclamationTriangle, FaShoppingCart, FaCalendarAlt, FaClock } from "react-icons/fa";

const InventoryItem = ({
  item,
  getStatusColor,
  getCategoryColor,
  handleEditItem,
  handleDeleteItem,
  handleAllocateToResponse
}) => {
  // Determine item status
  const isLowStock = item.status === 'Low Stock';
  const expiryDate = item.expireDate ? new Date(item.expireDate) : null;
  const isExpired = expiryDate && expiryDate < new Date();

  return (
    <div className="group relative">
      {/* Main card */}
      <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Status indicator */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          isLowStock ? 'bg-amber-500' :
          isExpired ? 'bg-red-500' :
          'bg-blue-500'
        }`}></div>

        <div className="relative p-4">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isLowStock ? 'bg-amber-100 text-amber-600' :
                isExpired ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <FaBox className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600">{item.supplier}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
            </div>
          </div>

          {/* Quantity Section */}
          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Current Stock</span>
                <span className={`text-lg font-bold ${
                  isLowStock ? 'text-amber-600' : 'text-gray-900'
                }`}>
                  {item.quantity} <span className="text-sm font-normal text-gray-600">{item.unit}</span>
                </span>
              </div>
              {isLowStock && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1.5 text-amber-700 mb-2">
                    <FaExclamationTriangle className="text-xs" />
                    <span className="text-xs font-medium">Low Stock Alert</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <FaShoppingCart className="text-amber-600 text-xs" />
                      <span className="text-xs font-medium text-amber-800">REORDER QUANTITY</span>
                    </div>
                    <span className="text-sm font-bold text-amber-900">
                      {Math.max(0, parseFloat(item.reorderLevel) - parseFloat(item.quantity) + 5)} {item.unit}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description - only if it exists */}
          {item.description && (
            <div className="mb-4">
              <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3 border border-gray-200">
                {item.description}
              </p>
            </div>
          )}

          {/* Date Cards */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <FaCalendarAlt className="text-gray-600 text-xs" />
                <span className="text-xs font-medium text-gray-700">MANUFACTURE</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {item.manufactureDate ? new Date(item.manufactureDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'Not specified'}
              </div>
            </div>

            <div className={`border rounded-lg p-3 ${
              isExpired
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-1.5 mb-1">
                <FaClock className={`text-xs ${isExpired ? 'text-red-600' : 'text-gray-600'}`} />
                <span className={`text-xs font-medium ${isExpired ? 'text-red-700' : 'text-gray-700'}`}>
                  EXPIRY
                </span>
              </div>
              <div className={`text-sm font-medium ${isExpired ? 'text-red-900' : 'text-gray-900'}`}>
                {item.expireDate ? new Date(item.expireDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'Not specified'}
                {isExpired && (
                  <span className="ml-1 text-xs text-red-600 font-bold">(EXPIRED)</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditItem(item);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 py-2 px-4 flex items-center justify-center gap-2"
            >
              <FaEdit className="text-sm" />
              <span>Edit</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(item._id);
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 py-2 px-4 flex items-center justify-center gap-2"
            >
              <FaTrash className="text-sm" />
              <span>Delete</span>
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAllocateToResponse(item);
            }}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors duration-200 py-2.5 px-4 flex items-center justify-center gap-2"
          >
            <FaBox className="text-sm" />
            <span>Allocate to Response</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;