import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'

const RecentIncome = ({data, onSeeMore}) => {
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Ingresos</h5>
            <button className='card-btn' onClick={onSeeMore}>
                Ver Todo <LuArrowRight className='text-base'/>
            </button>
        </div>

        <div className='mt-6'>
            {data?.slice(0,5)?.map((item) => (
                <TransactionInfoCard
                    key={item._id}
                    title={item.source}
                    icon={item.icon}
                    date={moment(item.date).format('D MMM YYYY')}
                    amount={item.amount}
                    type="income"
                    hideDeleteBtn
                />
            ))}
        </div>
    </div>
  )
}

export default RecentIncome