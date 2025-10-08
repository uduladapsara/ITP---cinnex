import React, { useEffect, useState } from "react";
import http from "../../api/http";
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function InventoryManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "harvest",
    quantity: "",
    unit: "kg",
    price: "",
    reorderLevel: "",
    description: "",
    supplier: "",
  });

  // Prepare chart data
  const barChartData = {
    labels: items.map(item => item.name),
    datasets: [
      {
        label: 'Quantity',
        data: items.map(item => item.quantity),
        backgroundColor: 'rgba(181, 83, 10, 0.6)',
        borderColor: 'rgba(181, 83, 10, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inventory Quantities',
      },
    },
  };

  const pieChartData = {
    labels: ['Harvest', 'Resource', 'Final Product'],
    datasets: [
      {
        data: [
          items.filter(item => item.category === 'harvest').length,
          items.filter(item => item.category === 'resource').length,
          items.filter(item => item.category === 'final product').length,
        ],
        backgroundColor: [
          'rgba(181, 83, 10, 0.7)',
          'rgba(216, 119, 6, 0.7)',
          'rgba(245, 158, 11, 0.7)',
        ],
        borderColor: [
          'rgba(181, 83, 10, 1)',
          'rgba(216, 119, 6, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Items by Category',
      },
    },
  };

  // Fetch inventory items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await http.get("/inventory");
      setItems(response.data);
    } catch (err) {
      setError("Failed to load inventory items");
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "harvest",
      quantity: "",
      unit: "kg",
      price: "",
      reorderLevel: "",
      description: "",
      supplier: "",
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await http.post("/inventory", formData);
      setShowAddModal(false);
      resetForm();
      fetchItems();
      alert("Item added successfully!");
    } catch (err) {
      alert("Failed to add item: " + err.response?.data?.error || err.message);
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      await http.put(`/inventory/${editingItem._id}`, formData);
      setShowEditModal(false);
      setEditingItem(null);
      resetForm();
      fetchItems();
      alert("Item updated successfully!");
    } catch (err) {
      alert("Failed to update item: " + err.response?.data?.error || err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await http.delete(`/inventory/${itemId}`);
      fetchItems();
      alert("Item deleted successfully!");
    } catch (err) {
      alert("Failed to delete item: " + err.response?.data?.error || err.message);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price || "",
      reorderLevel: item.reorderLevel,
      description: item.description,
      supplier: item.supplier,
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available': return '✅';
      case 'Low Stock': return '⚠️';
      case 'Out of Stock': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-9 h-9 bg-[#b5530c] rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-lg font-bold">C</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Cinnex</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => window.location.href = "/inventory"}
                className="text-[#b5530c] px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-[#b5530c]"
              >
                Inventory Management
              </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <div className="text-center">
              {/* Main Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#b5530c] rounded-lg mb-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Inventory Management
              </h1>

              {/* Subtitle */}
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-gray-600 mb-4">
                  Track and manage your plantation inventory efficiently
                </p>
                <div className="w-16 h-1 bg-[#b5530c] mx-auto rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          {!loading && !error && items.length > 0 && (
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-shadow duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#b5530c] text-white rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Inventory Quantities</h3>
                    </div>
                    <div className="h-64">
                      <Bar data={barChartData} options={barChartOptions} />
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-shadow duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#b5530c] text-white rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Items by Category</h3>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                      <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">Unable to Load Inventory</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Inventory Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Item Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${
                          item.category === "harvest" ? "bg-[#b5530c] text-white" :
                          item.category === "resource" ? "bg-[#d87706] text-white" :
                          "bg-[#f59e0b] text-white"
                        }`}>
                          {item.category === "harvest" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          )}
                          {item.category === "resource" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          {item.category === "final product" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-600 font-medium uppercase">
                            {item.category.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Item Details */}
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Item ID</p>
                            <p className="text-sm font-mono text-gray-800">{item.itemId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Price</p>
                            <p className="text-sm font-semibold text-green-600">${item.price?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Quantity</p>
                            <p className="text-sm font-medium text-gray-800">{item.quantity} {item.unit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Reorder Level</p>
                            <p className="text-sm font-medium text-[#b5530c]">{item.reorderLevel} {item.unit}</p>
                          </div>
                        </div>
                      </div>
                      
                      {item.supplier && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Supplier</span>
                          <span className="font-medium text-gray-800">{item.supplier}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openEditModal(item)}
                        className="flex-1 bg-[#b5530c] hover:bg-[#a44a0a] text-white py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && items.length === 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center max-w-md mx-auto">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#b5530c] text-white rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">No Inventory Items Yet</h3>
              <p className="text-gray-600 mb-6">Start building your inventory by adding your first item. Track stock levels, manage prices, and organize your resources efficiently.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#b5530c] hover:bg-[#a44a0a] text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Add First Item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Add New Item</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddItem} className="p-4 space-y-3 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="harvest">Harvest</option>
                  <option value="resource">Resource</option>
                  <option value="final product">Final Product</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                  <select
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                    <option value="pieces">pieces</option>
                    <option value="boxes">boxes</option>
                    <option value="bags">bags</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per {formData.unit} *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                <input
                  type="number"
                  min="0"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({...formData, reorderLevel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Supplier name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  placeholder="Item description"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-[#b5530c] hover:bg-[#a44a0a] text-white rounded-md transition-colors duration-200 text-sm font-medium"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Edit Item</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEditItem} className="p-4 space-y-3 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="harvest">Harvest</option>
                  <option value="resource">Resource</option>
                  <option value="final product">Final Product</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                  <select
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                    <option value="pieces">pieces</option>
                    <option value="boxes">boxes</option>
                    <option value="bags">bags</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per {formData.unit} *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                <input
                  type="number"
                  min="0"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({...formData, reorderLevel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Supplier name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  placeholder="Item description"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-[#b5530c] hover:bg-[#a44a0a] text-white rounded-md transition-colors duration-200 text-sm font-medium"
                >
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
