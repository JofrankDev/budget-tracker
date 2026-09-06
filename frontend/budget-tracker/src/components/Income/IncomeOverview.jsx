import React, { useEffect, useState } from 'react'
import { prepareIncomeBarChartData } from '../../utils/helper';
import { LuPlus } from 'react-icons/lu';
import CustomBarChart from '../Charts/CustomBarChart';
const IncomeOverview = ({transactions, onAddIncome}) => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions])
    return (
    <div className="card">
    <div className="flex items-center justify-between">
      <div className="">
        <h5 className="text-lg">Resumen de Ingresos</h5>
        <p className="text-xs text-gray-400 mt-0.5">
          Haz un seguimiento de tus ingresos y busca tendencias!!!
        </p>
      </div>

      <button className="add-btn" onClick={onAddIncome}>
        <LuPlus className="text-lg" />
        Agregar Ingreso
      </button>
    </div>

    <div className="mt-10">
      <CustomBarChart data={chartData}/>
    </div>
  </div>
  )
}

export default IncomeOverview