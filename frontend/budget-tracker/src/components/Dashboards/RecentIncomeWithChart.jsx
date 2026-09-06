import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const colors = ["#875CF5", "#FA2C37", "#22C55E" ,"#4f39f6"];
const RecentIncomeWithChart = ({data, totalIncome}) => {

    const [charData, setChartData] = useState([]);
    const prepareChartData = () => {
     //    console.log("1. DATA RECIBIDA:", data);
        const dataArr = data?.map((item) => ({
        name: item?.source,
        amount: item?.amount,
    }));
    // console.log("2. DATA TRANSFORMADA:", dataArr);
    setChartData(dataArr);
    };  

    useEffect(() => {
        prepareChartData();
        return () => {};
    }, [data]);
  // console.log("3. CHART DATA STATE:", charData);
  //console.log("4. TOTAL INCOME:", totalIncome);
    return (
    <div className='card'>
        <div className='flex items-center justify-between '>
            <h5 className='text-lg'> Ultimos Ingresos</h5>
        </div>

        <CustomPieChart
            data={charData}
            label="Ingresos ultimos 2 meses"
            totalAmount={`$${totalIncome}`}
            showTextAnchor
            colors={colors}
        />
    </div>
  )
}

export default RecentIncomeWithChart