import moment from "moment";
import "moment/dist/locale/es";

moment.locale("es");

console.log(moment.locale());
console.log ("depsues de setear")
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
export const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    let initials = "";

    for(let i = 0; i < Math.min(words.length,2); i++) {
        initials += words[i][0];
    }
    return initials.toUpperCase();
}
export const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";

    const [integerPart, fractionalPart] = num.toString().split(".");
    const formattedInteger  = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;  
};
export const prepareExpenseBarChartData =  (data = []) => {
    const chartData = data.map((item, index) => ({
        chartKey: `${moment.utc(item.date).format("D MMM")}-${index}`,
        month: moment.utc(item?.date).format("D MMM"),
        category: item?.category,
        amount: item?.amount,
    }));

    return chartData;
};
export const prepareIncomeBarChartData = (data = []) => {
    const sortedData = [...data].sort((a,b) =>  new Date(a.date) - new Date(b.date));
    
    const chartData = sortedData.map((item,index) => ({
        chartKey: `${moment.utc(item.date).format("D MMM")}-${index}`,
        month: moment.utc(item?.date).format("D MMM"),
        amount: item?.amount,
        source: item?.source,
    }));
    return chartData;
};
export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item, index) => ({
    chartKey: `${moment.utc(item.date).locale('es').format("D MMM")}-${index}`,
    month: moment.utc(item?.date).format("D MMM"),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
};