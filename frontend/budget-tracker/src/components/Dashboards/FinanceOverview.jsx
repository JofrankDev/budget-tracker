import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart';

const colors = ["#5cf55c", "var(--color-red-500)", "#7fffd4"];
const FinanceOverview = ({totalBalance,totalIncome,totalExpense}) => {
    const balanceData = [
        {name: "Balance Total", amount: totalBalance},
        {name: "Gastos", amount: totalExpense},
        {name: "Ingresos", amount: totalIncome}
    ]
    return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'> Resumen Financiero</h5>
        </div>

        <CustomPieChart
            data={balanceData}
            label="Total Balance"
            totalAmount={`${totalBalance}`}
            colors={colors}
            showTextAnchor
        />
    </div>
  )
}

export default FinanceOverview