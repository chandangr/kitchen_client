import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LineChartDemo } from "./ui/charts/line-chart";

const paymentsData = [
  { status: "Success", email: "ken99@example.com", amount: "$316.00" },
  { status: "Success", email: "abe45@example.com", amount: "$242.00" },
  { status: "Processing", email: "monserrat44@example.com", amount: "$837.00" },
  { status: "Failed", email: "carmella@example.com", amount: "$721.00" },
];

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">$45,231.89</div>
                <div className="text-sm text-muted-foreground">
                  +20.1% from last month
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">+2,350</div>
                <div className="text-sm text-muted-foreground">
                  +180.1% from last month
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">+12,234</div>
                <div className="text-sm text-muted-foreground">
                  +19% from last month
                </div>
              </CardContent>
            </Card>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Sales</h2>
            <Button variant="outline">Download</Button>
          </div>
          <div className="mt-4">
            <div className="flex flex-col space-y-2">
              {[
                {
                  name: "Olivia Martin",
                  email: "olivia.martin@email.com",
                  amount: "$1,999.00",
                },
                {
                  name: "Jackson Lee",
                  email: "jackson.lee@email.com",
                  amount: "$39.00",
                },
                {
                  name: "Isabella Nguyen",
                  email: "isabella.nguyen@email.com",
                  amount: "$299.00",
                },
                {
                  name: "William Kim",
                  email: "william@email.com",
                  amount: "$99.00",
                },
                {
                  name: "Sofia Davis",
                  email: "sofia.davis@email.com",
                  amount: "$39.00",
                },
              ].map((sale) => (
                <div
                  key={sale.name}
                  className="flex items-center justify-between p-4 border-b"
                >
                  <div className="flex items-center">
                    <Avatar className="mr-2" />
                    <div>
                      <div className="font-semibold">{sale.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {sale.email}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold">{sale.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your payments.
              </p>
              <input
                type="text"
                placeholder="Filter emails..."
                className="mt-2 mb-4 p-2 border rounded"
              />
            </CardHeader>
            <CardContent>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left">Status</th>
                    <th className="text-left">Email</th>
                    <th className="text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsData.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.status}</td>
                      <td>{payment.email}</td>
                      <td>{payment.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between mt-4">
                <span>0 of {paymentsData.length} row(s) selected.</span>
                <div>
                  <Button variant="outline" className="mr-2">
                    Previous
                  </Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <LineChartDemo />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
