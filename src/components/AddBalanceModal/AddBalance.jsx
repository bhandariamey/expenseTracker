
import styles from './AddBalance.module.css'
export default function AddBalance(props){
    
    const {handleAddBalance, handleCloseModal} = props
    return(
        <>
        <div className={styles.modal}>
            <h3 className={styles.header}>Add Balance</h3>
            <div className={styles.amountWrapper}>
                <form className={styles.form} onSubmit={handleAddBalance}>
                    <input className={styles.incomeAmount} type="number" placeholder='income amount' min={0} id="userEnteredAmount"/>
                    <button className={styles.addBalance} type='submit'>Add Balance</button>
                    <button className={styles.cancel} onClick={handleCloseModal}>Cancel</button>
                </form>
            </div>
        </div>
        </>
    )
}