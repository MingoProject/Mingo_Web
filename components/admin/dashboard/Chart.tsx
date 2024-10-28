import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const description = "A simple pie chart";

const fakeNotification = [
  { id: "1", content: "You have a new report waiting for approval", status: 1 },
  { id: "2", content: "You have a new report waiting for approval", status: 1 },
  { id: "3", content: "You have a new report waiting for approval", status: 1 },
  { id: "4", content: "You have a new report waiting for approval", status: 1 },
  { id: "5", content: "You have a new report waiting for approval", status: 1 },
  { id: "6", content: "You have a new report waiting for approval", status: 1 },
  { id: "7", content: "You have a new report waiting for approval", status: 0 },
  { id: "8", content: "You have a new report waiting for approval", status: 0 },
  { id: "9", content: "You have a new report waiting for approval", status: 1 },
  {
    id: "10",
    content: "You have a new report waiting for approval",
    status: 0,
  },
];

// Tính toán số lượng thông báo theo trạng thái
const totalNotifications = fakeNotification.length;

const notificationCount = fakeNotification.reduce(
  (acc, notification) => {
    if (notification.status === 1) {
      acc.done += 1;
    } else {
      acc.inProgress += 1;
    }
    return acc;
  },
  { done: 0, inProgress: 0 }
);

// Dữ liệu cho biểu đồ
const chartData = [
  {
    browser: "InProgress",
    visitors: notificationCount.inProgress, // Số lượng cụ thể
    fill: "var(--color-inprogress)",
  },
  {
    browser: "Done",
    visitors: notificationCount.done, // Số lượng cụ thể
    fill: "var(--color-done)",
  },
];

const chartConfig = {
  inprogress: {
    label: "InProgress",
    color: "white",
  },
  done: {
    label: "Done",
    color: "#617F67",
  },
} satisfies ChartConfig;

const Chart = () => {
  return (
    <Card className="flex size-full flex-col border-none">
      <CardHeader className="text-dark100_light500 items-center pb-0">
        <CardDescription>Last month</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center pb-0">
        <ChartContainer config={chartConfig} className="size-full">
          <PieChart width={200} height={200}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              stroke="#617F67"
              strokeWidth={1}
              fontSize={12}
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                index,
              }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                const labelColor =
                  chartData[index].browser === "InProgress" ? "black" : "white";
                const actualPercentage =
                  (chartData[index].visitors / totalNotifications) * 100;

                return (
                  <text
                    x={x}
                    y={y}
                    fill={labelColor}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={14}
                  >
                    {actualPercentage % 1 === 0
                      ? `${actualPercentage.toFixed(0)}%`
                      : `${actualPercentage.toFixed(2)}%`}{" "}
                  </text>
                );
              }} // Hiển thị phần trăm bên trong biểu đồ
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="tooltip">
                      <p>{`Status: ${payload[0].name}`}</p>
                      <p>{`Count: ${payload[0].value}`}</p>{" "}
                      {/* Hiển thị số lượng */}
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="w-full flex-col items-center justify-start gap-2 text-sm">
        <div className="flex w-1/5 items-center gap-2 font-medium leading-none">
          <FontAwesomeIcon
            icon={faSquare}
            className="text-[16px] text-primary-100"
          />
          <p className="pt-1 text-green-500">Done</p>
        </div>
        <div className="flex w-1/5 items-center gap-2 font-medium leading-none">
          <FontAwesomeIcon
            icon={faSquare}
            className="rounded-[3px] border border-primary-100 text-[14px] text-white"
          />

          <p className="whitespace-nowrap pt-1 text-red-500">In progress</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chart;
