import React, { useState } from "react";
import { FaFilePdf, FaPlus, FaSearch, FaTimes } from "react-icons/fa";

const SearchControls = ({ search, setSearch, handleAddItem, handleReport }) => {
  const [searchError, setSearchError] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    
    // Search validation
    if (value.length > 100) {
      setSearchError("Search query is too long (max 100 characters)");
      return;
    }
    
    // Allow only letters, numbers, spaces, and basic punctuation
    if (!/^[a-zA-Z0-9\s\-_.,()&]*$/.test(value)) {
      setSearchError("Search can only contain letters, numbers, spaces, hyphens, underscores, periods, commas, parentheses, and ampersands");
      return;
    }
    
    setSearchError("");
    setSearch(value);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchError("");
  };

  return (
    <div className="mb-6 sm:mb-8 relative group">
      {/* Background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#d87706] via-[#b5530a] to-[#d87706] rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>

      {/* Main container */}
      <div className="relative bg-gradient-to-br from-white via-orange-50/30 to-white backdrop-blur-sm border border-white/50 rounded-2xl p-5 sm:p-6 shadow-xl shadow-orange-100/20">
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#d87706] via-[#b5530a] to-[#d87706] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-full h-full bg-gradient-to-br from-white via-orange-50/30 to-white rounded-2xl"></div>
        </div>

        <div className="relative flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between">
          {/* Search Section */}
          <div className="flex-1 max-w-full lg:max-w-lg">
            <div className="relative group/search">
              {/* Search input glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d87706] to-[#b5530a] rounded-xl blur opacity-0 group-focus-within/search:opacity-30 transition-opacity duration-300"></div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <FaSearch className="text-[#d87706] text-lg group-focus-within/search:text-[#b5530a] transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search inventory items..."
                  value={search}
                  onChange={handleSearchChange}
                  className={`w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-0 focus:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-medium placeholder-orange-400/70 ${
                    searchError ? 'border-red-300 focus:border-red-500' : 'border-orange-200/50 focus:border-[#d87706] hover:border-[#b5530a]'
                  }`}
                  maxLength="100"
                />
                {/* Clear button */}
                {search && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    title="Clear search"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                )}
                {/* Animated underline */}
                <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#d87706] to-[#b5530a] scale-x-0 group-focus-within/search:scale-x-100 transition-transform duration-300 origin-left ${
                  searchError ? 'bg-gradient-to-r from-red-500 to-red-600' : ''
                }`}></div>
              </div>
              
              {/* Search error message */}
              {searchError && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <span>⚠️</span>
                  {searchError}
                </p>
              )}
              
              {/* Search helper text */}
              <p className="mt-1 text-xs text-gray-500">
                Search by item name, category, or supplier
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            {/* Add Item Button */}
            <button
              onClick={handleAddItem}
              className="group/btn relative overflow-hidden bg-gradient-to-r from-[#d87706] to-[#b5530a] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#b5530a] to-[#d87706] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg group-hover/btn:bg-white/30 transition-colors duration-300">
                  <FaPlus className="text-sm" />
                </div>
                <span className="text-sm sm:text-base">Add Item</span>
              </div>
              {/* Button shine effect */}
              <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
            </button>

            {/* Modern PDF Report Button */}
            <button
              onClick={handleReport}
              className="group/btn relative overflow-hidden bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-4 border-2 border-red-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                <div className="p-1.5 bg-white/20 rounded-lg group-hover/btn:bg-white/30 transition-colors duration-300">
                  <FaFilePdf className="text-sm" />
                </div>
                <span className="text-sm sm:text-base font-bold">Download PDF Report</span>
              </div>
              {/* Enhanced shine effect */}
              <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              {/* Pulsing border effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-red-300/50 animate-pulse opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 flex gap-1 opacity-20">
          <div className="w-1 h-1 bg-[#d87706] rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-[#b5530a] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-[#d87706] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SearchControls;