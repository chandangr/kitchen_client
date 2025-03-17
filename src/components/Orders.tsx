import NoDataIcon from "./icons/NoDataIcon";

const Orders = () => {
  return (
    <div className="w-full">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <div className="h-[calc(100vh-150px)] flex flex-col items-center justify-center">
        <NoDataIcon />
        <div className="ant-empty-description">No data</div>
      </div>
    </div>
  );
};

export default Orders;
