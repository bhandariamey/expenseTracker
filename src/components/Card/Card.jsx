import { useState } from 'react'
import styles from './Card.module.css'
import ReactModal from 'react-modal';
import ExpenseModal from '../AddExpenseModal/AddExpense';
import AddBalance  from '../AddBalanceModal/AddBalance';

export default function Card(props){
    let {color, text, amount, buttonText,handleAddBalance,handleSubmit} = props


    const [showModal, setShowModal] = useState(false)
  
    const handleClick = ()=>{
        setShowModal(true)
    }

    const handleCloseModal = ()=>{
        setShowModal(false)
    }



    return(
        <div className={styles.cardWrapper}>
            <div className={styles.balanceWrapper}>
                <span className={styles.text}>{`${text}: `}</span>
                <span style={{color: color}} className={styles.amount}>{`₹${amount}`}</span>
            </div>
            <div>
                <button style={{color:'white',background: color, border:'none', padding: '7px', margin:'5px', borderRadius:'5px'}} onClick={handleClick}>{`${buttonText}`}</button>
            </div>
            <ReactModal isOpen={showModal} style={{content:{background:'lightgrey',width:'fit-content',height:'fit-content', position:'absolute', top: '50%', left:'50%', transform:'translateX(-50%) translateY(-50%)'}}}>
            {buttonText === "Add Income" 
                ?   (
                        <AddBalance handleAddBalance={handleAddBalance} handleCloseModal={handleCloseModal}/>
                    )
                :   (
                        <ExpenseModal handleSubmit={handleSubmit} handleCloseModal={handleCloseModal}/>
                    )
            }
            </ReactModal>


        </div>
    )
}