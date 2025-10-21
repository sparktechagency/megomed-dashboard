// import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
// import { Button, Card, Divider, Empty, Popconfirm, message } from "antd";
// import { useState } from "react";

// import { baseURLImage } from "../../utils/BaseURL";
// import {
//   useCreateSubscriptionMutation,
//   useDeleteSubscriptionMutation,
// } from "../../features/subscription/subscriptionApi";

// const ClientSubscription = ({ subscriptions, onEdit }) => {
//   const [createSubscription] = useCreateSubscriptionMutation();
//   const [deleteSubscription] = useDeleteSubscriptionMutation();

//   // Transform API subscriptions into a format we can use
//   const plans =
//     subscriptions?.map((subscription) => ({
//       id: subscription._id,
//       name: subscription.title,
//       price: `$${subscription.price}`,
//       billingPeriod: subscription.type,
//       billingInfo: `Billed ${subscription.type}`,
//       icon: subscription.image
//         ? `${baseURLImage}/${subscription.image.split("/").pop()}`
//         : "/icons/plan1.png",
//       features: subscription.benefits || [],
//     })) || [];

//   const handleCreateSubscription = () => {
//     const newSubscription = {
//       title: "New Client Plan",
//       price: 0,
//       type: "monthly",
//       category: "client",
//       benefits: ["Basic feature"],
//     };

//     createSubscription(newSubscription)
//       .unwrap()
//       .then(() => {
//         // Subscription created successfully
//         // The query will automatically refetch due to invalidation
//       })
//       .catch((error) => {
//         console.error("Failed to create subscription", error);
//       });
//   };

//   const showModal = (plan) => {
//     // Find the original subscription data
//     const originalSubscription = subscriptions?.find(
//       (sub) => sub._id === plan.id
//     );
//     if (originalSubscription && onEdit) {
//       onEdit(originalSubscription);
//     }
//   };

//   const handleDelete = async (planId) => {
//     try {
//       await deleteSubscription(planId).unwrap();
//       message.success("Subscription deleted successfully!");
//       // The query will automatically refetch due to invalidation
//     } catch (error) {
//       message.error("Failed to delete subscription. Please try again.");
//       console.error("Failed to delete subscription", error);
//     }
//   };

//   return (
//     <div className="mt-5">
//       {plans.length === 0 ? (
//         <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg">
//           <Empty
//             description="No Client Subscriptions Available"
//             image={Empty.PRESENTED_IMAGE_SIMPLE}
//           />
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             size="large"
//             className="mt-4"
//             onClick={handleCreateSubscription}
//           >
//             Create Subscription Plan
//           </Button>
//         </div>
//       ) : (
//         <div className="w-full">
//           <div className="grid grid-cols-4 gap-6">
//             {plans.map((plan) => (
//               <Card
//                 key={plan.id}
//                 className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative group h-full"
//                 style={{ minHeight: "400px" }}
//               >
//                 {/* Delete button - appears on hover */}
//                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
//                   <Popconfirm
//                     title="Delete Subscription"
//                     description="Are you sure you want to delete this subscription plan?"
//                     onConfirm={() => handleDelete(plan.id)}
//                     okText="Yes, Delete"
//                     cancelText="Cancel"
//                     okButtonProps={{ danger: true }}
//                   >
//                     <Button
//                       type="text"
//                       danger
//                       icon={<DeleteOutlined />}
//                       className="bg-red-200  text-white border-0 shadow-lg"
//                       size="small"
//                     />
//                   </Popconfirm>
//                 </div>

//                 <div className="flex flex-col items-center mb-4">
//                   <div className="w-12 h-12 rounded-full bg-100 flex items-center justify-center text-blue-600 mb-4">
//                     {typeof plan.icon === "string" ? (
//                       <img
//                         src={plan.icon}
//                         alt={plan.name}
//                         className="w-8 h-8 object-contain"
//                       />
//                     ) : (
//                       plan.icon
//                     )}
//                   </div>
//                   <h3 className="text-blue-600 text-xl font-medium">
//                     {plan.name}
//                   </h3>
//                 </div>

//                 <div className="text-center mb-4">
//                   <div className="flex items-center justify-center">
//                     <span className="text-4xl font-bold">{plan.price}</span>
//                     <span className="text-3xl font-bold">
//                       /{plan.billingPeriod}
//                     </span>
//                   </div>
//                   <p className="text-gray-500 text-sm">{plan.billingInfo}</p>
//                 </div>

//                 <Divider className="my-4" />

//                 <ul className="space-y-3 mb-4 pb-16">
//                   {plan.features.map((feature, index) => (
//                     <li key={index} className="flex items-start">
//                       <div className="text-primary mr-2 mt-1">✓</div>
//                       <span className="text-gray-600">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 <Button
//                   type="primary"
//                   block
//                   className="h-12 absolute bottom-4 left-4 right-4"
//                   onClick={() => showModal(plan)}
//                 >
//                   Edit
//                 </Button>
//               </Card>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClientSubscription;

import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Empty, Popconfirm, message } from "antd";
import { useState } from "react";

import { baseURLImage } from "../../utils/BaseURL";
import {
  useCreateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} from "../../features/subscription/subscriptionApi";

const ClientSubscription = ({ subscriptions, onEdit }) => {
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
    })) || [];

  const handleCreateSubscription = () => {
    const newSubscription = {
      title: "New Client Plan",
      price: 0,
      type: "monthly",
      category: "client",
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
            description="No Client Subscriptions Available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="mt-4"
            onClick={handleCreateSubscription}
          >
            Create Subscription Plan
          </Button>
        </div>
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative group"
                style={{ minHeight: "400px" }}
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
                      className="bg-red-200 text-white border-0 shadow-lg"
                      size="small"
                    />
                  </Popconfirm>
                </div>

                {/* Card content wrapper with flex layout */}
                <div className="flex flex-col h-full">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                      {typeof plan.icon === "string" ? (
                        <img
                          src={plan.icon}
                          alt={plan.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        plan.icon
                      )}
                    </div>
                    <h3 className="text-blue-600 text-xl font-medium">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-3xl font-bold">
                        /{plan.billingPeriod}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">{plan.billingInfo}</p>
                  </div>

                  <Divider className="my-4" />

                  {/* Features section - grows to fill available space */}
                  <div className="flex-1 mb-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="text-primary mr-2 mt-1">✓</div>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Edit button - always at bottom */}
                  <div className="mt-auto pt-4  absolute bottom-4 left-4 right-4">
                    <Button
                      type="primary"
                      block
                      className="h-12"
                      onClick={() => showModal(plan)}
                    >
                      Edit
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

export default ClientSubscription;
