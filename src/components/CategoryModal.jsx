import { Spin } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { IoMdClose } from "react-icons/io";

const CategoryModal = ({
  handleFileChange,
  handleModalToggle,
  previewUrl,
  categoryData,
  setCategoryData,
  setErrors,
  errors,
  selectedFile,
  handleEdit,
  loading,
}) => {
  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-gray-800 bg-opacity-70"
          onClick={() => handleModalToggle("edit", false)}
        />

        {/* Modal Container */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md p-6 mx-auto bg-white rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute text-gray-500 transition-colors top-4 right-4 hover:text-gray-700"
                onClick={() => handleModalToggle("edit", false)}
              >
                <IoMdClose size={24} />
              </button>

              <div className="text-center">
                {/* Image Preview Circle */}
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-50">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Category preview"
                      className="object-contain w-14 h-14"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-14 h-14">
                      <svg
                        viewBox="0 0 24 24"
                        fill="#E7A74E"
                        width="100%"
                        height="100%"
                      >
                        <path d="M3,3H21a1,1,0,0,1,1,1V20a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V4A1,1,0,0,1,3,3M7.5,10A1.5,1.5,0,1,0,6,8.5,1.5,1.5,0,0,0,7.5,10M22,8V6L15,11,9,8,0,14V16L9,10,15,13Z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                {/* Category Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-800">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryData.name}
                    onChange={(e) => {
                      setCategoryData({
                        ...categoryData,
                        name: e.target.value,
                      });
                      if (e.target.value.trim()) {
                        setErrors({ ...errors, categoryName: "" });
                      }
                    }}
                    placeholder="Enter Your Category Name"
                    className={`w-full px-4 py-2 border border-primary rounded focus:outline-none focus:ring-1 
                          ${
                            errors.categoryName
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-primary"
                          }`}
                  />
                  {errors.categoryName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.categoryName}
                    </p>
                  )}
                </div>

                {/* Category Picture */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-800">
                    Category Picture
                  </label>
                  <div
                    className={`flex items-center w-full px-2 py-2 border border-primary rounded 
                        ${errors.file ? "border-red-500" : "border-gray-300"}`}
                  >
                    <label
                      htmlFor="fileInput"
                      className="px-3 py-1 text-sm border rounded cursor-pointer hover:bg-gray-50"
                    >
                      Choose File
                    </label>
                    <span className="max-w-xs ml-2 text-sm text-gray-500 truncate">
                      {selectedFile ? selectedFile.name : "No file Chosen"}
                    </span>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  {errors.file && (
                    <p className="mt-1 text-sm text-red-500">{errors.file}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleEdit}
                  className="w-full py-3 mt-4 font-medium text-white transition-colors rounded bg-amber-600 hover:bg-amber-700"
                >
                  {loading ? <Spin size="small" /> : "Done"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    </AnimatePresence>
  );
};

export default CategoryModal;
