import { MinusOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Upload
} from "antd";
import { useState } from "react";
import {
  useCreateSubscriptionMutation,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from "../../features/subscription/subscriptionApi";
import ClientSubscription from "./ClientSubscription";
import FreeLacherSubscription from "./FreeLacherSubscription";

function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState("freelancer");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState(0);
  const [planType, setPlanType] = useState("month");
  const [planCategory, setPlanCategory] = useState("freelancer");
  const [planFeatures, setPlanFeatures] = useState([]);
  const [planImage, setPlanImage] = useState(null);
  const [tenderCount, setTenderCount] = useState(3);
  const [jobCount, setJobCount] = useState(3);
  const [isUnlimitedTender, setIsUnlimitedTender] = useState(true);
  const [isUnlimitedJob, setIsUnlimitedJob] = useState(true);
  const [isBadge, setIsBadge] = useState(false);
  const [isSupport, setIsSupport] = useState(false);
  const { data: subscriptions, isLoading, isError } = useGetSubscriptionQuery();
  const [createSubscription] = useCreateSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();

  const freelancerSubscriptions = subscriptions?.data?.filter(
    (subscription) => subscription.category === "freelancer"
  );
  const clientSubscriptions = subscriptions?.data?.filter(
    (subscription) => subscription.category === "client"
  );

  const companySubscriptions = subscriptions?.data?.filter(
    (subscription) => subscription.category === "company"
  );

  const handleCreateSubscription = () => {
    setEditingSubscription(null);
    setPlanName("");
    setPlanPrice(0);
    setPlanType("month");
    setPlanCategory(activeTab);
    setPlanFeatures([]);
    setPlanImage(null);
    setTenderCount(3);
    setJobCount(3);
    setIsUnlimitedTender(true);
    setIsUnlimitedJob(true);
    setIsBadge(false);
    setIsSupport(false);
    setIsModalVisible(true);
  };

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setPlanName(subscription.title);
    setPlanPrice(subscription.price);
    setPlanType(subscription.type);
    setPlanCategory(subscription.category);
    setPlanFeatures(subscription.benefits || []);
    setPlanImage(subscription.image);
    setTenderCount(subscription.tenderCount || 3);
    setJobCount(subscription.jobCount || 3);
    setIsUnlimitedTender(
      subscription.tenderCount === -1 ||
      subscription.tenderCount === "unlimited"
    );
    setIsUnlimitedJob(
      subscription.jobCount === -1 ||
      subscription.jobCount === "unlimited"
    );
    setIsBadge(subscription.isBadge || false);
    setIsSupport(subscription.isSupport || false);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingSubscription(null);
    setPlanName("");
    setPlanPrice(0);
    setPlanType("month");
    setPlanCategory("freelancer");
    setPlanFeatures([]);
    setPlanImage(null);
    setTenderCount(3);
    setJobCount(3);
    setIsUnlimitedTender(true);
    setIsUnlimitedJob(true);
    setIsBadge(false);
    setIsSupport(false);
  };

  const handleSave = async () => {
    // Validate all required fields
    if (!planName.trim()) {
      message.error("Plan name is required!");
      return;
    }
    if (!planPrice || planPrice <= 0) {
      message.error("Valid price is required!");
      return;
    }
    if (!planType) {
      message.error("Billing type is required!");
      return;
    }
    if (!planCategory) {
      message.error("Category is required!");
      return;
    }
    if (!planImage) {
      message.error("Plan image is required!");
      return;
    }
    if (
      planFeatures.length === 0 ||
      planFeatures.some((feature) => !feature.trim())
    ) {
      message.error("At least one valid feature is required!");
      return;
    }

    try {
      // Create FormData for API submission
      const formData = new FormData();
      formData.append("title", planName.trim());
      formData.append("price", planPrice.toString());
      formData.append("type", planType);
      formData.append("category", planCategory);

      // For company category, only add jobCount
      if (planCategory === "company") {
        formData.append(
          "jobCount",
          isUnlimitedJob ? "unlimited" : jobCount.toString()
        );
      } else {
        // For freelancer and client, add both tenderCount and jobCount
        formData.append(
          "tenderCount",
          isUnlimitedTender ? "unlimited" : tenderCount.toString()
        );
        formData.append(
          "jobCount",
          isUnlimitedJob ? "unlimited" : jobCount.toString()
        );
      }

      formData.append("isBadge", isBadge.toString());
      formData.append("isSupport", isSupport.toString());

      // Add benefits as separate entries
      const validFeatures = planFeatures.filter((feature) => feature.trim());
      validFeatures.forEach((benefit, index) => {
        formData.append("benefits", benefit);
      });

      // Add image file if present
      if (planImage) {
        formData.append("image", planImage);
      }

      if (editingSubscription) {
        await updateSubscription({
          id: editingSubscription._id,
          data: formData,
        }).unwrap();
        message.success("Subscription updated successfully!");
      } else {
        await createSubscription(formData).unwrap();
        message.success("Subscription created successfully!");
      }

      setIsModalVisible(false);
      setEditingSubscription(null);
      setPlanName("");
      setPlanPrice(0);
      setPlanType("month");
      setPlanCategory("freelancer");
      setPlanFeatures([]);
      setPlanImage(null);
      setTenderCount(3);
      setJobCount(3);
      setIsUnlimitedTender(false);
      setIsUnlimitedJob(false);
      setIsBadge(false);
      setIsSupport(false);
    } catch (error) {
      message.error("Failed to save subscription");
      console.error("Error:", error);
    }
  };

  const addFeature = () => {
    setPlanFeatures([...planFeatures, ""]);
  };

  const removeFeature = (index) => {
    const newFeatures = [...planFeatures];
    newFeatures.splice(index, 1);
    setPlanFeatures(newFeatures);
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...planFeatures];
    newFeatures[index] = value;
    setPlanFeatures(newFeatures);
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
        return false;
      }
      // Store the file for later use
      setPlanImage(file);
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      if (info.fileList.length > 1) {
        message.warning("Only one image is allowed!");
        info.fileList.splice(0, 1); // Remove the first file
      }
    },
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Button
            type={activeTab === "freelancer" ? "primary" : "default"}
            className={`mr-2 ${activeTab === "freelancer" ? "bg-[#002282]" : ""
              }`}
            onClick={() => setActiveTab("freelancer")}
          >
            Freelancer
          </Button>
          <Button
            type={activeTab === "client" ? "primary" : "default"}
            className={activeTab === "client" ? "bg-[#002282] mr-2" : "mr-2"}
            onClick={() => setActiveTab("client")}
          >
            Client
          </Button>

          <Button
            type={activeTab === "company" ? "primary" : "default"}
            className={activeTab === "company" ? "bg-[#002282]" : ""}
            onClick={() => setActiveTab("company")}
          >
            Company
          </Button>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateSubscription}
        >
          Add New Subscription Plan
        </Button>
      </div>

      <div className="rounded-md">
        {activeTab === "freelancer" ? (
          <FreeLacherSubscription
            subscriptions={freelancerSubscriptions}
            onEdit={handleEditSubscription}
          />
        ) : activeTab === "client" ? (
          <ClientSubscription
            subscriptions={clientSubscriptions}
            onEdit={handleEditSubscription}
          />
        ) : (
          <ClientSubscription
            subscriptions={companySubscriptions}
            onEdit={handleEditSubscription}
          />
        )}
      </div>

      <Modal
        title="Change Plan Details"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
        width={800}
      >
        <div className="flex">
          <div className="w-1/2 pr-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Change Plan Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Enter plan name"
                className="w-full"
                status={!planName.trim() ? "error" : ""}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <InputNumber
                value={planPrice}
                onChange={(value) => setPlanPrice(value)}
                placeholder="Enter price"
                min={0}
                style={{ width: "100%" }}
                addonBefore="$"
                status={!planPrice || planPrice <= 0 ? "error" : ""}
              />
            </div>

            {/* Tender Count - Only show for freelancer and client */}
            {planCategory !== "company" && (
              <div className="mb-4">
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Tender Count
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="unlimitedTender"
                      name="tenderType"
                      checked={isUnlimitedTender}
                      onChange={() => setIsUnlimitedTender(true)}
                      className="mr-2"
                    />
                    <label htmlFor="unlimitedTender" className="text-gray-700">
                      Unlimited
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="limitedTender"
                      name="tenderType"
                      checked={!isUnlimitedTender}
                      onChange={() => setIsUnlimitedTender(false)}
                      className="mr-2"
                    />
                    <label htmlFor="limitedTender" className="text-gray-700">
                      Others
                    </label>
                  </div>
                  {!isUnlimitedTender && (
                    <InputNumber
                      value={tenderCount}
                      onChange={(value) => setTenderCount(value)}
                      placeholder="Enter tender count"
                      min={1}
                      style={{ width: "100%" }}
                      addonAfter="tenders"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Job Count - Show for all categories */}
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Job Count
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="unlimitedJob"
                    name="jobType"
                    checked={isUnlimitedJob}
                    onChange={() => setIsUnlimitedJob(true)}
                    className="mr-2"
                  />
                  <label htmlFor="unlimitedJob" className="text-gray-700">
                    Unlimited
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="limitedJob"
                    name="jobType"
                    checked={!isUnlimitedJob}
                    onChange={() => setIsUnlimitedJob(false)}
                    className="mr-2"
                  />
                  <label htmlFor="limitedJob" className="text-gray-700">
                    Others
                  </label>
                </div>
                {!isUnlimitedJob && (
                  <InputNumber
                    value={jobCount}
                    onChange={(value) => setJobCount(value)}
                    placeholder="Enter job count"
                    min={1}
                    style={{ width: "100%" }}
                    addonAfter="jobs"
                  />
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Additional Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isBadge}
                    onChange={(e) => setIsBadge(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Is Badge</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSupport}
                    onChange={(e) => setIsSupport(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Is Support</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Billing Type <span className="text-red-500">*</span>
              </label>
              <Radio.Group
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
              >
                <Radio value="month">Monthly</Radio>
                <Radio value="year">Yearly</Radio>
              </Radio.Group>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <Radio.Group
                value={planCategory}
                onChange={(e) => setPlanCategory(e.target.value)}
              >
                <Radio value="freelancer">Freelancer</Radio>
                <Radio value="client">Client</Radio>
                <Radio value="company">Company</Radio>
              </Radio.Group>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Plan Image <span className="text-red-500">*</span>
              </label>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>
                  {planImage ? "Change Image" : "Upload Image"}
                </Button>
              </Upload>
              {planImage && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ Image uploaded successfully
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-lg font-semibold">
                  Change Subscription Feature{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addFeature}
                  shape="circle"
                />
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {planFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-grow mr-2"
                    />
                    <Button
                      type="default"
                      icon={<MinusOutlined />}
                      onClick={() => removeFeature(index)}
                      shape="circle"
                      className="flex-shrink-0 hover:text-red-500 hover:border-red-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-1/2 pl-4">
            <Card className="border shadow-sm">
              <div className="flex flex-col items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  {planImage ? (
                    <img
                      src={planImage}
                      alt={planName}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  )}
                </div>
                <h3 className="text-primary text-xl font-medium">
                  {planName || "Plan Name"}
                </h3>
              </div>

              <div className="text-center mb-4">
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold">${planPrice || 0}</span>
                  <span className="text-gray-600">/{planType === "month" ? "mo" : "yr"}</span>
                </div>
                <p className="text-gray-500 text-sm">Billed {planType === "month" ? "Monthly" : "Yearly"}</p>

                {/* Show Tender Count only for freelancer and client */}
                {planCategory !== "company" && (
                  <p className="text-gray-500 text-sm">
                    Tender Count:{" "}
                    {isUnlimitedTender ? "Unlimited" : `${tenderCount} tenders`}
                  </p>
                )}

                {/* Show Job Count for all categories */}
                <p className="text-gray-500 text-sm">
                  Job Count:{" "}
                  {isUnlimitedJob ? "Unlimited" : `${jobCount} jobs`}
                </p>
              </div>

              <Divider className="my-4" />

              <ul className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {planFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="text-primary mr-2 mt-1">✓</div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button type="primary" block className="h-12">
                Choose Plan
              </Button>
            </Card>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SubscriptionManagement;