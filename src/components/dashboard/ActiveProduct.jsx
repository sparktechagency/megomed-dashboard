import { Avatar, Button, Typography } from 'antd';

const { Title, Text } = Typography;

const ActiveProduct = () => {
  const projects = [
    {
      id: 1,
      name: 'CONLINE',
      type: 'UI/UX Design',
      duration: '8 Days',
      remaining: '2 Days'
    },
    {
      id: 2,
      name: 'CONLINE',
      type: 'UI/UX Design',
      duration: '8 Days',
      remaining: '2 Days'
    },
    {
      id: 3,
      name: 'CONLINE',
      type: 'UI/UX Design',
      duration: '8 Days',
      remaining: '2 Days'
    },
    {
      id: 4,
      name: 'CONLINE',
      type: 'UI/UX Design',
      duration: '8 Days',
      remaining: '2 Days'
    }
  ];

  return (
    <div className="w-full mx-auto bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!mb-0 !text-gray-800 !font-semibold">
          Active Project
        </Title>
        <Button
          type="link"
          className="!text-blue-500 !p-0 !h-auto !font-medium"
        >
          see All
        </Button>
      </div>

      {/* Project List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between py-3"
          >
            {/* Left side - Avatar and Project Info */}
            <div className="flex items-center gap-3">
              <Avatar
                size={48}
                className="bg-gray-800 flex-shrink-0"
                style={{
                  backgroundColor: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div className="w-6 h-6 border-2 border-white rounded-full relative">
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
                </div>
              </Avatar>

              <div className="flex flex-col">
                <Text className="!text-gray-800 !font-semibold !text-base !mb-1">
                  {project.name}
                </Text>
                <Text className="!text-gray-500 !text-sm">
                  {project.type} | {project.duration}
                </Text>
              </div>
            </div>

            {/* Right side - Remaining Time */}
            <div className="flex flex-col items-end text-right">
              <Text className="!text-gray-500 !text-sm !mb-1">
                Remaining
              </Text>
              <Text className="!text-gray-800 !font-medium !text-sm">
                {project.remaining}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveProduct;