import React from "react";

const DeletePage = () => {
  return (
    <div className="max-w-xl mx-auto my-12 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-center text-2xl font-semibold text-pink-600 mb-6">
        Steps to Delete Account
      </h1>

      <ol className="list-decimal pl-5 space-y-6 text-base text-gray-700">
        <li>
          Then tap on <span className="bg-pink-600 text-white px-2 py-0.5 rounded">Delete</span>.
        </li>
        <div className="text-center">
          <img
            src="https://i.ibb.co/XZLgwVY4/Screenshot-at-Jul-22-11-10-34.png"
            alt="Delete Account Illustration"
            className="h-72 mx-auto rounded-md"
          />
        </div>

        <li>A pop-up will appear; provide your password in the password field.</li>
        <div className="text-center">
          <img
            src="https://i.ibb.co/ksDRNMRM/Screenshot-at-Jul-22-11-11-57.png"
            alt="Password Input Illustration"
            className="h-72 mx-auto rounded-md"
          />
        </div>

        <li>
          Press the <span className="bg-pink-600 text-white px-2 py-0.5 rounded">Done</span> button.
        </li>
        <div className="text-center">
          <img
            src="https://i.ibb.co/ptCCmjG/Screenshot-at-Jul-22-11-11-25.png"
            alt="Done Button Illustration"
            className="h-72 mx-auto rounded-md"
          />
        </div>

        <li>Your account will be deleted successfully.</li>
      </ol>

      <footer className="text-center text-sm text-gray-500 mt-10">
        © 2024 Memorial Moments. All rights reserved.
      </footer>
    </div>
  );
};

export default DeletePage;
