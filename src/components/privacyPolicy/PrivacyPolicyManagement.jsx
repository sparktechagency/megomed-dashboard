import { Button } from "antd";
import { useState } from "react";
import ClientPrivacyPolicy from "./ClientPrivacyPolicy";
import FreeLancherPrivacyPolicy from "./FreeLancerPrivacyPolicy";

function PrivacyPolicyManagement() {
  const [activeTab, setActiveTab] = useState("freelancher");
  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-between">
        <div>
          <Button
            type={activeTab === "freelancher" ? "primary" : "default"}
            className={`mr-2 ${
              activeTab === "freelancher" ? "bg-[#002282]" : ""
            }`}
            onClick={() => setActiveTab("freelancher")}
          >
            Privacy Policy
          </Button>
          {/* <Button
            type={activeTab === 'client' ? 'primary' : 'default'}
            className={activeTab === 'client' ? 'bg-[#002282]' : ''}
            onClick={() => setActiveTab('client')}
          >
            client
          </Button> */}
        </div>
      </div>

      <div className=" rounded-md">
        {activeTab === "freelancher" ? (
          <FreeLancherPrivacyPolicy />
        ) : null
        // <ClientPrivacyPolicy />
        }
      </div>
    </div>
  );
}

export default PrivacyPolicyManagement;
