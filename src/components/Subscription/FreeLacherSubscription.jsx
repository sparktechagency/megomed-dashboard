import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Empty, Popconfirm, message } from "antd";
import {
  useCreateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} from "../../features/subscription/subscriptionApi";
import { baseURLImage } from "../../utils/BaseURL";

const FreeLacherSubscription = ({ subscriptions, onEdit }) => {
  const [createSubscription] = useCreateSubscriptionMutation();
  const [deleteSubscription] = useDeleteSubscriptionMutation();

  // Transform API subscriptions into a format we can use
  const plans =
    subscriptions?.map((subscription) => ({
      id: subscription._id,
      name: subscription.title,
      price: `$${subscription.price}`,
      billingPeriod: subscription.type,
      billingInfo: `Billed ${subscription.type}`,
      icon: subscription.image
        ? `${baseURLImage}/${subscription.image.split("/").pop()}`
        : "/icons/plan1.png",
      features: subscription.benefits || [],
      tenderCount: subscription.tenderCount,
      jobCount: subscription.jobCount,
    })) || [];

  const handleCreateSubscription = () => {
    const newSubscription = {
      title: "New Freelancer Plan",
      price: 0,
      type: "monthly",
      category: "freelancher",
      benefits: ["Basic feature"],
    };

    createSubscription(newSubscription)
      .unwrap()
      .then(() => {
        // Subscription created successfully
        // The query will automatically refetch due to invalidation
      })
      .catch((error) => {
        console.error("Failed to create subscription", error);
      });
  };

  const showModal = (plan) => {
    // Find the original subscription data
    const originalSubscription = subscriptions?.find(
      (sub) => sub._id === plan.id
    );
    if (originalSubscription && onEdit) {
      onEdit(originalSubscription);
    }
  };

  const handleDelete = async (planId) => {
    try {
      await deleteSubscription(planId).unwrap();
      message.success("Subscription deleted successfully!");
      // The query will automatically refetch due to invalidation
    } catch (error) {
      message.error("Failed to delete subscription. Please try again.");
      console.error("Failed to delete subscription", error);
    }
  };

  return (
    <div className="mt-5">
      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg">
          <Empty
            description="No Freelancer Subscriptions Available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative group flex flex-col"
                bodyStyle={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                {/* Delete button - appears on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <Popconfirm
                    title="Delete Subscription"
                    description="Are you sure you want to delete this subscription plan?"
                    onConfirm={() => handleDelete(plan.id)}
                    okText="Yes, Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border-0 shadow-sm"
                      size="small"
                    />
                  </Popconfirm>
                </div>

                {/* Card content wrapper */}
                <div className="flex flex-col h-full">
                  {/* Header Section */}
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                      {typeof plan.icon === "string" ? (
                        <img
                          src={plan.icon}
                          alt={plan.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        plan.icon
                      )}
                    </div>
                    <h3 className="text-blue-600 text-xl font-semibold text-center">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price Section */}
                  <div className="text-center mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-800">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 text-lg">
                        /{plan.billingPeriod}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{plan.billingInfo}</p>

                    {/* Show counts if available */}
                    {plan.tenderCount && (
                      <p className="text-gray-600 text-xs mt-2">
                        📋 {plan.tenderCount === 1000000000000000 || plan.tenderCount === -1
                          ? "Unlimited Tenders"
                          : `${plan.tenderCount} Tenders`}
                      </p>
                    )}
                    {plan.jobCount && (
                      <p className="text-gray-600 text-xs mt-1">
                        💼 {plan.jobCount === 1000000000000000 || plan.jobCount === -1
                          ? "Unlimited Jobs"
                          : `${plan.jobCount} Jobs`}
                      </p>
                    )}
                  </div>

                  <Divider className="my-3" />

                  {/* Features section - scrollable if needed */}
                  <div className="flex-1 mb-4 overflow-y-auto" style={{ maxHeight: '240px' }}>
                    {plan.features.length > 0 ? (
                      <ul className="space-y-2 pr-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 text-lg mr-2 mt-0.5 flex-shrink-0">✓</span>
                            <span className="text-gray-700 text-sm leading-relaxed break-words">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm italic text-center">
                        No features listed
                      </p>
                    )}
                  </div>

                  {/* Edit button - stays at bottom */}
                  <div className="mt-auto pt-4">
                    <Button
                      type="primary"
                      block
                      className="h-11 font-medium"
                      onClick={() => showModal(plan)}
                    >
                      Edit Plan
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeLacherSubscription;