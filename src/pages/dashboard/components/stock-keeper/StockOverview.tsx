import { Card } from "@/components/common/Card";

interface StockMetric {
    title: string;
    value: string | number;
    description: string;
    bgColor: string;
    textColor: string;
  }
  
  export const StockOverview: React.FC<{ metrics: StockMetric[] }> = ({ metrics }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className={`p-6 ${metric.bgColor}`}>
          <h3 className={`text-sm font-medium ${metric.textColor}`}>{metric.title}</h3>
          <p className={`mt-2 text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
          <p className={`mt-1 text-sm ${metric.textColor}`}>{metric.description}</p>
        </Card>
      ))}
    </div>
  );